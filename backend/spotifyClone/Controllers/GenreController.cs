using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Repositories.Genre;
using spotifyClone.DAL.Entities;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenreController : ControllerBase
    {
        private readonly IGenreRepository _genreRepository;

        public GenreController(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository ?? throw new ArgumentNullException(nameof(genreRepository));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var genres = await _genreRepository.GetAll().ToListAsync();
                return Ok(genres);
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
                    return BadRequest("Genre ID cannot be null or empty");

                var genre = await _genreRepository.GetByIdAsync(id);
                if (genre == null)
                    return NotFound($"Genre with ID {id} not found");

                return Ok(genre);
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
                    return BadRequest("Genre name cannot be null or empty");

                var genre = await _genreRepository.GetByNameAsync(name);
                if (genre == null)
                    return NotFound($"Genre with name '{name}' not found");

                return Ok(genre);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("with-tracks")]
        public async Task<IActionResult> GetGenresWithTracksAsync()
        {
            try
            {
                var genres = await _genreRepository.GetGenresWithTracksAsync();
                return Ok(genres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateGenreRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request?.Name))
                    return BadRequest("Genre name is required");

                var genre = await _genreRepository.CreateGenreAsync(request.Name);
                await _genreRepository.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetByIdAsync), new { id = genre.Id }, genre);
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
        public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateGenreRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return BadRequest("Genre ID cannot be null or empty");

                if (string.IsNullOrWhiteSpace(request?.Name))
                    return BadRequest("Genre name is required");

                var existingGenre = await _genreRepository.GetByIdAsync(id);
                if (existingGenre == null)
                    return NotFound($"Genre with ID {id} not found");

                // Check if another genre with the same name exists
                var duplicateGenre = await _genreRepository.GetByNameAsync(request.Name);
                if (duplicateGenre != null && duplicateGenre.Id != id)
                    return Conflict($"Genre with name '{request.Name}' already exists");

                existingGenre.Name = request.Name.Trim();
                existingGenre.NormalizedName = request.Name.Trim().ToUpperInvariant();

                await _genreRepository.UpdateAsync(existingGenre);
                await _genreRepository.SaveChangesAsync();

                return Ok(existingGenre);
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
                    return BadRequest("Genre ID cannot be null or empty");

                var deleted = await _genreRepository.DeleteAsync(id);
                if (!deleted)
                    return NotFound($"Genre with ID {id} not found");

                await _genreRepository.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpHead("exists/{name}")]
        public async Task<IActionResult> ExistsAsync(string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest("Genre name cannot be null or empty");

                var exists = await _genreRepository.IsExistsByNameAsync(name);
                return exists ? Ok() : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // DTOs for requests
    public class CreateGenreRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateGenreRequest
    {
        public string Name { get; set; } = string.Empty;
    }
}
