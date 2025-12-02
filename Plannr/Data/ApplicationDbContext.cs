using Microsoft.EntityFrameworkCore;
using Plannr.Api.Models;
using System.Text.Json.Serialization;

namespace Plannr.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventImage> EventImages => Set<EventImage>();
    public DbSet<Company> Companies => Set<Company>();
    public Guid? CompanyId { get; set; }

    [JsonIgnore]
    public Company? Company { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>(b =>
        {
            b.Property(c => c.Name).HasMaxLength(200).IsRequired();
            b.Property(c => c.Description).HasMaxLength(2000);
            b.Property(c => c.LogoUrl).HasMaxLength(1000);
            b.Property(c => c.CreatedAt).IsRequired();

            b.HasOne(c => c.Profile)
                .WithOne()
                .HasForeignKey<Company>(c => c.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(c => c.Users)
                .WithOne(u => u.Company)
                .HasForeignKey(u => u.CompanyId);

            b.HasMany(c => c.Events)
                .WithOne(e => e.Company)
                .HasForeignKey(e => e.CompanyId);
        });
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<AppUser>().ToTable("AspNetUsers");

        // PROFILE
        modelBuilder.Entity<Profile>(b =>
        {
            b.Property(p => p.Email).HasMaxLength(256).IsRequired();
            b.Property(p => p.Name).HasMaxLength(200).IsRequired();
            b.Property(p => p.Bio).HasMaxLength(2000);
            b.Property(p => p.Phone).HasMaxLength(50);
            b.Property(p => p.AvatarUrl).HasMaxLength(1000);
            b.HasIndex(p => p.Email).IsUnique();

            // Optional relation to AppUser via UserId
            b.HasIndex(p => p.UserId).IsUnique().HasFilter("\"UserId\" IS NOT NULL");

            // UUID arrays (Npgsql mapper List<Guid> -> uuid[])
            b.Property(p => p.InterestedEvents).HasColumnType("uuid[]").HasDefaultValueSql("'{}'::uuid[]");
            b.Property(p => p.GoingToEvents).HasColumnType("uuid[]").HasDefaultValueSql("'{}'::uuid[]");
            b.Property(p => p.CheckedInEvents).HasColumnType("uuid[]").HasDefaultValueSql("'{}'::uuid[]");
            b.Property(p => p.NotInterestedEvents).HasColumnType("uuid[]").HasDefaultValueSql("'{}'::uuid[]");
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

                // Put in separate table for clarity
                loc.ToTable("EventLocations");
                loc.WithOwner().HasForeignKey("EventId");
                loc.Property<Guid>("EventId");
                loc.HasKey("EventId");

                // Simple B-tree index;
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
    }
}