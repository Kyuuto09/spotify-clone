using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.Artist
{
    public interface IArtistRepository : IGenericRepository<ArtistEntity>
    {
        // Основні методи згідно завдання
        List<TrackEntity> GetTracks(string artistId);
        List<ArtistEntity> GetByName(string name);
        
        // Додаткові методи для повноти функціональності
        Task<ArtistEntity?> GetByNameAsync(string name);
        Task<bool> IsExistsByNameAsync(string name);
        Task<IEnumerable<ArtistEntity>> GetArtistsWithTracksAsync();
        Task<IEnumerable<ArtistEntity>> SearchByNameAsync(string searchTerm);
        Task<ArtistEntity> CreateArtistAsync(string name, string? description = null, string? imageUrl = null, DateTime? birthDate = null);
    }
}