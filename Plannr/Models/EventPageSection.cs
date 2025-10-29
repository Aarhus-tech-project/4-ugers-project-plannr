public abstract class EventPageSection
{
    public Guid Id { get; set; }
    public string Type { get; set; } = default!;
}

public class DescriptionSection : EventPageSection
{
    public string Content { get; set; } = default!;
}

public class LocationSection : EventPageSection
{
    public string Address { get; set; } = default!;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}