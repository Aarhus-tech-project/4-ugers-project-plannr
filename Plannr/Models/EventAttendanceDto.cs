// EventAttendanceUpdateDto.cs
namespace Plannr.Api.Models;

public class EventAttendanceUpdateDto
{
    public int? Interested { get; set; }
    public int? Going { get; set; }
    public int? CheckedIn { get; set; }
}