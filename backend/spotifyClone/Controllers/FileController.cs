using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace spotifyClone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileController> _logger;

        public FileController(IWebHostEnvironment environment, ILogger<FileController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        [HttpPost("upload/audio")]
        public async Task<IActionResult> UploadAudio(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file provided");

                // Validate file type
                var allowedExtensions = new[] { ".mp3", ".wav", ".m4a", ".ogg" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest("Invalid file format. Allowed formats: .mp3, .wav, .m4a, .ogg");

                // Validate file size (max 50MB)
                if (file.Length > 50 * 1024 * 1024)
                    return BadRequest("File size too large. Maximum size is 50MB");

                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "audio");
                Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL to access the file
                var fileUrl = $"/uploads/audio/{fileName}";
                
                _logger.LogInformation($"Audio file uploaded successfully: {fileName}");

                return Ok(new
                {
                    success = true,
                    fileName = fileName,
                    originalName = file.FileName,
                    url = fileUrl,
                    size = file.Length,
                    contentType = file.ContentType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading audio file");
                return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
            }
        }

        [HttpPost("upload/image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file provided");

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest("Invalid file format. Allowed formats: .jpg, .jpeg, .png, .gif, .webp");

                // Validate file size (max 10MB)
                if (file.Length > 10 * 1024 * 1024)
                    return BadRequest("File size too large. Maximum size is 10MB");

                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
                Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL to access the file
                var fileUrl = $"/uploads/images/{fileName}";
                
                _logger.LogInformation($"Image file uploaded successfully: {fileName}");

                return Ok(new
                {
                    success = true,
                    fileName = fileName,
                    originalName = file.FileName,
                    url = fileUrl,
                    size = file.Length,
                    contentType = file.ContentType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image file");
                return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
            }
        }

        [HttpDelete("delete/{type}/{fileName}")]
        public IActionResult DeleteFile(string type, string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                    return BadRequest("File name is required");

                if (type != "audio" && type != "images")
                    return BadRequest("Invalid file type. Use 'audio' or 'images'");

                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", type);
                var filePath = Path.Combine(uploadsPath, fileName);

                if (!System.IO.File.Exists(filePath))
                    return NotFound("File not found");

                System.IO.File.Delete(filePath);
                
                _logger.LogInformation($"File deleted successfully: {fileName}");

                return Ok(new { success = true, message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file");
                return StatusCode(500, new { message = "Error deleting file", error = ex.Message });
            }
        }
    }
}