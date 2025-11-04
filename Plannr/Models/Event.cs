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

    public DateTimeOffset StartAt { get; set; }

    public DateTimeOffset? EndAt { get; set; }

    public EventLocation? Location { get; set; }

    public EventAccess? Access { get; set; }

    public EventAttendance? Attendance { get; set; }

    public int? AgeRestriction { get; set; }

    public List<string>? Themes { get; set; }

    public JsonDocument? Sections { get; set; }

    public Guid CreatorId { get; set; }

    public Profile Creator { get; set; } = default!;

    // Kollektioner
    public ICollection<EventImage> Images { get; set; } = new List<EventImage>();

    public ICollection<EventPrompt> Prompts { get; set; } = new List<EventPrompt>();
}