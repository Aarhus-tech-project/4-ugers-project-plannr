namespace Plannr.Api.Models;

public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }

    public Guid OwnerId { get; set; }

    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset? EndAt { get; set; }
    public bool AllDay { get; set; } = false;

    // GPS + check-in radius (meter)
    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }
    public int? RadiusMeters { get; set; } = 100;
}