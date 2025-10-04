using spotifyClone.DAL.Entities;
using System.Linq.Expressions;

namespace spotifyClone.DAL.Repositories
{
    public interface IGenericRepository<TEntity>
        where TEntity : class, IBaseEntity
    {
        Task<TEntity> CreateAsync(TEntity entity);
        Task<IEnumerable<TEntity>> CreateRangeAsync(params TEntity[] entities);
        Task<TEntity> UpdateAsync(TEntity entity);
        Task<bool> DeleteAsync(string id);
        Task<TEntity?> GetByIdAsync(string id);
        Task<TEntity?> GetFirstAsync(Expression<Func<TEntity, bool>> predicate);
        Task<IEnumerable<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate);
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);
        IQueryable<TEntity> GetAll();
        Task<int> CountAsync();
        Task<int> SaveChangesAsync();
    }
}
