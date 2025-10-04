namespace spotifyClone.DAL.Entities
{
    public class TrackEntity : BaseEntity
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string AudioUrl { get; set; }
        public string? PosterUrl { get; set; }
        public DateTime ReleaseDate { get; set; }

        public string? GenreId { get; set; }
        public GenreEntity? Genre { get; set; }
        public ICollection<ArtistEntity> Artists { get; set; } = [];
    }
}
