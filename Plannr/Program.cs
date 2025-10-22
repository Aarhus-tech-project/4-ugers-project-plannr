using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Plannr.Api.Models;
using System.Collections.Concurrent;
using Plannr.Helpers;
using static Plannr.Helpers.EventHelper;

var builder = WebApplication.CreateBuilder(args);

// CORS (til React/Next frontend – justér origins efter behov)
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

// In-memory store (thread-safe)
builder.Services.AddSingleton<IEventStore, InMemoryEventStore>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("Default");
app.MapControllers();

// Seed lidt dummy data ved opstart
EventHelper.Seed(app.Services.GetRequiredService<IEventStore>());

app.Run();