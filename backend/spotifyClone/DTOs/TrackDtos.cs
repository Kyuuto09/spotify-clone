namespace spotifyClone.DTOs
{
    // Response DTOs
    public class TrackDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string AudioUrl { get; set; } = string.Empty;
        public string? PosterUrl { get; set; }
        public DateTime ReleaseDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? GenreId { get; set; }
        public GenreDto? Genre { get; set; }
        public List<ArtistDto> Artists { get; set; } = new();
    }

    public class TrackSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string? PosterUrl { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? GenreId { get; set; }
        public string? GenreName { get; set; }
    }

    // Request DTOs
    public class CreateTrackDto
    {
        public string Title { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? GenreId { get; set; }
        public List<string> ArtistIds { get; set; } = new();
    }

    public class UpdateTrackDto
    {
        public string Title { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? GenreId { get; set; }
    }

    // Supporting DTOs
    public class GenreDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class ArtistDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
    }
}