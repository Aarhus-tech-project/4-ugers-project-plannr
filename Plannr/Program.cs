using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// CORS (justér origins til din frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", p => p
        .WithOrigins("http://localhost:3000", "https://plannr.azurewebsites.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = ctx =>
    {
        var problem = new ValidationProblemDetails(ctx.ModelState)
        {
            Title = "Request validation failed.",
            Status = StatusCodes.Status400BadRequest
        };
        return new BadRequestObjectResult(problem);
    };
});

builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB (PostgreSQL via Npgsql) — læser ConnectionStrings:DefaultConnection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

WebApplication? app = builder.Build();

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

app.MapControllers();

// Kør migrationer ved opstart, men lad ikke hele app’en dø hvis DB driller
using (IServiceScope? scope = app.Services.CreateScope())
{
    try
    {
        ApplicationDbContext? db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        // Logger kun – vi vil stadig kunne ramme /ping og /health til debugging
        app.Logger.LogError(ex, "DB migrate failed at startup");
    }
}

app.Run();