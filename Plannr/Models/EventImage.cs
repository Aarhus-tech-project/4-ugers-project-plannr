using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Plannr.Api.Models;

public class EventImage
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }

    [JsonIgnore] // <- Important
    [ValidateNever] //stop model validation from requiring it
    public Event? Event { get; set; } = default!; //Nullable

    public string Src { get; set; } = default!;
    public int Likes { get; set; } = 0;
}