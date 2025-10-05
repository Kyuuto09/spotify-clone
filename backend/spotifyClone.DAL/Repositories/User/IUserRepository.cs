using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.User
{
    public interface IUserRepository : IGenericRepository<UserEntity>
    {
        Task<UserEntity?> GetByEmailAsync(string email);
        Task<UserEntity?> GetByEmailConfirmationTokenAsync(string token);
        Task<bool> EmailExistsAsync(string email);
        Task<UserEntity> CreateUserAsync(string email, string passwordHash, string firstName, string lastName, DateTime? birthDate = null);
        Task<bool> ConfirmEmailAsync(string email, string token);
        Task<UserEntity?> UpdateLastLoginAsync(string userId);
    }
}