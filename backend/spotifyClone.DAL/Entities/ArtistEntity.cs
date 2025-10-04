namespace spotifyClone.DAL.Entities
{
    public class ArtistEntity : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime BirthDate { get; set; }

        public ICollection<TrackEntity> Tracks { get; set; } = [];
    }
}
