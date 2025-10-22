using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Plannr.Api.Models;
using System.Collections.Concurrent;

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
Seed(app.Services.GetRequiredService<IEventStore>());

app.Run();

static void Seed(IEventStore store)
{
    if (store.Any()) return;

    var owner = new User
    {
        Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        Email = "owner@example.com",
        DisplayName = "Event Owner"
    };
    store.UpsertUser(owner);

    var ev = new Event
    {
        Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        Title = "Fredagsbar i kælderen",
        Description = "Medbring snacks. Starter kl. 18.",
        OwnerId = owner.Id,
        StartAt = DateTimeOffset.UtcNow.AddDays(2),
        EndAt = DateTimeOffset.UtcNow.AddDays(2).AddHours(4),
        Latitude = 55.6761m,
        Longitude = 12.5683m,
        RadiusMeters = 100
    };
    store.UpsertEvent(ev);
}

// Simple in-memory store interfaces/impl
public interface IEventStore
{
    IEnumerable<Event> GetEvents();

    Event? GetEvent(Guid id);

    void UpsertEvent(Event e);

    IEnumerable<User> GetUsers();

    User? GetUser(Guid id);

    void UpsertUser(User u);

    bool Any();
}

public class InMemoryEventStore : IEventStore
{
    private readonly ConcurrentDictionary<Guid, Event> _events = new();
    private readonly ConcurrentDictionary<Guid, User> _users = new();

    public IEnumerable<Event> GetEvents() => _events.Values.OrderBy(e => e.StartAt);

    public Event? GetEvent(Guid id) => _events.TryGetValue(id, out var e) ? e : null;

    public void UpsertEvent(Event e) => _events[e.Id == Guid.Empty ? Guid.NewGuid() : e.Id] = e;

    public IEnumerable<User> GetUsers() => _users.Values;

    public User? GetUser(Guid id) => _users.TryGetValue(id, out var u) ? u : null;

    public void UpsertUser(User u) => _users[u.Id == Guid.Empty ? Guid.NewGuid() : u.Id] = u;

    public bool Any() => _events.Count > 0 || _users.Count > 0;
}