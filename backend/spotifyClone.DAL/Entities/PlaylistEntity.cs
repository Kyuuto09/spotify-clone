namespace spotifyClone.DAL.Entities
{
    public class PlaylistEntity : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsPublic { get; set; } = true;
        
        // Foreign Key
        public required string UserId { get; set; }
        public UserEntity User { get; set; } = null!;
        
        // Navigation properties
        public ICollection<TrackEntity> Tracks { get; set; } = [];
    }
}