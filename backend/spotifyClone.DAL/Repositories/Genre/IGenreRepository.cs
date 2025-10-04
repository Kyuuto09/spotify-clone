using spotifyClone.DAL.Entities;

namespace spotifyClone.DAL.Repositories.Genre
{
    public interface IGenreRepository : IGenericRepository<GenreEntity>
    {
        Task<GenreEntity?> GetByNameAsync(string name);
        Task<bool> IsExistsByNameAsync(string name);
        Task<GenreEntity?> GetByNormalizedNameAsync(string normalizedName);
        Task<IEnumerable<GenreEntity>> GetGenresWithTracksAsync();
        Task<GenreEntity> CreateGenreAsync(string name);
    }
}
