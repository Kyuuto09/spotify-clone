using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Repositories.Artist;
using spotifyClone.DAL.Entities;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtistController : ControllerBase
    {
        private readonly IArtistRepository _artistRepository;

        public ArtistController(IArtistRepository artistRepository)
        {
            _artistRepository = artistRepository ?? throw new ArgumentNullException(nameof(artistRepository));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var artists = await _artistRepository.GetAll().ToListAsync();
                return Ok(artists);
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
                    return BadRequest("Artist ID cannot be null or empty");

                var artist = await _artistRepository.GetByIdAsync(id);
                if (artist == null)
                    return NotFound($"Artist with ID {id} not found");

                return Ok(artist);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetByNameAsync(string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest("Artist name cannot be null or empty");

                var artist = await _artistRepository.GetByNameAsync(name);
                if (artist == null)
                    return NotFound($"Artist with name '{name}' not found");

                return Ok(artist);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("search/{searchTerm}")]
        public async Task<IActionResult> SearchByNameAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                    return BadRequest("Search term cannot be null or empty");

                var artists = await _artistRepository.SearchByNameAsync(searchTerm);
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("with-tracks")]
        public async Task<IActionResult> GetArtistsWithTracksAsync()
        {
            try
            {
                var artists = await _artistRepository.GetArtistsWithTracksAsync();
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Нові методи згідно завдання
        [HttpGet("{artistId}/tracks")]
        public IActionResult GetTracks(string artistId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(artistId))
                    return BadRequest("Artist ID cannot be null or empty");

                var tracks = _artistRepository.GetTracks(artistId);
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("by-name/{name}")]
        public IActionResult GetByName(string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest("Artist name cannot be null or empty");

                var artists = _artistRepository.GetByName(name);
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateArtistRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request?.Name))
                    return BadRequest("Artist name is required");

                var artist = await _artistRepository.CreateArtistAsync(
                    request.Name, 
                    request.Description, 
                    request.ImageUrl, 
                    request.BirthDate);
                
                await _artistRepository.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetByIdAsync), new { id = artist.Id }, artist);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateArtistRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return BadRequest("Artist ID cannot be null or empty");

                if (string.IsNullOrWhiteSpace(request?.Name))
                    return BadRequest("Artist name is required");

                var existingArtist = await _artistRepository.GetByIdAsync(id);
                if (existingArtist == null)
                    return NotFound($"Artist with ID {id} not found");

                // Check if another artist with the same name exists
                var duplicateArtist = await _artistRepository.GetByNameAsync(request.Name);
                if (duplicateArtist != null && duplicateArtist.Id != id)
                    return Conflict($"Artist with name '{request.Name}' already exists");

                existingArtist.Name = request.Name.Trim();
                existingArtist.Description = request.Description?.Trim();
                existingArtist.ImageUrl = request.ImageUrl?.Trim();
                if (request.BirthDate.HasValue)
                    existingArtist.BirthDate = request.BirthDate.Value;

                await _artistRepository.UpdateAsync(existingArtist);
                await _artistRepository.SaveChangesAsync();

                return Ok(existingArtist);
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
                    return BadRequest("Artist ID cannot be null or empty");

                var deleted = await _artistRepository.DeleteAsync(id);
                if (!deleted)
                    return NotFound($"Artist with ID {id} not found");

                await _artistRepository.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // DTOs for requests
    public class CreateArtistRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? BirthDate { get; set; }
    }

    public class UpdateArtistRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? BirthDate { get; set; }
    }
}