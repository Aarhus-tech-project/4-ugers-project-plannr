using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Plannr.Api.Models;

public class EventPrompt
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public Event? Event { get; set; } = default!;

    public string Prompt { get; set; } = default!;
    public string Answer { get; set; } = default!;
    public int Likes { get; set; } = 0;
}