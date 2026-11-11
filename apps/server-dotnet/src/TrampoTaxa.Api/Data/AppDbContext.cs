using Microsoft.EntityFrameworkCore;
using TrampoTaxa.Api.Models;

namespace TrampoTaxa.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<Gig> Gigs => Set<Gig>();
    public DbSet<GigApplication> GigApplications => Set<GigApplication>();
    public DbSet<Shift> Shifts => Set<Shift>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(255);
            entity.Property(u => u.Rating).HasPrecision(3, 2);
        });

        // Venue
        modelBuilder.Entity<Venue>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.HasOne(v => v.Owner)
                  .WithMany(u => u.Venues)
                  .HasForeignKey(v => v.OwnerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Gig
        modelBuilder.Entity<Gig>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.Property(g => g.HourlyRate).HasPrecision(10, 2);
            entity.Property(g => g.EstimatedTotal).HasPrecision(10, 2);
            entity.HasOne(g => g.Venue)
                  .WithMany(v => v.Gigs)
                  .HasForeignKey(g => g.VenueId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // GigApplication
        modelBuilder.Entity<GigApplication>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.HasOne(a => a.Gig)
                  .WithMany(g => g.Applications)
                  .HasForeignKey(a => a.GigId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(a => a.Freelancer)
                  .WithMany(u => u.Applications)
                  .HasForeignKey(a => a.FreelancerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Shift
        modelBuilder.Entity<Shift>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.TotalAmount).HasPrecision(10, 2);
            entity.HasOne(s => s.Gig)
                  .WithMany(g => g.Shifts)
                  .HasForeignKey(s => s.GigId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Chat
        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.GigId);
        });
    }
}
