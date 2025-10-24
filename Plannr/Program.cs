using Microsoft.EntityFrameworkCore;
using Plannr.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", p => p
        .WithOrigins("http://localhost:3000", "https://plannr.azurewebsites.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ---------- Database (PostgreSQL via Npgsql) ----------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// -------------------------------------------------------

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
//app.UseForwardedHeaders(new ForwardedHeadersOptions
//{
//    ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor |
//                       Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto,
//    RequireHeaderSymmetry = false
//});
//app.UseHttpsRedirection();
//app.UseCors("Default");
app.MapControllers();

// Kør migrations ved opstart (ok til demo)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.Run();