using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.Artist
{
    public class ArtistRepository : GenericRepository<ArtistEntity>, IArtistRepository
    {
        public ArtistRepository(AppDbContext context) : base(context) { }

        public async Task<ArtistEntity?> GetByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            var trimmedName = name.Trim();
            return await GetFirstAsync(a => a.Name.ToLower() == trimmedName.ToLower());
        }

        public async Task<bool> IsExistsByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            var trimmedName = name.Trim();
            return await ExistsAsync(a => a.Name.ToLower() == trimmedName.ToLower());
        }

        public async Task<IEnumerable<ArtistEntity>> GetArtistsWithTracksAsync()
        {
            return await _dbSet
                .AsNoTracking()
                .Include(a => a.Tracks)
                .ToListAsync();
        }

        public async Task<IEnumerable<ArtistEntity>> SearchByNameAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<ArtistEntity>();

            var trimmedTerm = searchTerm.Trim().ToLower();
            return await GetWhereAsync(a => a.Name.ToLower().Contains(trimmedTerm));
        }

        // Основні методи згідно завдання
        public List<TrackEntity> GetTracks(string artistId)
        {
            if (string.IsNullOrWhiteSpace(artistId))
                return new List<TrackEntity>();

            var artist = _dbSet
                .Include(a => a.Tracks)
                .FirstOrDefault(a => a.Id == artistId);

            return artist?.Tracks.ToList() ?? new List<TrackEntity>();
        }

        public List<ArtistEntity> GetByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new List<ArtistEntity>();

            var trimmedName = name.Trim().ToLower();
            return _dbSet
                .AsNoTracking()
                .Where(a => a.Name.ToLower().Contains(trimmedName))
                .ToList();
        }

        public async Task<ArtistEntity> CreateArtistAsync(string name, string? description = null, string? imageUrl = null, DateTime? birthDate = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Artist name cannot be null or empty", nameof(name));

            var trimmedName = name.Trim();

            // Check if artist already exists
            if (await IsExistsByNameAsync(trimmedName))
                throw new InvalidOperationException($"Artist with name '{trimmedName}' already exists");

            var artist = new ArtistEntity
            {
                Name = trimmedName,
                Description = description?.Trim(),
                ImageUrl = imageUrl?.Trim(),
                BirthDate = birthDate ?? DateTime.MinValue
            };

            return await CreateAsync(artist);
        }
    }
}