using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Plannr.Api.Models;

public class AppUser : IdentityUser<Guid>
{
    [MaxLength(200)]
    public string? DisplayName { get; set; }

    public Profile? Profile { get; set; } // 1:1
    public Guid? CompanyId { get; set; }

    [JsonIgnore]
    public Company? Company { get; set; }
}