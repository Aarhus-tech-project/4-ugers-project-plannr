using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Consumes("application/json")]
public class EventsController(ApplicationDbContext db) : ControllerBase
{
    // GET: /api/events
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Owned types (Location, Access, Attendance) bliver indlæst sammen med Event.
        // Vi inkluderer bare de eksplicitte relationer.
        List<Event> events = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .Include(e => e.Creator)
            .OrderBy(e => e.StartAt)
            .ToListAsync();

        return Ok(events);
    }

    // GET: /api/events/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        Event? ev = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .Include(e => e.Creator)
            .FirstOrDefaultAsync(e => e.Id == id);

        return ev is null ? NotFound() : Ok(ev);
    }

    // POST: /api/events
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Event input)
    {
        // Basal modelvalidering
        if (string.IsNullOrWhiteSpace(input.Title))
            ModelState.AddModelError(nameof(input.Title), "Title is required.");

        if (string.IsNullOrWhiteSpace(input.Format))
            input.Format = "inperson";

        // Understøt evt. DateRange adapter
        if (input.DateRange is not null)
        {
            input.StartAt = input.DateRange.StartAt;
            input.EndAt = input.DateRange.EndAt;
        }

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (input.Id == Guid.Empty)
            input.Id = Guid.NewGuid();

        // CreatorId skal findes eller oprettes
        if (input.CreatorId == Guid.Empty)
        {
            // fallback til seed-bruger
            var seed = new Profile
            {
                Id = Guid.NewGuid(),
                Email = "test@plannr.local",
                Name = "Seeder"
            };
            db.Profiles.Add(seed);
            await db.SaveChangesAsync();
            input.CreatorId = seed.Id;
        }
        else
        {
            var exists = await db.Profiles.AnyAsync(p => p.Id == input.CreatorId);
            if (!exists)
            {
                ModelState.AddModelError(nameof(input.CreatorId), "CreatorId does not exist.");
                return ValidationProblem(ModelState);
            }
        }

        // Sæt FK på under-entities
        if (input.Images is { Count: > 0 })
            foreach (var img in input.Images) img.EventId = input.Id;

        if (input.Prompts is { Count: > 0 })
            foreach (var pr in input.Prompts) pr.EventId = input.Id;

        input.Creator = null!;

        db.Events.Add(input);

        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Oversæt kendte DB-fejl til pæn ProblemDetails
            // Postgres FK: 23503, Unique: 23505, Check: 23514, Invalid json: 22P02 (m.fl.)
            var problem = new ProblemDetails
            {
                Title = "Database update failed",
                Status = StatusCodes.Status400BadRequest,
                Detail = ex.InnerException?.Message ?? ex.Message
            };
            return StatusCode(problem.Status.Value, problem);
        }

        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    // PUT: /api/events/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Event update)
    {
        Event? existing = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (existing is null)
            return NotFound();

        existing.Title = update.Title;
        existing.Description = update.Description;
        existing.StartAt = update.StartAt;
        existing.EndAt = update.EndAt;

        // Format som string ("inperson" | "online" | "hybrid")
        existing.Format = string.IsNullOrWhiteSpace(update.Format) ? existing.Format : update.Format;

        existing.AgeRestriction = update.AgeRestriction;

        existing.Location = update.Location;

        existing.Access = update.Access;

        existing.Attendance = update.Attendance;

        existing.Themes = update.Themes;

        existing.Sections = update.Sections;

        await db.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: /api/events/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        Event? ev = await db.Events.FindAsync(id);
        if (ev is null)
            return NotFound();

        db.Events.Remove(ev);
        await db.SaveChangesAsync();
        return NoContent();
    }
}