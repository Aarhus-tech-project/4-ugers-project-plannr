namespace Plannr.Api.Models;

public class EventImage
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Event Event { get; set; } = default!;

    public string Src { get; set; } = default!;
    public int Likes { get; set; } = 0;
}