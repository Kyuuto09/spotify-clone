using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.Track
{
    public interface ITrackRepository : IGenericRepository<TrackEntity>
    {
        // Основні методи згідно завдання
        List<TrackEntity> GetByTitle(string title);
        List<TrackEntity> GetByArtist(string artistId);
        List<TrackEntity> GetByGenre(string genreId);
        void AddArtist(string trackId, string artistId);
        
        // Додаткові асинхронні методи для повноти функціональності
        Task<TrackEntity?> GetByTitleAsync(string title);
        Task<IEnumerable<TrackEntity>> GetByGenreAsync(string genreId);
        Task<IEnumerable<TrackEntity>> GetByArtistAsync(string artistId);
        Task<IEnumerable<TrackEntity>> SearchByTitleAsync(string searchTerm);
        Task<IEnumerable<TrackEntity>> GetTracksWithDetailsAsync();
        Task<TrackEntity> CreateTrackAsync(string title, string audioUrl, string? description = null, string? posterUrl = null, DateTime? releaseDate = null, string? genreId = null);
        Task<bool> AddArtistToTrackAsync(string trackId, string artistId);
        Task<bool> RemoveArtistFromTrackAsync(string trackId, string artistId);
    }
}