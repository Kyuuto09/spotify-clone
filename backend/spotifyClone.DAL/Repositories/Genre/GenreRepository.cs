using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.Genre
{
    public class GenreRepository : GenericRepository<GenreEntity>, IGenreRepository
    {
        public GenreRepository(AppDbContext context) : base(context) { }

        public async Task<GenreEntity?> GetByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            var normalizedName = name.Trim().ToUpperInvariant();
            return await GetFirstAsync(g => g.NormalizedName == normalizedName);
        }

        public async Task<bool> IsExistsByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            var normalizedName = name.Trim().ToUpperInvariant();
            return await ExistsAsync(g => g.NormalizedName == normalizedName);
        }

        public async Task<GenreEntity?> GetByNormalizedNameAsync(string normalizedName)
        {
            if (string.IsNullOrWhiteSpace(normalizedName))
                return null;

            return await GetFirstAsync(g => g.NormalizedName == normalizedName);
        }

        public async Task<IEnumerable<GenreEntity>> GetGenresWithTracksAsync()
        {
            return await _dbSet
                .AsNoTracking()
                .Include(g => g.Tracks)
                .ToListAsync();
        }

        public async Task<GenreEntity> CreateGenreAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Genre name cannot be null or empty", nameof(name));

            var trimmedName = name.Trim();
            var normalizedName = trimmedName.ToUpperInvariant();

            // Check if genre already exists
            if (await IsExistsByNameAsync(trimmedName))
                throw new InvalidOperationException($"Genre with name '{trimmedName}' already exists");

            var genre = new GenreEntity
            {
                Name = trimmedName,
                NormalizedName = normalizedName
            };

            return await CreateAsync(genre);
        }
    }
}
