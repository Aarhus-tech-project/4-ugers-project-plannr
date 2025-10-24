using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// CORS (justér origins til din frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", p => p
        .WithOrigins("http://localhost:3000", "https://plannr.azurewebsites.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// Controllers + JSON
builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        // undgå reference-loops
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        // skip null-felter
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        // enums som "inperson"/"online"/"hybrid" osv.
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB (PostgreSQL via Npgsql) — læser ConnectionStrings:DefaultConnection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Respektér proxy-headere fra Azure Front Door/Load Balancer
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedFor,
    RequireHeaderSymmetry = false
});

// Midlertidigt slukket for at undgå redirect-issues bag proxy
// app.UseHttpsRedirection();

app.UseCors("Default");

// Minimal request logging så vi kan se, hvad der foregår
app.Use(async (ctx, next) =>
{
    Console.WriteLine($"--> {DateTimeOffset.UtcNow:o} {ctx.Request.Method} {ctx.Request.Path}");
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"!!! {ex.GetType().Name}: {ex.Message}");
        throw;
    }
    finally
    {
        Console.WriteLine($"<-- {DateTimeOffset.UtcNow:o} {ctx.Response.StatusCode} {ctx.Request.Path}");
    }
});

// Små sanity-endpoints
app.MapGet("/", () => Results.Text("Plannr API is running"));
app.MapGet("/ping", () => Results.Ok(new { ok = true, t = DateTimeOffset.UtcNow }));

// MVC
app.MapControllers();

// Kør migrationer ved opstart, men lad ikke hele app’en dø hvis DB driller
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        // Logger kun – vi vil stadig kunne ramme /ping og /health til debugging
        app.Logger.LogError(ex, "DB migrate failed at startup");
    }
}

app.Run();