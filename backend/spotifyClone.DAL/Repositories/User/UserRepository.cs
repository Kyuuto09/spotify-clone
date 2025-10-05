using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.User
{
    public class UserRepository : GenericRepository<UserEntity>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<UserEntity?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;

            return await _dbSet
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower().Trim());
        }

        public async Task<UserEntity?> GetByEmailConfirmationTokenAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return null;

            return await _dbSet
                .FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            return await _dbSet
                .AsNoTracking()
                .AnyAsync(u => u.Email.ToLower() == email.ToLower().Trim());
        }

        public async Task<UserEntity> CreateUserAsync(string email, string passwordHash, string firstName, string lastName, DateTime? birthDate = null)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be null or empty", nameof(email));

            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("Password hash cannot be null or empty", nameof(passwordHash));

            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("First name cannot be null or empty", nameof(firstName));

            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Last name cannot be null or empty", nameof(lastName));

            var user = new UserEntity
            {
                Id = Guid.NewGuid().ToString(),
                Email = email.Trim().ToLower(),
                PasswordHash = passwordHash,
                FirstName = firstName.Trim(),
                LastName = lastName.Trim(),
                BirthDate = birthDate,
                CreatedDate = DateTime.UtcNow,
                IsEmailConfirmed = false,
                EmailConfirmationToken = Guid.NewGuid().ToString()
            };

            return await CreateAsync(user);
        }

        public async Task<bool> ConfirmEmailAsync(string email, string token)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token))
                return false;

            var user = await _dbSet
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower().Trim() 
                                       && u.EmailConfirmationToken == token);

            if (user == null)
                return false;

            user.IsEmailConfirmed = true;
            user.EmailConfirmationToken = null;

            await UpdateAsync(user);
            return true;
        }

        public async Task<UserEntity?> UpdateLastLoginAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return null;

            var user = await GetByIdAsync(userId);
            if (user == null)
                return null;

            user.LastLoginDate = DateTime.UtcNow;
            await UpdateAsync(user);

            return user;
        }
    }
}