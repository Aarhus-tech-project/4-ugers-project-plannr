using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Models;

namespace Plannr.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventImage> EventImages => Set<EventImage>();
    public DbSet<EventPrompt> EventPrompts => Set<EventPrompt>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // PROFILE
        modelBuilder.Entity<Profile>(b =>
        {
            b.Property(p => p.Email).HasMaxLength(256).IsRequired();
            b.Property(p => p.Name).HasMaxLength(200).IsRequired();
            b.Property(p => p.Bio).HasMaxLength(2000);
            b.Property(p => p.Phone).HasMaxLength(50);
            b.Property(p => p.AvatarUrl).HasMaxLength(1000);
            b.HasIndex(p => p.Email).IsUnique();

            b.HasOne(p => p.User)
             .WithOne(u => u.Profile)
             .HasForeignKey<Profile>(p => p.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // EVENT
        modelBuilder.Entity<Event>(b =>
        {
            b.Property(e => e.Title).HasMaxLength(200).IsRequired();
            b.Property(e => e.Description).HasMaxLength(4000);

            b.Property(e => e.Format)
             .HasMaxLength(16)
             .HasDefaultValue("inperson")
             .IsRequired();

            b.Property(e => e.Themes).HasColumnType("text[]");
            b.Property(e => e.Sections).HasColumnType("jsonb");
            b.Property(e => e.AgeRestriction);

            b.HasOne(e => e.Creator)
             .WithMany(p => p.EventsCreated)
             .HasForeignKey(e => e.CreatorId)
             .OnDelete(DeleteBehavior.Restrict);

            b.OwnsOne(e => e.Location, loc =>
            {
                loc.Property(l => l.Address).HasMaxLength(300);
                loc.Property(l => l.City).HasMaxLength(200);
                loc.Property(l => l.Country).HasMaxLength(100);
                loc.Property(l => l.Venue).HasMaxLength(200);
                loc.Property(l => l.Latitude).HasPrecision(9, 6);
                loc.Property(l => l.Longitude).HasPrecision(9, 6);

                // Læg i separat tabel for klarhed
                loc.ToTable("EventLocations");
                loc.WithOwner().HasForeignKey("EventId");
                loc.Property<Guid>("EventId");
                loc.HasKey("EventId");

                // Simple B-tree indeks; ikke magisk til kugleafstand, men hjælper på prefilters
                loc.HasIndex(l => new { l.Latitude, l.Longitude });
            });

            b.OwnsOne(e => e.Access, acc =>
            {
                acc.Property(a => a.Instruction).HasMaxLength(2000);
                acc.Property(a => a.Password).HasMaxLength(200);
            });

            b.OwnsOne(e => e.Attendance);
            b.HasIndex(e => e.StartAt);
        });

        // EVENT IMAGE
        modelBuilder.Entity<EventImage>(b =>
        {
            b.Property(i => i.Src).HasMaxLength(1000).IsRequired();
            b.HasOne(i => i.Event)
             .WithMany(e => e.Images)
             .HasForeignKey(i => i.EventId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // EVENT PROMPT
        modelBuilder.Entity<EventPrompt>(b =>
        {
            b.Property(p => p.Prompt).HasMaxLength(500).IsRequired();
            b.Property(p => p.Answer).HasMaxLength(2000).IsRequired();
            b.HasOne(p => p.Event)
             .WithMany(e => e.Prompts)
             .HasForeignKey(p => p.EventId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}