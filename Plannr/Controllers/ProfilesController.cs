using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Consumes("application/json")]
public class ProfilesController(ApplicationDbContext db) : ControllerBase
{
    // POST: /api/profiles
    // Opret en ny profil. Email er unik.
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

        // Trim for at undgå "whitespace-unikke" sjov
        input.Email = input.Email.Trim();
        input.Name = input.Name.Trim();

        // Find eksisterende på email (case-insensitive)
        bool exists = await db.Profiles
            .AnyAsync(p => p.Email.ToLower() == input.Email.ToLower());
        if (exists)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Email already exists",
                Status = StatusCodes.Status409Conflict,
                Detail = $"A profile with email '{input.Email}' already exists."
            });
        }

        if (input.Id == Guid.Empty)
            input.Id = Guid.NewGuid();

        // Navigation må ikke bindes ind fra klienten
        input.EventsCreated = new List<Event>();

        db.Profiles.Add(input);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
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