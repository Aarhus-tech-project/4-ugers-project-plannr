using System.Text.Json;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace Plannr.Api.Models;

public class Event
{
    public Guid Id { get; set; }

    public string Title { get; set; } = default!;
    public string? Description { get; set; }

    public string Format { get; set; } = "inperson";

    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset? EndAt { get; set; }

    public EventLocation? Location { get; set; }
    public EventAccess? Access { get; set; }
    public EventAttendance? Attendance { get; set; }

    public int? AgeRestriction { get; set; }
    public List<string>? Themes { get; set; }
    public JsonDocument? Sections { get; set; }

    // Creator is a Profile
    public Guid CreatorId { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public Profile Creator { get; set; } = default!;

    public ICollection<EventImage> Images { get; set; } = new List<EventImage>();

    [NotMapped]
    public EventDateRange? DateRange { get; set; }

    public Guid? CompanyId { get; set; }

    [JsonIgnore]
    public Company? Company { get; set; }
}

public class EventDateRange
{
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset? EndAt { get; set; }
}