namespace Plannr.Api.Models;

public class EventAccess
{
    public string Instruction { get; set; } = string.Empty; // fx "Henvend dig i receptionen"
    public string? Password { get; set; }                    // valgfrit
}