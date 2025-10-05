using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace spotifyClone.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                _logger.LogInformation($"Email Settings - FromEmail: '{_emailSettings.FromEmail}', FromName: '{_emailSettings.FromName}', SmtpHost: '{_emailSettings.SmtpHost}'");
                
                if (string.IsNullOrEmpty(_emailSettings.FromEmail))
                {
                    _logger.LogWarning("FromEmail is not configured, skipping email sending");
                    return false;
                }
                
                using var client = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword),
                    EnableSsl = _emailSettings.EnableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                
                _logger.LogInformation($"Email sent successfully to {toEmail}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
                return false;
            }
        }

        public async Task<bool> SendWelcomeEmailAsync(string toEmail, string firstName)
        {
            var subject = "Welcome to Spotify Clone!";
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #1db954, #1ed760); color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background: #f9f9f9; }}
                        .footer {{ text-align: center; color: #666; padding: 20px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>🎵 Spotify Clone</h1>
                        </div>
                        <div class='content'>
                            <h2>Hello, {firstName}!</h2>
                            <p>Congratulations on successfully registering with Spotify Clone!</p>
                            <p>Now you can:</p>
                            <ul>
                                <li>Listen to your favorite music</li>
                                <li>Create your own playlists</li>
                                <li>Discover new artists</li>
                                <li>Share music with friends</li>
                            </ul>
                            <p>Enjoy your listening experience! 🎶</p>
                        </div>
                        <div class='footer'>
                            <p>Best regards,<br>The Spotify Clone Team</p>
                        </div>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(toEmail, subject, body);
        }

        public async Task<bool> SendEmailConfirmationAsync(string toEmail, string firstName, string confirmationToken)
        {
            var subject = "Email Confirmation - Spotify Clone";
            var confirmationUrl = $"{_emailSettings.ApplicationUrl}/confirm-email?token={confirmationToken}&email={toEmail}";
            
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #1db954, #1ed760); color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background: #f9f9f9; }}
                        .button {{ display: inline-block; background: #1db954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
                        .footer {{ text-align: center; color: #666; padding: 20px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>🎵 Spotify Clone</h1>
                        </div>
                        <div class='content'>
                            <h2>Hello, {firstName}!</h2>
                            <p>Thank you for registering with Spotify Clone!</p>
                            <p>To complete your registration, please confirm your email address:</p>
                            <a href='{confirmationUrl}' class='button'>Confirm Email</a>
                            <p>If the button doesn't work, copy this link to your browser:</p>
                            <p><a href='{confirmationUrl}'>{confirmationUrl}</a></p>
                            <p><strong>This token is valid for 24 hours.</strong></p>
                        </div>
                        <div class='footer'>
                            <p>If you didn't register on our website, simply ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(toEmail, subject, body);
        }
    }

    public class EmailSettings
    {
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
        public bool EnableSsl { get; set; } = true;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
        public string ApplicationUrl { get; set; } = string.Empty;
    }
}