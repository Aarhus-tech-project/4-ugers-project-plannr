using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult App() => Ok(new { status = "ok", time = DateTimeOffset.UtcNow });

    [HttpGet("db")]
    public async Task<IActionResult> Db([FromServices] ApplicationDbContext db)
    {
        try
        {
            bool can = await db.Database.CanConnectAsync();
            if (!can) return StatusCode(503, new { status = "db_unreachable" });

            // ekstra sanity: kør en helt simpel query
            int now = await db.Database.ExecuteSqlRawAsync("select 1");
            return Ok(new { status = "ok", code = now });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "db_error", error = ex.Message });
        }
    }
}