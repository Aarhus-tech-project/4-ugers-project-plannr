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

    public async Task<IActionResult> Create(
       [FromBody, Bind(
            "Title,Description,Format,StartAt,EndAt,AgeRestriction," +
            "Location,Access,Attendance,Themes,Sections,Images,Prompts,CreatorId"
        )] Event input)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (string.IsNullOrWhiteSpace(input.Title))
            ModelState.AddModelError(nameof(input.Title), "Title is required.");

        if (string.IsNullOrWhiteSpace(input.Format))
            input.Format = "inperson"; // fallback

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (input.Id == Guid.Empty)
            input.Id = Guid.NewGuid();

        // Fallback creator til testmiljø
        if (input.CreatorId == Guid.Empty)
        {
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

        // Sæt FK på child entities
        if (input.Images is { Count: > 0 })
            foreach (var img in input.Images) img.EventId = input.Id;

        if (input.Prompts is { Count: > 0 })
            foreach (var pr in input.Prompts) pr.EventId = input.Id;

        db.Events.Add(input);
        await db.SaveChangesAsync();

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