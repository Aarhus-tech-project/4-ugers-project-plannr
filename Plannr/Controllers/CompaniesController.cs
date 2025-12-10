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
        Company? company = await db.Companies
            .Include(c => c.Profile)
            .Include(c => c.Users)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == id);

        return company is null ? NotFound() : Ok(company);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Company input)
    {
        Company? existingCompany = await db.Companies.FindAsync(id);
        if (existingCompany is null)
            return NotFound();

        if (string.IsNullOrWhiteSpace(input.Name))
            return BadRequest("Company name is required.");

        existingCompany.Name = input.Name;
        existingCompany.Description = input.Description;
        existingCompany.LogoUrl = input.LogoUrl;

        db.Companies.Update(existingCompany);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        Company? company = await db.Companies.FindAsync(id);
        if (company is null)
            return NotFound();

        db.Companies.Remove(company);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        List<Company>? companies = await db.Companies
            .Include(c => c.Profile)
            .Include(c => c.Users)
            .Include(c => c.Events)
            .ToListAsync();

        return Ok(companies);
    }
}