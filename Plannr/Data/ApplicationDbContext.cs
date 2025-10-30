using Microsoft.EntityFrameworkCore;
using Plannr.Api.Models;

namespace Plannr.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
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
        });

        // EVENT
        modelBuilder.Entity<Event>(b =>
        {
            b.Property(e => e.Title).HasMaxLength(200).IsRequired();
            b.Property(e => e.Description).HasMaxLength(4000);

            // Enum-konverteringer til string for læsbar DB (Postgres-native enums er overkill her)
            b.Property(e => e.Format)
             .HasConversion<string>()        // "InPerson" | "Online" | "Hybrid"
             .HasMaxLength(16);

            // Theme som owned type
            b.OwnsOne(e => e.Theme, theme =>
            {
                theme.Property(t => t.Name)
                    .HasConversion<string>()
                    .HasMaxLength(32);
                theme.Property(t => t.Icon)
                    .HasMaxLength(100);
            });

            b.HasOne(e => e.Creator)
             .WithMany(p => p.EventsCreated)
             .HasForeignKey(e => e.CreatorId)
             .OnDelete(DeleteBehavior.Restrict);

            //Owned value object → egen tabel for klarhed i EF
            b.OwnsOne(e => e.Location, loc =>
            {
                loc.Property(l => l.City).HasMaxLength(200);
                loc.Property(l => l.Country).HasMaxLength(100);
                loc.Property(l => l.Address).HasMaxLength(300);
                // Postgres decimal precision
                loc.Property(l => l.Latitude).HasPrecision(9, 6);
                loc.Property(l => l.Longitude).HasPrecision(9, 6);

                // Læg den i separat tabel så queries er simple
                loc.ToTable("EventLocations");

                // Primærnøgle matcher Event Id (1:1)
                loc.WithOwner().HasForeignKey("EventId");
                loc.Property<Guid>("EventId");
                loc.HasKey("EventId");
            });

            // Indeks der ofte er nyttigt
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

        modelBuilder.Entity<EventPageSection>(b =>
        {
            b.HasKey(s => s.Id); // Primærnøgle

            b.Property(s => s.Type).HasMaxLength(50).IsRequired();

            b.Property<string>("Content").HasMaxLength(4000);

            b.HasDiscriminator<string>("SectionType")
             .HasValue<DescriptionSection>("description")
             .HasValue<LocationSection>("location");

            b.Property<Guid>("EventId");
            b.HasOne<Event>()
             .WithMany(e => e.Sections)
             .HasForeignKey("EventId")
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}