using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options)
            : base(options) { }

        public DbSet<ArtistEntity> Artists { get; set; }
        public DbSet<GenreEntity> Genres { get; set; }
        public DbSet<TrackEntity> Tracks { get; set; }
        public DbSet<UserEntity> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ArtistEntity
            builder.Entity<ArtistEntity>(e =>
            {
                e.HasKey(a => a.Id);
                e.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(100);
            });

            // GenreEntity
            builder.Entity<GenreEntity>(e =>
            {
                e.HasKey(g => g.Id);
                e.Property(g => g.Name)
                .IsRequired()
                .HasMaxLength(50);
            });

            // TrackEntity
            builder.Entity<TrackEntity>(e =>
            {
                e.HasKey(t => t.Id);
                e.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(100);
                e.Property(t => t.AudioUrl)
                .IsRequired()
                .HasMaxLength(50);
            });

            // Relationships
            builder.Entity<TrackEntity>()
                .HasOne(t => t.Genre)
                .WithMany(g => g.Tracks)
                .HasForeignKey(t => t.GenreId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<TrackEntity>()
                .HasMany(t => t.Artists)
                .WithMany(a => a.Tracks)
                .UsingEntity("ArtistTracks");

            // UserEntity
            builder.Entity<UserEntity>(e =>
            {
                e.HasKey(u => u.Id);
                e.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(50);
                e.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(50);
            });
        }
    }
}
