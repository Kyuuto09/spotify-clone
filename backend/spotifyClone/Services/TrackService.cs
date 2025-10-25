using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;
using spotifyClone.DAL.Repositories.Track;
using spotifyClone.DAL.Repositories.Artist;
using spotifyClone.DTOs;

namespace spotifyClone.Services
{
    public class TrackService : ITrackService
    {
        private readonly ITrackRepository _trackRepository;
        private readonly IArtistRepository _artistRepository;

        public TrackService(ITrackRepository trackRepository, IArtistRepository artistRepository)
        {
            _trackRepository = trackRepository ?? throw new ArgumentNullException(nameof(trackRepository));
            _artistRepository = artistRepository ?? throw new ArgumentNullException(nameof(artistRepository));
        }

        public async Task<IEnumerable<TrackDto>> GetAllTracksAsync()
        {
            var tracks = await _trackRepository.GetTracksWithDetailsAsync();
            return tracks.Select(MapToTrackDto);
        }

        public async Task<TrackDto?> GetTrackByIdAsync(string id)
        {
            var track = await _trackRepository.GetByIdAsync(id);
            return track != null ? MapToTrackDto(track) : null;
        }

        public async Task<IEnumerable<TrackSummaryDto>> GetTracksByTitleAsync(string title)
        {
            var tracks = await _trackRepository.SearchByTitleAsync(title);
            return tracks.Select(MapToTrackSummaryDto);
        }

        public async Task<IEnumerable<TrackSummaryDto>> GetTracksByGenreAsync(string genreId)
        {
            var tracks = await _trackRepository.GetByGenreAsync(genreId);
            return tracks.Select(MapToTrackSummaryDto);
        }

        public async Task<IEnumerable<TrackSummaryDto>> GetTracksByArtistAsync(string artistId)
        {
            var tracks = await _trackRepository.GetByArtistAsync(artistId);
            return tracks.Select(MapToTrackSummaryDto);
        }

        public async Task<TrackDto> CreateTrackAsync(CreateTrackDto createTrackDto)
        {
            var track = new TrackEntity
            {
                Id = Guid.NewGuid().ToString(),
                Title = createTrackDto.Title.Trim(),
                AudioUrl = createTrackDto.AudioUrl.Trim(),
                Description = createTrackDto.Description?.Trim(),
                PosterUrl = createTrackDto.PosterUrl?.Trim(),
                ReleaseDate = createTrackDto.ReleaseDate ?? DateTime.UtcNow,
                GenreId = createTrackDto.GenreId,
                CreatedDate = DateTime.UtcNow
            };

            var createdTrack = await _trackRepository.CreateAsync(track);

            // Add artists if provided
            if (createTrackDto.ArtistIds.Any())
            {
                foreach (var artistId in createTrackDto.ArtistIds)
                {
                    await _trackRepository.AddArtistToTrackAsync(createdTrack.Id, artistId);
                }
            }

            await _trackRepository.SaveChangesAsync();

            // Return the track with details
            var trackWithDetails = await _trackRepository.GetByIdAsync(createdTrack.Id);
            return MapToTrackDto(trackWithDetails!);
        }

        public async Task<TrackDto?> UpdateTrackAsync(string id, UpdateTrackDto updateTrackDto)
        {
            var existingTrack = await _trackRepository.GetByIdAsync(id);
            if (existingTrack == null)
                return null;

            existingTrack.Title = updateTrackDto.Title.Trim();
            existingTrack.AudioUrl = updateTrackDto.AudioUrl.Trim();
            existingTrack.Description = updateTrackDto.Description?.Trim();
            existingTrack.PosterUrl = updateTrackDto.PosterUrl?.Trim();
            
            if (updateTrackDto.ReleaseDate.HasValue)
                existingTrack.ReleaseDate = updateTrackDto.ReleaseDate.Value;
            
            existingTrack.GenreId = updateTrackDto.GenreId;

            await _trackRepository.UpdateAsync(existingTrack);
            await _trackRepository.SaveChangesAsync();

            return MapToTrackDto(existingTrack);
        }

        public async Task<bool> DeleteTrackAsync(string id)
        {
            var result = await _trackRepository.DeleteAsync(id);
            if (result)
            {
                await _trackRepository.SaveChangesAsync();
            }
            return result;
        }

        public async Task<bool> AddArtistToTrackAsync(string trackId, string artistId)
        {
            var result = await _trackRepository.AddArtistToTrackAsync(trackId, artistId);
            if (result)
            {
                await _trackRepository.SaveChangesAsync();
            }
            return result;
        }

        public async Task<bool> RemoveArtistFromTrackAsync(string trackId, string artistId)
        {
            var result = await _trackRepository.RemoveArtistFromTrackAsync(trackId, artistId);
            if (result)
            {
                await _trackRepository.SaveChangesAsync();
            }
            return result;
        }

        public async Task<IEnumerable<TrackDto>> SearchTracksByTitleAsync(string searchTerm)
        {
            var tracks = await _trackRepository.SearchByTitleAsync(searchTerm);
            return tracks.Select(MapToTrackDto);
        }

        public async Task<ArtistEntity> GetOrCreateArtistAsync(string name, string? imageUrl)
        {
            // Check if artist already exists
            var existingArtist = await _artistRepository.GetByNameAsync(name);
            if (existingArtist != null)
            {
                // Update image URL if provided and different
                if (!string.IsNullOrWhiteSpace(imageUrl) && existingArtist.ImageUrl != imageUrl)
                {
                    existingArtist.ImageUrl = imageUrl;
                    await _artistRepository.UpdateAsync(existingArtist);
                }
                return existingArtist;
            }

            // Create new artist using the repository method
            var newArtist = await _artistRepository.CreateArtistAsync(name, null, imageUrl, null);
            return newArtist;
        }

        // Mapping methods
        private static TrackDto MapToTrackDto(TrackEntity track)
        {
            return new TrackDto
            {
                Id = track.Id,
                Title = track.Title,
                Description = track.Description,
                AudioUrl = track.AudioUrl,
                PosterUrl = track.PosterUrl,
                ReleaseDate = track.ReleaseDate,
                CreatedDate = track.CreatedDate,

                GenreId = track.GenreId,
                Genre = track.Genre != null ? new GenreDto
                {
                    Id = track.Genre.Id,
                    Name = track.Genre.Name
                } : null,
                Artists = track.Artists?.Select(a => new ArtistDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ImageUrl = a.ImageUrl
                }).ToList() ?? new List<ArtistDto>()
            };
        }

        private static TrackSummaryDto MapToTrackSummaryDto(TrackEntity track)
        {
            return new TrackSummaryDto
            {
                Id = track.Id,
                Title = track.Title,
                AudioUrl = track.AudioUrl,
                PosterUrl = track.PosterUrl,
                ReleaseDate = track.ReleaseDate,
                GenreId = track.GenreId,
                GenreName = track.Genre?.Name
            };
        }
    }
}