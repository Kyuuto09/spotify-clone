using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Repositories.Track;
using spotifyClone.DAL.Entities;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrackController : ControllerBase
    {
        private readonly ITrackRepository _trackRepository;

        public TrackController(ITrackRepository trackRepository)
        {
            _trackRepository = trackRepository ?? throw new ArgumentNullException(nameof(trackRepository));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var tracks = await _trackRepository.GetAll().ToListAsync();
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return BadRequest("Track ID cannot be null or empty");

                var track = await _trackRepository.GetByIdAsync(id);
                if (track == null)
                    return NotFound($"Track with ID {id} not found");

                return Ok(track);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("title/{title}")]
        public async Task<IActionResult> GetByTitleAsync(string title)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(title))
                    return BadRequest("Track title cannot be null or empty");

                var track = await _trackRepository.GetByTitleAsync(title);
                if (track == null)
                    return NotFound($"Track with title '{title}' not found");

                return Ok(track);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("genre/{genreId}")]
        public async Task<IActionResult> GetByGenreAsync(string genreId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(genreId))
                    return BadRequest("Genre ID cannot be null or empty");

                var tracks = await _trackRepository.GetByGenreAsync(genreId);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("artist/{artistId}")]
        public async Task<IActionResult> GetByArtistAsync(string artistId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(artistId))
                    return BadRequest("Artist ID cannot be null or empty");

                var tracks = await _trackRepository.GetByArtistAsync(artistId);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("search/{searchTerm}")]
        public async Task<IActionResult> SearchByTitleAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                    return BadRequest("Search term cannot be null or empty");

                var tracks = await _trackRepository.SearchByTitleAsync(searchTerm);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("with-details")]
        public async Task<IActionResult> GetTracksWithDetailsAsync()
        {
            try
            {
                var tracks = await _trackRepository.GetTracksWithDetailsAsync();
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Нові методи згідно завдання
        [HttpGet("by-title/{title}")]
        public IActionResult GetByTitle(string title)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(title))
                    return BadRequest("Track title cannot be null or empty");

                var tracks = _trackRepository.GetByTitle(title);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("by-artist/{artistId}")]
        public IActionResult GetByArtist(string artistId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(artistId))
                    return BadRequest("Artist ID cannot be null or empty");

                var tracks = _trackRepository.GetByArtist(artistId);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("by-genre/{genreId}")]
        public IActionResult GetByGenre(string genreId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(genreId))
                    return BadRequest("Genre ID cannot be null or empty");

                var tracks = _trackRepository.GetByGenre(genreId);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{trackId}/add-artist/{artistId}")]
        public IActionResult AddArtist(string trackId, string artistId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(trackId))
                    return BadRequest("Track ID cannot be null or empty");

                if (string.IsNullOrWhiteSpace(artistId))
                    return BadRequest("Artist ID cannot be null or empty");

                _trackRepository.AddArtist(trackId, artistId);
                return Ok("Artist successfully added to track");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateTrackRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request?.Title))
                    return BadRequest("Track title is required");

                if (string.IsNullOrWhiteSpace(request?.AudioUrl))
                    return BadRequest("Audio URL is required");

                var track = await _trackRepository.CreateTrackAsync(
                    request.Title,
                    request.AudioUrl,
                    request.Description,
                    request.PosterUrl,
                    request.ReleaseDate,
                    request.GenreId);

                await _trackRepository.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetByIdAsync), new { id = track.Id }, track);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateTrackRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return BadRequest("Track ID cannot be null or empty");

                if (string.IsNullOrWhiteSpace(request?.Title))
                    return BadRequest("Track title is required");

                if (string.IsNullOrWhiteSpace(request?.AudioUrl))
                    return BadRequest("Audio URL is required");

                var existingTrack = await _trackRepository.GetByIdAsync(id);
                if (existingTrack == null)
                    return NotFound($"Track with ID {id} not found");

                existingTrack.Title = request.Title.Trim();
                existingTrack.AudioUrl = request.AudioUrl.Trim();
                existingTrack.Description = request.Description?.Trim();
                existingTrack.PosterUrl = request.PosterUrl?.Trim();
                if (request.ReleaseDate.HasValue)
                    existingTrack.ReleaseDate = request.ReleaseDate.Value;
                existingTrack.GenreId = request.GenreId;

                await _trackRepository.UpdateAsync(existingTrack);
                await _trackRepository.SaveChangesAsync();

                return Ok(existingTrack);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return BadRequest("Track ID cannot be null or empty");

                var deleted = await _trackRepository.DeleteAsync(id);
                if (!deleted)
                    return NotFound($"Track with ID {id} not found");

                await _trackRepository.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{trackId}/artists/{artistId}")]
        public async Task<IActionResult> AddArtistToTrackAsync(string trackId, string artistId)
        {
            try
            {
                if (string.IsNullOrEmpty(trackId))
                    return BadRequest("Track ID cannot be null or empty");

                if (string.IsNullOrEmpty(artistId))
                    return BadRequest("Artist ID cannot be null or empty");

                var success = await _trackRepository.AddArtistToTrackAsync(trackId, artistId);
                if (!success)
                    return NotFound("Track or Artist not found");

                await _trackRepository.SaveChangesAsync();
                return Ok("Artist successfully added to track");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{trackId}/artists/{artistId}")]
        public async Task<IActionResult> RemoveArtistFromTrackAsync(string trackId, string artistId)
        {
            try
            {
                if (string.IsNullOrEmpty(trackId))
                    return BadRequest("Track ID cannot be null or empty");

                if (string.IsNullOrEmpty(artistId))
                    return BadRequest("Artist ID cannot be null or empty");

                var success = await _trackRepository.RemoveArtistFromTrackAsync(trackId, artistId);
                if (!success)
                    return NotFound("Track or Artist association not found");

                await _trackRepository.SaveChangesAsync();
                return Ok("Artist successfully removed from track");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // DTOs for requests
    public class CreateTrackRequest
    {
        public string Title { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? GenreId { get; set; }
    }

    public class UpdateTrackRequest
    {
        public string Title { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? GenreId { get; set; }
    }
}