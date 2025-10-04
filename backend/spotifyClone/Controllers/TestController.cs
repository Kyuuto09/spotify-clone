using Microsoft.AspNetCore.Mvc;
using spotifyClone.DAL.Repositories.Genre;
using spotifyClone.DAL.Repositories.Artist;
using spotifyClone.DAL.Repositories.Track;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IGenreRepository _genreRepository;
        private readonly IArtistRepository _artistRepository;
        private readonly ITrackRepository _trackRepository;

        public TestController(
            IGenreRepository genreRepository,
            IArtistRepository artistRepository,
            ITrackRepository trackRepository)
        {
            _genreRepository = genreRepository;
            _artistRepository = artistRepository;
            _trackRepository = trackRepository;
        }

        [HttpPost("create-sample-data")]
        public async Task<IActionResult> CreateSampleDataAsync()
        {
            try
            {
                // Створюємо жанр
                var genre = await _genreRepository.CreateGenreAsync("Rock");
                await _genreRepository.SaveChangesAsync();

                // Створюємо виконавця
                var artist = await _artistRepository.CreateArtistAsync(
                    "The Beatles", 
                    "Legendary British rock band",
                    null,
                    new DateTime(1960, 1, 1));
                await _artistRepository.SaveChangesAsync();

                // Створюємо трек
                var track = await _trackRepository.CreateTrackAsync(
                    "Hey Jude",
                    "/audio/hey-jude.mp3",
                    "Famous Beatles song",
                    "/images/hey-jude.jpg",
                    new DateTime(1968, 8, 26),
                    genre.Id);
                await _trackRepository.SaveChangesAsync();

                // Додаємо виконавця до треку (використовуємо новий метод AddArtist)
                _trackRepository.AddArtist(track.Id, artist.Id);

                return Ok(new { 
                    Message = "Sample data created successfully",
                    Genre = genre,
                    Artist = artist,
                    Track = track
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating sample data: {ex.Message}");
            }
        }

        [HttpGet("test-new-methods")]
        public IActionResult TestNewMethods()
        {
            try
            {
                // Тестуємо нові методи згідно завдання
                
                // Виконавці: GetByName -> List
                var artistsByName = _artistRepository.GetByName("Beatles");
                
                // Треки: GetByTitle -> List
                var tracksByTitle = _trackRepository.GetByTitle("Hey");
                
                // Якщо є дані, тестуємо інші методи
                if (artistsByName.Any())
                {
                    var firstArtist = artistsByName.First();
                    
                    // Виконавці: GetTracks -> List
                    var artistTracks = _artistRepository.GetTracks(firstArtist.Id);
                    
                    return Ok(new
                    {
                        ArtistsByName = artistsByName,
                        TracksByTitle = tracksByTitle,
                        ArtistTracks = artistTracks,
                        Message = "All new methods work correctly!"
                    });
                }

                return Ok(new
                {
                    ArtistsByName = artistsByName,
                    TracksByTitle = tracksByTitle,
                    Message = "New methods work, but no sample data found. Create sample data first."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error testing methods: {ex.Message}");
            }
        }
    }
}