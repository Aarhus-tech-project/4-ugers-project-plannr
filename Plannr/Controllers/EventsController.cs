using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController(ApplicationDbContext db) : ControllerBase
{
    // GET: /api/events
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var events = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .Include(e => e.Creator)
            .ToListAsync();

        return Ok(events);
    }

    // GET: /api/events/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var ev = await db.Events
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
        if (string.IsNullOrWhiteSpace(input.Title))
            return BadRequest(new { message = "Title is required." });

        if (input.Id == Guid.Empty)
            input.Id = Guid.NewGuid();

        // Hvis ingen creator er angivet, opret midlertidig bruger (til test)
        if (input.CreatorId == Guid.Empty)
        {
            var profile = new Profile
            {
                Id = Guid.NewGuid(),
                Email = "test@plannr.local",
                Name = "Seeder"
            };
            db.Profiles.Add(profile);
            await db.SaveChangesAsync();
            input.CreatorId = profile.Id;
        }

        db.Events.Add(input);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    // PUT: /api/events/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Event update)
    {
        var existing = await db.Events.FindAsync(id);
        if (existing is null)
            return NotFound();

        existing.Title = update.Title;
        existing.Description = update.Description;
        existing.StartAt = update.StartAt;
        existing.EndAt = update.EndAt;
        existing.AllDay = update.AllDay;
        existing.Format = update.Format;
        existing.InterestedCount = update.InterestedCount;
        existing.ThemeName = update.ThemeName;
        existing.ThemeIcon = update.ThemeIcon;
        existing.Location = update.Location;

        await db.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: /api/events/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ev = await db.Events.FindAsync(id);
        if (ev is null)
            return NotFound();

        db.Events.Remove(ev);
        await db.SaveChangesAsync();
        return NoContent();
    }
}