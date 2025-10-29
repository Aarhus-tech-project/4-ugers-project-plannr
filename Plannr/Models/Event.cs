namespace Plannr.Api.Models;

public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string Format { get; set; } = EventFormat.InPerson; // string i stedet for enum
    public int InterestedCount { get; set; } = 0;
    public int GoingCount { get; set; } = 0;
    public int CheckedInCount { get; set; } = 0;
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset? EndAt { get; set; }
    public bool AllDay { get; set; } = false;
    public string? Venue { get; set; }
    public string? AccessLink { get; set; }
    public int? RequiredAge { get; set; }
    public EventTheme? Theme { get; set; } // Objekt i stedet for ThemeName + ThemeIcon
    public EventLocation? Location { get; set; }
    public Guid CreatorId { get; set; }
    public Profile Creator { get; set; } = default!;
    public ICollection<EventImage> Images { get; set; } = new List<EventImage>();
    public ICollection<EventPrompt> Prompts { get; set; } = new List<EventPrompt>();
    public ICollection<EventPageSection>? Sections { get; set; } // NY: dynamiske sektioner
}

public static class EventFormat
{
    public const string InPerson = "inperson";
    public const string Online = "online";
    public const string Hybrid = "hybrid";
}

public enum EventThemeName
{
    Music, Art, Sports, Tech, Food, Networking, Health, Education, Business, Nature, Travel, Charity, Fashion, Film, Photography, Literature, Science, Gaming, Spirituality, Family, Comedy, Dance, History, Politics, Environment, Pets, Shopping, Fitness, Theater, Crafts, Languages, Social, Adventure, Startup, BookClub, Coding, Volunteering, Wellness, Exhibition, Tournament, Workshop, Meetup, Lecture, Hackathon, Fundraiser, OpenMic, Quiz, Tour, Market, Parade, Festival, Conference, Seminar, Retreat, Webinar, Show, Party, Picnic, Class, Ceremony, Celebration, Other
}