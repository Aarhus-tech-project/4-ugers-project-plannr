using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;
using System.Security.Claims;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Consumes("application/json")]
public class ProfilesController(ApplicationDbContext db) : ControllerBase
{
    // POST: /api/profiles
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody, Bind("Email,Name,Bio,Phone,AvatarUrl")] Profile input)
    {
        if (string.IsNullOrWhiteSpace(input.Email))
            ModelState.AddModelError(nameof(input.Email), "Email is required.");
        if (string.IsNullOrWhiteSpace(input.Name))
            ModelState.AddModelError(nameof(input.Name), "Name is required.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        input.Email = input.Email.Trim();
        input.Name = input.Name.Trim();

        bool exists = await db.Profiles
            .AnyAsync(p => p.Email.ToLower() == input.Email.ToLower());
        if (exists)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Error, use a different email",
                Status = StatusCodes.Status409Conflict,
                Detail = $""
            });
        }

        if (input.Id == Guid.Empty)
            input.Id = Guid.NewGuid();

        input.EventsCreated = new List<Event>();

        db.Profiles.Add(input);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    // PUT: /api/profiles/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Profile updated)
    {
        if (id != updated.Id && updated.Id != Guid.Empty)
            return BadRequest("Profile ID mismatch.");

        var profile = await db.Profiles.FindAsync(id);
        if (profile == null)
            return NotFound();

        // Ejer-check (valgfri men anbefalet)
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userIdStr != null && Guid.TryParse(userIdStr, out var userId))
        {
            if (profile.UserId != null && profile.UserId != userId)
                return Forbid();
        }

        // Basale felter
        profile.Name = string.IsNullOrWhiteSpace(updated.Name) ? profile.Name : updated.Name.Trim();
        profile.Email = string.IsNullOrWhiteSpace(updated.Email) ? profile.Email : updated.Email.Trim();
        profile.Bio = updated.Bio;
        profile.Phone = updated.Phone;
        profile.AvatarUrl = updated.AvatarUrl;

        if (updated.InterestedEvents is not null)
            profile.InterestedEvents = updated.InterestedEvents.Distinct().ToList();
        if (updated.GoingToEvents is not null)
            profile.GoingToEvents = updated.GoingToEvents.Distinct().ToList();
        if (updated.CheckedInEvents is not null)
            profile.CheckedInEvents = updated.CheckedInEvents.Distinct().ToList();
        if (updated.NotInterestedEvents is not null)
            profile.NotInterestedEvents = updated.NotInterestedEvents.Distinct().ToList();

        await db.SaveChangesAsync();
        return Ok(profile);
    }

    // GET: /api/profiles/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var profile = await db.Profiles.FindAsync(id);
        return profile is null ? NotFound() : Ok(profile);
    }

    // GET: /api/profiles/by-email/{email}
    [HttpGet("by-email/{email}")]
    public async Task<IActionResult> GetByEmail([FromRoute] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Email is required." });

        var profile = await db.Profiles
            .FirstOrDefaultAsync(p => p.Email.ToLower() == email.Trim().ToLower());

        return profile is null ? NotFound() : Ok(profile);
    }
}