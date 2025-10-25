using spotifyClone.DTOs;
using spotifyClone.DAL.Entities;

namespace spotifyClone.Services
{
    public interface ITrackService
    {
        Task<IEnumerable<TrackDto>> GetAllTracksAsync();
        Task<TrackDto?> GetTrackByIdAsync(string id);
        Task<IEnumerable<TrackSummaryDto>> GetTracksByTitleAsync(string title);
        Task<IEnumerable<TrackSummaryDto>> GetTracksByGenreAsync(string genreId);
        Task<IEnumerable<TrackSummaryDto>> GetTracksByArtistAsync(string artistId);
        Task<TrackDto> CreateTrackAsync(CreateTrackDto createTrackDto);
        Task<TrackDto?> UpdateTrackAsync(string id, UpdateTrackDto updateTrackDto);
        Task<bool> DeleteTrackAsync(string id);
        Task<bool> AddArtistToTrackAsync(string trackId, string artistId);
        Task<bool> RemoveArtistFromTrackAsync(string trackId, string artistId);
        Task<IEnumerable<TrackDto>> SearchTracksByTitleAsync(string searchTerm);
        Task<ArtistEntity> GetOrCreateArtistAsync(string name, string? imageUrl);
    }
}