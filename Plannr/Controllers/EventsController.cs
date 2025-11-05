using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    private async Task<Guid?> GetProfileIdForCurrentUser()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var userId))
            return null;

        return await db.Profiles
            .Where(p => p.UserId == userId)
            .Select(p => p.Id)
            .FirstOrDefaultAsync();
    }

    // GET: /api/events
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var events = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .Include(e => e.Creator)
            .OrderBy(e => e.StartAt)
            .ToListAsync();

        return Ok(events);
    }

    // GET: /api/events/{id}
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var ev = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .Include(e => e.Creator)
            .FirstOrDefaultAsync(e => e.Id == id);

        return ev is null ? NotFound() : Ok(ev);
    }

    // NEW: GET /api/events/search?theme=Art OR ?lat=...&lon=...&rangeKm=50
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search(
        [FromQuery] string? theme,
        [FromQuery] double? lat,
        [FromQuery] double? lon,
        [FromQuery] double? rangeKm,
        [FromQuery] int take = 100)
    {
        if (string.IsNullOrWhiteSpace(theme) && (!lat.HasValue || !lon.HasValue || !rangeKm.HasValue))
            return BadRequest(new { message = "Provide either theme or lat/lon/rangeKm." });

        take = Math.Clamp(take, 1, 500);

        IQueryable<Event> q = db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .Include(e => e.Creator);

        // Theme filter (Themes er text[] i Postgres)
        if (!string.IsNullOrWhiteSpace(theme))
        {
            var t = theme.Trim();
            // Npgsql understøtter EF-contains på List<string> → ANY @> m.m.; dette bliver til array-contains
            q = q.Where(e => e.Themes != null && e.Themes.Contains(t));
        }

        // Geo filter med Haversine (km)
        if (lat.HasValue && lon.HasValue && rangeKm.HasValue)
        {
            // Konstanter til EF-oversættelse
            const double EarthRadiusKm = 6371.0;
            double targetLat = lat.Value;
            double targetLon = lon.Value;
            double rad = Math.PI / 180.0;
            double maxKm = Math.Max(0, rangeKm.Value);

            // Filtrér bort null locations først
            q = q.Where(e => e.Location != null && e.Location.Latitude != null && e.Location.Longitude != null);

            // Haversine: 2*R*asin(sqrt(sin²(dφ/2)+cos φ1 cos φ2 sin²(dλ/2)))
            q = q.Where(e =>
                EarthRadiusKm * 2.0 *
                Math.Asin(
                    Math.Sqrt(
                        Math.Pow(Math.Sin(((double)e.Location!.Latitude!.Value * rad - targetLat * rad) / 2.0), 2.0) +
                        Math.Cos(targetLat * rad) *
                        Math.Cos((double)e.Location!.Latitude!.Value * rad) *
                        Math.Pow(Math.Sin((((double)e.Location!.Longitude!.Value - targetLon) * rad) / 2.0), 2.0)
                    )
                ) <= maxKm
            )
            // Så vi får de nærmeste først: beregn samme distance i OrderBy
            .OrderBy(e =>
                EarthRadiusKm * 2.0 *
                Math.Asin(
                    Math.Sqrt(
                        Math.Pow(Math.Sin(((double)e.Location!.Latitude!.Value * rad - targetLat * rad) / 2.0), 2.0) +
                        Math.Cos(targetLat * rad) *
                        Math.Cos((double)e.Location!.Latitude!.Value * rad) *
                        Math.Pow(Math.Sin((((double)e.Location!.Longitude!.Value - targetLon) * rad) / 2.0), 2.0)
                    )
                )
            );
        }
        else
        {
            // Hvis kun theme, så behold en stabil sortering
            q = q.OrderBy(e => e.StartAt);
        }

        var results = await q.Take(take).ToListAsync();
        return Ok(results);
    }

    // POST: /api/events  (kræver login)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Event input)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
            ModelState.AddModelError(nameof(input.Title), "Title is required.");

        if (string.IsNullOrWhiteSpace(input.Format))
            input.Format = "inperson";

        if (input.DateRange is not null)
        {
            input.StartAt = input.DateRange.StartAt;
            input.EndAt = input.DateRange.EndAt;
        }

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var profileId = await GetProfileIdForCurrentUser();
        if (profileId is null || profileId == Guid.Empty)
            return Forbid();

        input.Id = input.Id == Guid.Empty ? Guid.NewGuid() : input.Id;
        input.CreatorId = profileId.Value;
        input.Creator = null!;

        if (input.Images is { Count: > 0 })
            foreach (var img in input.Images) img.EventId = input.Id;
        if (input.Prompts is { Count: > 0 })
            foreach (var pr in input.Prompts) pr.EventId = input.Id;

        db.Events.Add(input);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    // PUT: /api/events/{id}  (kræver login og ejerskab)
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] Event update)
    {
        var existing = await db.Events
            .Include(e => e.Images)
            .Include(e => e.Prompts)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (existing is null) return NotFound();

        var profileId = await GetProfileIdForCurrentUser();
        if (profileId is null || profileId != existing.CreatorId)
            return Forbid();

        existing.Title = update.Title;
        existing.Description = update.Description;
        existing.Format = string.IsNullOrWhiteSpace(update.Format) ? existing.Format : update.Format;
        existing.StartAt = update.DateRange?.StartAt ?? update.StartAt;
        existing.EndAt = update.DateRange?.EndAt ?? update.EndAt;
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
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ev = await db.Events.FindAsync(id);
        if (ev is null) return NotFound();

        var profileId = await GetProfileIdForCurrentUser();
        if (profileId is null || profileId != ev.CreatorId)
            return Forbid();

        db.Events.Remove(ev);
        await db.SaveChangesAsync();
        return NoContent();
    }
}