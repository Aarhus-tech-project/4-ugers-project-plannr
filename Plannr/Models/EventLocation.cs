namespace Plannr.Api.Models;

public class EventLocation
{
    public string City { get; set; } = default!;
    public string Country { get; set; } = default!;
    public string Address { get; set; } = default!;
    public decimal? Latitude { get; set; }   //geolocation?.latitude
    public decimal? Longitude { get; set; }  //geolocation?.longitude
}