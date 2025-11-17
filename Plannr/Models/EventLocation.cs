namespace Plannr.Api.Models;

public class EventLocation
{
    public string Address { get; set; } = default!;
    public string City { get; set; } = default!;
    public string Country { get; set; } = default!;
    public string? Venue { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}