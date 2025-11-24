using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;
using System.Net.Mail;
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

    [Authorize] // keep it if your app requires auth to edit own profile
    [HttpPatch("{id:guid}/info")]
    public async Task<IActionResult> PatchInfo(Guid id, [FromBody] ProfileInfoUpdateDto dto)
    {
        var profile = await db.Profiles.FirstOrDefaultAsync(p => p.Id == id);
        if (profile == null) return NotFound();

        // Ownership check (same style as your PUT)
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userIdStr != null && Guid.TryParse(userIdStr, out var userId))
        {
            if (profile.UserId != null && profile.UserId != userId)
                return Forbid();
        }

        // Nothing provided?
        if (dto.Email is null && dto.Name is null && dto.Bio is null && dto.Phone is null)
            return BadRequest(new { message = "No fields to update." });

        // Prepare new values with trimming
        string? newEmail = dto.Email?.Trim();
        string? newName = dto.Name?.Trim();
        string? newBio = dto.Bio;    // allow empty string to clear
        string? newPhone = dto.Phone;  // allow empty string to clear

        // Validate Email if provided
        // Email empty
        if (string.IsNullOrWhiteSpace(newEmail))
        {
            var ms = new ModelStateDictionary();
            ms.AddModelError(nameof(dto.Email), "Email cannot be empty.");
            return ValidationProblem(ms);
        }

        // Email invalid
        try { _ = new System.Net.Mail.MailAddress(newEmail); }
        catch
        {
            var ms = new ModelStateDictionary();
            ms.AddModelError(nameof(dto.Email), "Email is not valid.");
            return ValidationProblem(ms);
        }

        // Name empty
        if (dto.Name is not null && string.IsNullOrWhiteSpace(newName))
        {
            var ms = new ModelStateDictionary();
            ms.AddModelError(nameof(dto.Name), "Name cannot be empty.");
            return ValidationProblem(ms);
        }

        // Apply updates (only for provided fields)
        if (dto.Email is not null) profile.Email = newEmail!;
        if (dto.Name is not null) profile.Name = newName!;
        if (dto.Bio is not null) profile.Bio = string.IsNullOrEmpty(newBio) ? null : newBio.Trim();
        if (dto.Phone is not null) profile.Phone = string.IsNullOrEmpty(newPhone) ? null : newPhone.Trim();

        await db.SaveChangesAsync();
        return Ok(new
        {
            profile.Id,
            profile.Email,
            profile.Name,
            profile.Bio,
            profile.Phone,
            profile.AvatarUrl,
            profile.CreatedAt
        });
    }
}