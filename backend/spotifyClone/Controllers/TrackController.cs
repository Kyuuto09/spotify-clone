using Microsoft.AspNetCore.Mvc;
using spotifyClone.Services;
using spotifyClone.DTOs;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrackController : ControllerBase
    {
        private readonly ITrackService _trackService;

        public TrackController(ITrackService trackService)
        {
            _trackService = trackService ?? throw new ArgumentNullException(nameof(trackService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var tracks = await _trackService.GetAllTracksAsync();
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

                var track = await _trackService.GetTrackByIdAsync(id);
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

                var tracks = await _trackService.GetTracksByTitleAsync(title);
                return Ok(tracks);
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

                var tracks = await _trackService.GetTracksByGenreAsync(genreId);
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

                var tracks = await _trackService.GetTracksByArtistAsync(artistId);
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

                var tracks = await _trackService.SearchTracksByTitleAsync(searchTerm);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateTrackDto request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request?.Title))
                    return BadRequest("Track title is required");

                if (string.IsNullOrWhiteSpace(request?.AudioUrl))
                    return BadRequest("Audio URL is required");

                var track = await _trackService.CreateTrackAsync(request);
                return CreatedAtAction(nameof(GetByIdAsync), new { id = track.Id }, track);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateTrackDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return BadRequest("Track ID cannot be null or empty");

                if (string.IsNullOrWhiteSpace(request?.Title))
                    return BadRequest("Track title is required");

                if (string.IsNullOrWhiteSpace(request?.AudioUrl))
                    return BadRequest("Audio URL is required");

                var updatedTrack = await _trackService.UpdateTrackAsync(id, request);
                if (updatedTrack == null)
                    return NotFound($"Track with ID {id} not found");

                return Ok(updatedTrack);
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

                var deleted = await _trackService.DeleteTrackAsync(id);
                if (!deleted)
                    return NotFound($"Track with ID {id} not found");

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

                var success = await _trackService.AddArtistToTrackAsync(trackId, artistId);
                if (!success)
                    return NotFound("Track or Artist not found");

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

                var success = await _trackService.RemoveArtistFromTrackAsync(trackId, artistId);
                if (!success)
                    return NotFound("Track or Artist association not found");

                return Ok("Artist successfully removed from track");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadTrackWithFile([FromForm] string title, 
            [FromForm] string? description,
            [FromForm] IFormFile audioFile,
            [FromForm] IFormFile? posterFile,
            [FromForm] string? posterUrl,
            [FromForm] string? genreId,
            [FromForm] string? releaseDate)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(title))
                    return BadRequest("Track title is required");

                if (audioFile == null || audioFile.Length == 0)
                    return BadRequest("Audio file is required");

                // Validate audio file
                var audioExtension = Path.GetExtension(audioFile.FileName).ToLowerInvariant();
                if (audioExtension != ".mp3" && audioExtension != ".wav" && audioExtension != ".flac")
                    return BadRequest("Only MP3, WAV, and FLAC files are allowed");

                // Create unique filenames
                var audioFileName = $"{Guid.NewGuid()}{audioExtension}";
                var audioPath = Path.Combine("wwwroot", "songs", audioFileName);
                
                // Save audio file
                Directory.CreateDirectory(Path.Combine("wwwroot", "songs"));
                using (var stream = new FileStream(audioPath, FileMode.Create))
                {
                    await audioFile.CopyToAsync(stream);
                }

                string? finalPosterUrl = null;
                
                // Handle poster - prioritize file upload over URL
                if (posterFile != null && posterFile.Length > 0)
                {
                    var posterExtension = Path.GetExtension(posterFile.FileName).ToLowerInvariant();
                    if (posterExtension == ".jpg" || posterExtension == ".jpeg" || posterExtension == ".png" || posterExtension == ".webp")
                    {
                        var posterFileName = $"{Guid.NewGuid()}{posterExtension}";
                        var posterPath = Path.Combine("wwwroot", "images", posterFileName);
                        
                        Directory.CreateDirectory(Path.Combine("wwwroot", "images"));
                        using (var stream = new FileStream(posterPath, FileMode.Create))
                        {
                            await posterFile.CopyToAsync(stream);
                        }
                        finalPosterUrl = $"/images/{posterFileName}";
                    }
                }
                else if (!string.IsNullOrWhiteSpace(posterUrl))
                {
                    // Use provided URL if no file was uploaded
                    finalPosterUrl = posterUrl;
                }

                // Create track
                var trackDto = new CreateTrackDto
                {
                    Title = title,
                    Description = description,
                    AudioUrl = $"/songs/{audioFileName}",
                    PosterUrl = finalPosterUrl,
                    GenreId = genreId,
                    ReleaseDate = !string.IsNullOrEmpty(releaseDate) ? DateTime.Parse(releaseDate) : DateTime.Now,
                    ArtistIds = new List<string>()
                };

                var track = await _trackService.CreateTrackAsync(trackDto);
                return Ok(new { 
                    message = "Track uploaded successfully", 
                    track = track 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}