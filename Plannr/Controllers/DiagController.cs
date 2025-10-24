using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("diag")]
public class DiagController : ControllerBase
{
    private readonly IConfiguration _cfg;

    public DiagController(IConfiguration cfg) => _cfg = cfg;

    [HttpGet("config")]
    public IActionResult GetConfig()
    {
        var raw = _cfg.GetConnectionString("DefaultConnection") ?? "(null)";
        var env1 = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
        var env2 = Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection"); // just in case

        // Mask password but show host/user/db
        string host = "(n/a)", user = "(n/a)", db = "(n/a)", ssl = "(n/a)";
        try
        {
            var b = new NpgsqlConnectionStringBuilder(raw);
            host = b.Host;
            user = b.Username;
            db = b.Database;
            ssl = b.SslMode.ToString();
        }
        catch { /* ignore parse errors */ }

        return Ok(new
        {
            DefaultConnection_present = raw != "(null)",
            Parsed = new { host, user, db, ssl },
            RawLength = raw.Length,
            Env_ConnStrings__DefaultConnection = env1 != null ? "(set)" : "(null)",
            Env_ConnStrings_Colon_DefaultConnection = env2 != null ? "(set)" : "(null)"
        });
    }
}