using System.Text.Json.Serialization;

namespace Plannr.Api.Models;

public class Profile
{
    public Guid Id { get; set; }

    // Link til Identity-bruger
    public Guid? UserId { get; set; }

    [JsonIgnore]
    public AppUser? User { get; set; } = default!;

    public string Email { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Event lists (gemmes som uuid[] i Postgres)
    public List<Guid> InterestedEvents { get; set; } = new();

    public List<Guid> GoingToEvents { get; set; } = new();
    public List<Guid> CheckedInEvents { get; set; } = new();
    public List<Guid> NotInterestedEvents { get; set; } = new();

    [JsonIgnore]
    public ICollection<Event> EventsCreated { get; set; } = new List<Event>();
}