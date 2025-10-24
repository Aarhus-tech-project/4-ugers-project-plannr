using System.Text.Json.Serialization;

namespace Plannr.Api.Models;

public class Profile
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [JsonIgnore]            // <- undgå Event -> Creator -> EventsCreated -> Event ...
    public ICollection<Event> EventsCreated { get; set; } = new List<Event>();
}