using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.Track
{
    public class TrackRepository : GenericRepository<TrackEntity>, ITrackRepository
    {
        public TrackRepository(AppDbContext context) : base(context) { }

        // Основні методи згідно завдання
        public List<TrackEntity> GetByTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return new List<TrackEntity>();

            var trimmedTitle = title.Trim().ToLower();
            return _dbSet
                .AsNoTracking()
                .Where(t => t.Title.ToLower().Contains(trimmedTitle))
                .ToList();
        }

        public List<TrackEntity> GetByArtist(string artistId)
        {
            if (string.IsNullOrWhiteSpace(artistId))
                return new List<TrackEntity>();

            return _dbSet
                .AsNoTracking()
                .Where(t => t.Artists.Any(a => a.Id == artistId))
                .ToList();
        }

        public List<TrackEntity> GetByGenre(string genreId)
        {
            if (string.IsNullOrWhiteSpace(genreId))
                return new List<TrackEntity>();

            return _dbSet
                .AsNoTracking()
                .Where(t => t.GenreId == genreId)
                .ToList();
        }

        public void AddArtist(string trackId, string artistId)
        {
            if (string.IsNullOrWhiteSpace(trackId) || string.IsNullOrWhiteSpace(artistId))
                return;

            var track = _dbSet
                .Include(t => t.Artists)
                .FirstOrDefault(t => t.Id == trackId);

            if (track == null)
                return;

            var artist = _context.Set<ArtistEntity>()
                .FirstOrDefault(a => a.Id == artistId);

            if (artist == null)
                return;

            // Check if artist is already associated with the track
            if (!track.Artists.Any(a => a.Id == artistId))
            {
                track.Artists.Add(artist);
                _context.SaveChanges();
            }
        }

        public async Task<TrackEntity?> GetByTitleAsync(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return null;

            var trimmedTitle = title.Trim();
            return await GetFirstAsync(t => t.Title.ToLower() == trimmedTitle.ToLower());
        }

        public async Task<IEnumerable<TrackEntity>> GetByGenreAsync(string genreId)
        {
            if (string.IsNullOrWhiteSpace(genreId))
                return Enumerable.Empty<TrackEntity>();

            return await GetWhereAsync(t => t.GenreId == genreId);
        }

        public async Task<IEnumerable<TrackEntity>> GetByArtistAsync(string artistId)
        {
            if (string.IsNullOrWhiteSpace(artistId))
                return Enumerable.Empty<TrackEntity>();

            return await _dbSet
                .AsNoTracking()
                .Where(t => t.Artists.Any(a => a.Id == artistId))
                .ToListAsync();
        }

        public async Task<IEnumerable<TrackEntity>> SearchByTitleAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<TrackEntity>();

            var trimmedTerm = searchTerm.Trim().ToLower();
            return await GetWhereAsync(t => t.Title.ToLower().Contains(trimmedTerm));
        }

        public async Task<IEnumerable<TrackEntity>> GetTracksWithDetailsAsync()
        {
            return await _dbSet
                .AsNoTracking()
                .Include(t => t.Genre)
                .Include(t => t.Artists)
                .ToListAsync();
        }

        public async Task<TrackEntity> CreateTrackAsync(string title, string audioUrl, string? description = null, string? posterUrl = null, DateTime? releaseDate = null, string? genreId = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Track title cannot be null or empty", nameof(title));
            
            if (string.IsNullOrWhiteSpace(audioUrl))
                throw new ArgumentException("Audio URL cannot be null or empty", nameof(audioUrl));

            var trimmedTitle = title.Trim();

            var track = new TrackEntity
            {
                Title = trimmedTitle,
                AudioUrl = audioUrl.Trim(),
                Description = description?.Trim(),
                PosterUrl = posterUrl?.Trim(),
                ReleaseDate = releaseDate ?? DateTime.UtcNow,
                GenreId = genreId
            };

            return await CreateAsync(track);
        }

        public async Task<bool> AddArtistToTrackAsync(string trackId, string artistId)
        {
            if (string.IsNullOrWhiteSpace(trackId) || string.IsNullOrWhiteSpace(artistId))
                return false;

            var track = await _dbSet
                .Include(t => t.Artists)
                .FirstOrDefaultAsync(t => t.Id == trackId);

            if (track == null)
                return false;

            var artist = await _context.Set<ArtistEntity>()
                .FirstOrDefaultAsync(a => a.Id == artistId);

            if (artist == null)
                return false;

            // Check if artist is already associated with the track
            if (track.Artists.Any(a => a.Id == artistId))
                return true; // Already associated

            track.Artists.Add(artist);
            return true;
        }

        public async Task<bool> RemoveArtistFromTrackAsync(string trackId, string artistId)
        {
            if (string.IsNullOrWhiteSpace(trackId) || string.IsNullOrWhiteSpace(artistId))
                return false;

            var track = await _dbSet
                .Include(t => t.Artists)
                .FirstOrDefaultAsync(t => t.Id == trackId);

            if (track == null)
                return false;

            var artist = track.Artists.FirstOrDefault(a => a.Id == artistId);
            if (artist == null)
                return false;

            track.Artists.Remove(artist);
            return true;
        }
    }
}