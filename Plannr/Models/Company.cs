using System.Text.Json.Serialization;

namespace Plannr.Api.Models;

public class Company
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Company Profile
    public Guid ProfileId { get; set; }
    [JsonIgnore]
    public Profile Profile { get; set; } = default!;

    // Users in the company
    [JsonIgnore]
    public ICollection<AppUser> Users { get; set; } = new List<AppUser>();

    // Events created by the company
    [JsonIgnore]
    public ICollection<Event> Events { get; set; } = new List<Event>();
}