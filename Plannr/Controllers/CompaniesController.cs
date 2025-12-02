using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;
using Plannr.Api.Models;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController(ApplicationDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Company input)
    {
        if (string.IsNullOrWhiteSpace(input.Name))
            return BadRequest("Company name is required.");

        input.Id = Guid.NewGuid();
        input.CreatedAt = DateTimeOffset.UtcNow;

        db.Companies.Add(input);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var company = await db.Companies
            .Include(c => c.Profile)
            .Include(c => c.Users)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == id);

        return company is null ? NotFound() : Ok(company);
    }

    // Add more endpoints as needed (update, delete, list, etc.)
}