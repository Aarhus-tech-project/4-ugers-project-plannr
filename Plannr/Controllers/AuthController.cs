using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;
using Plannr.Api.Services;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Consumes("application/json")]
public class AuthController(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    ApplicationDbContext db,
    JwtTokenService jwt) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        // check email unique (Identity har også constraint)
        var existing = await userManager.FindByEmailAsync(req.Email);
        if (existing is not null)
            return Conflict(new ProblemDetails { Title = "Email already exists", Status = 409 });

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Email = req.Email.Trim(),
            UserName = req.Email.Trim(),
            DisplayName = req.Name
        };

        var result = await userManager.CreateAsync(user, req.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        // Create Profile linked to user
        var profile = new Profile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Email = user.Email!,
            Name = req.Name ?? user.Email!,
            AvatarUrl = req.AvatarUrl,
            Phone = req.Phone
        };
        db.Profiles.Add(profile);
        await db.SaveChangesAsync();

        var token = jwt.CreateToken(user, profile.Id);

        return Ok(new
        {
            token,
            profile = new
            {
                profile.Id,
                profile.Name,
                profile.Email,
                profile.AvatarUrl,
                profile.Phone
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var user = await userManager.FindByEmailAsync(req.Email);
        if (user is null)
            return Unauthorized(new { message = "Invalid credentials." });

        var valid = await userManager.CheckPasswordAsync(user, req.Password);
        if (!valid)
            return Unauthorized(new { message = "Invalid credentials." });

        var profileId = await db.Profiles
            .Where(p => p.UserId == user.Id)
            .Select(p => p.Id)
            .FirstOrDefaultAsync();

        if (profileId == Guid.Empty)
            return Problem("Profile missing for user.", statusCode: 500);

        var token = jwt.CreateToken(user, profileId);

        return Ok(new { token, profileId });
    }
}

public class RegisterRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = default!;

    [Required, MinLength(6)]
    public string Password { get; set; } = default!;

    [Required, MaxLength(200)]
    public string Name { get; set; } = default!;

    [MaxLength(1000)]
    public string? AvatarUrl { get; set; }

    [MaxLength(50)]
    public string? Phone { get; set; }
}

public class LoginRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = default!;

    [Required]
    public string Password { get; set; } = default!;
}