using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using spotifyClone.DTOs;
using spotifyClone.Services;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.RegisterAsync(registerDto);
                
                return Ok(new
                {
                    message = "Registration successful! Please check your email for confirmation.",
                    token = result.Token,
                    user = result.User,
                    expiresAt = result.ExpiresAt
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Registration validation error");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration error");
                return StatusCode(500, new { message = "Registration error. Please try again later." });
            }
        }

        /// <summary>
        /// User login
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.LoginAsync(loginDto);
                
                if (result == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                return Ok(new
                {
                    message = "Login successful!",
                    token = result.Token,
                    user = result.User,
                    expiresAt = result.ExpiresAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                return StatusCode(500, new { message = "Login error. Please try again later." });
            }
        }

        /// <summary>
        /// Confirm email address
        /// </summary>
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] EmailConfirmationDto confirmationDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.ConfirmEmailAsync(confirmationDto);
                
                if (!result)
                    return BadRequest(new { message = "Invalid confirmation token or email" });

                return Ok(new { message = "Email confirmed successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Email confirmation error");
                return StatusCode(500, new { message = "Email confirmation error. Please try again later." });
            }
        }

        /// <summary>
        /// Resend email confirmation
        /// </summary>
        [HttpPost("resend-confirmation")]
        public async Task<IActionResult> ResendEmailConfirmation([FromBody] ResendConfirmationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.SendEmailConfirmationAsync(dto.Email);
                
                if (!result)
                    return BadRequest(new { message = "User with this email not found" });

                return Ok(new { message = "Confirmation email sent!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Resend confirmation error");
                return StatusCode(500, new { message = "Error sending email. Please try again later." });
            }
        }

        /// <summary>
        /// Check email availability
        /// </summary>
        [HttpGet("check-email/{email}")]
        public async Task<IActionResult> CheckEmailAvailability(string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    return BadRequest(new { message = "Email cannot be empty" });

                var isTaken = await _authService.IsEmailTakenAsync(email);
                
                return Ok(new 
                { 
                    email = email,
                    isAvailable = !isTaken,
                    message = isTaken ? "Email is already taken" : "Email is available"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Check email availability error for: {email}");
                return StatusCode(500, new { message = "Error checking email availability. Please try again later." });
            }
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { message = "Invalid token" });

                var user = await _authService.GetUserByIdAsync(userId);
                
                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get current user error");
                return StatusCode(500, new { message = "Error getting user information." });
            }
        }
    }

    // Additional DTO for resend confirmation
    public class ResendConfirmationDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}