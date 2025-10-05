namespace spotifyClone.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string body);
        Task<bool> SendWelcomeEmailAsync(string toEmail, string firstName);
        Task<bool> SendEmailConfirmationAsync(string toEmail, string firstName, string confirmationToken);
    }
}