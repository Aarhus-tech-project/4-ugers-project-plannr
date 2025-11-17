public sealed class ProfileInfoUpdateDto
{
    // Null means “don’t change”. Non-null "" means clear for Bio/Phone.
    public string? Email { get; set; }

    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
}