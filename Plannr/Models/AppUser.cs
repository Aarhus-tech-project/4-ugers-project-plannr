using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Plannr.Api.Models;

public class AppUser : IdentityUser<Guid>
{
    // Ekstra felter hvis du virkelig insisterer; ellers lad den være ren.
    [MaxLength(200)]
    public string? DisplayName { get; set; }

    public Profile? Profile { get; set; } // 1:1
}