using System.Text.Json;

namespace Plannr.Api.Models;

public class Event
{
    public Guid Id { get; set; }

    // Basic
    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    /// <summary>
    /// "inperson" | "online" | "hybrid"
    /// Matcher frontend-kontrakten.
    /// </summary>
    public string Format { get; set; } = "inperson";

    // Tidsrum
    public DateTimeOffset StartAt { get; set; }

    public DateTimeOffset? EndAt { get; set; }

    // Lokation (owned)
    public EventLocation? Location { get; set; }

    // Adgang (owned)
    public EventAccess? Access { get; set; }

    // Deltagelse (owned)
    public EventAttendance? Attendance { get; set; }

    // Aldersgrænse
    public int? AgeRestriction { get; set; }

    // Flere temaer
    public List<string>? Themes { get; set; }

    // Fleksible sektioner (jsonb)
    // Indeholder bl.a. {type:"description" | "map" | "faq" | ...}
    public JsonDocument? Sections { get; set; }

    // Creator
    public Guid CreatorId { get; set; }

    public Profile Creator { get; set; } = default!;

    // Kollektioner
    public ICollection<EventImage> Images { get; set; } = new List<EventImage>();

    public ICollection<EventPrompt> Prompts { get; set; } = new List<EventPrompt>();
}