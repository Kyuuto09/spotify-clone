using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using spotifyClone.DAL.Repositories.User;
using spotifyClone.DTOs;
using BCrypt.Net;
using spotifyClone.DAL.Entities;

namespace spotifyClone.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IEmailService emailService,
            IOptions<JwtSettings> jwtSettings,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _emailService = emailService;
            _jwtSettings = jwtSettings.Value;
            _logger = logger;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Check if email already exists
                if (await _userRepository.EmailExistsAsync(registerDto.Email))
                {
                    throw new InvalidOperationException("User with this email already exists");
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                // Create user
                var user = await _userRepository.CreateUserAsync(
                    registerDto.Email,
                    passwordHash,
                    registerDto.FirstName,
                    registerDto.LastName,
                    registerDto.BirthDate
                );

                await _userRepository.SaveChangesAsync();

                // Send welcome email
                _ = Task.Run(async () =>
                {
                    await _emailService.SendWelcomeEmailAsync(user.Email, user.FirstName);
                });

                // Send email confirmation
                _ = Task.Run(async () =>
                {
                    if (!string.IsNullOrEmpty(user.EmailConfirmationToken))
                    {
                        await _emailService.SendEmailConfirmationAsync(
                            user.Email, 
                            user.FirstName, 
                            user.EmailConfirmationToken
                        );
                    }
                });

                // Generate JWT token
                var userDto = MapToUserDto(user);
                var token = GenerateJwtToken(userDto);

                _logger.LogInformation($"User registered successfully: {user.Email}");

                return new AuthResponseDto
                {
                    Token = token,
                    User = userDto,
                    ExpiresAt = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryInHours)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Registration failed for email: {registerDto.Email}");
                throw;
            }
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(loginDto.Email);
                
                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    _logger.LogWarning($"Failed login attempt for email: {loginDto.Email}");
                    return null;
                }

                // Update last login
                await _userRepository.UpdateLastLoginAsync(user.Id);
                await _userRepository.SaveChangesAsync();

                var userDto = MapToUserDto(user);
                var token = GenerateJwtToken(userDto);

                _logger.LogInformation($"User logged in successfully: {user.Email}");

                return new AuthResponseDto
                {
                    Token = token,
                    User = userDto,
                    ExpiresAt = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryInHours)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Login failed for email: {loginDto.Email}");
                throw;
            }
        }

        public async Task<bool> ConfirmEmailAsync(EmailConfirmationDto confirmationDto)
        {
            try
            {
                var result = await _userRepository.ConfirmEmailAsync(confirmationDto.Email, confirmationDto.Token);
                
                if (result)
                {
                    await _userRepository.SaveChangesAsync();
                    _logger.LogInformation($"Email confirmed successfully: {confirmationDto.Email}");
                }
                else
                {
                    _logger.LogWarning($"Email confirmation failed: {confirmationDto.Email}");
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Email confirmation error: {confirmationDto.Email}");
                return false;
            }
        }

        public async Task<bool> SendEmailConfirmationAsync(string email)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);
                
                if (user == null || string.IsNullOrEmpty(user.EmailConfirmationToken))
                    return false;

                return await _emailService.SendEmailConfirmationAsync(
                    user.Email, 
                    user.FirstName, 
                    user.EmailConfirmationToken
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email confirmation: {email}");
                return false;
            }
        }

        public string GenerateJwtToken(UserDto user)
        {
            _logger.LogInformation($"JWT Settings - SecretKey length: {_jwtSettings.SecretKey?.Length ?? 0}, Issuer: {_jwtSettings.Issuer}, Audience: {_jwtSettings.Audience}");
            
            if (string.IsNullOrEmpty(_jwtSettings.SecretKey))
            {
                throw new InvalidOperationException("JWT SecretKey is not configured properly");
            }
            
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim("firstName", user.FirstName),
                    new Claim("lastName", user.LastName)
                }),
                Expires = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryInHours),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<UserDto?> GetUserByIdAsync(string userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                return user != null ? MapToUserDto(user) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to get user by ID: {userId}");
                return null;
            }
        }

        public async Task<bool> IsEmailTakenAsync(string email)
        {
            return await _userRepository.EmailExistsAsync(email);
        }

        private static UserDto MapToUserDto(UserEntity user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Avatar = user.Avatar,
                BirthDate = user.BirthDate,
                IsEmailConfirmed = user.IsEmailConfirmed,
                CreatedDate = user.CreatedDate,
                LastLoginDate = user.LastLoginDate
            };
        }
    }

    public class JwtSettings
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpiryInHours { get; set; } = 24;
    }
}