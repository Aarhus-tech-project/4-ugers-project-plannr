namespace Plannr.Api.Models;

public class Event
{
    public Guid Id { get; set; }

    public string Title { get; set; } = default!;
    public string? Description { get; set; }

    public EventFormat Format { get; set; } = EventFormat.InPerson;

    // counts
    public int InterestedCount { get; set; } = 0;

    // time
    public DateTimeOffset StartAt { get; set; }

    public DateTimeOffset? EndAt { get; set; }
    public bool AllDay { get; set; } = false;

    // optional theme
    public EventThemeName? ThemeName { get; set; }

    public string? ThemeIcon { get; set; } // fx "music", "users", ...

    // location (owned)
    public EventLocation? Location { get; set; }

    // creator
    public Guid CreatorId { get; set; }

    public Profile Creator { get; set; } = default!;

    // collections
    public ICollection<EventImage> Images { get; set; } = new List<EventImage>();

    public ICollection<EventPrompt> Prompts { get; set; } = new List<EventPrompt>();
}

public enum EventFormat
{
    InPerson = 0,   // "inperson"
    Online = 1,     // "online"
    Hybrid = 2      // "hybrid"
}

public enum EventThemeName
{
    Music, Art, Sports, Tech, Food, Networking, Health, Education
}