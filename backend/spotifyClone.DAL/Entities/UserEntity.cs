namespace spotifyClone.DAL.Entities
{
    public class UserEntity : BaseEntity
    {
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? Avatar { get; set; }
        public DateTime? BirthDate { get; set; }
        public bool IsEmailConfirmed { get; set; } = false;
        public string? EmailConfirmationToken { get; set; }
        public DateTime? LastLoginDate { get; set; }
        
        // Navigation properties
        public ICollection<PlaylistEntity> Playlists { get; set; } = [];
    }
}