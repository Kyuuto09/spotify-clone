using spotifyClone.DTOs;

namespace spotifyClone.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<bool> ConfirmEmailAsync(EmailConfirmationDto confirmationDto);
        Task<bool> SendEmailConfirmationAsync(string email);
        string GenerateJwtToken(UserDto user);
        Task<UserDto?> GetUserByIdAsync(string userId);
        Task<bool> IsEmailTakenAsync(string email);
    }
}