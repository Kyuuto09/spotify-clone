using Microsoft.EntityFrameworkCore;
using spotifyClone.DAL.Entities;
using System.Linq.Expressions;

namespace spotifyClone.DAL.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity>
        where TEntity : class, IBaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<TEntity>();
        }

        public virtual async Task<TEntity> CreateAsync(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            entity.CreatedDate = DateTime.UtcNow;
            
            var result = await _dbSet.AddAsync(entity);
            return result.Entity;
        }

        public virtual async Task<IEnumerable<TEntity>> CreateRangeAsync(params TEntity[] entities)
        {
            if (entities == null || entities.Length == 0)
                throw new ArgumentException("Entities cannot be null or empty", nameof(entities));

            var now = DateTime.UtcNow;
            foreach (var entity in entities)
            {
                entity.CreatedDate = now;
            }

            await _dbSet.AddRangeAsync(entities);
            return entities;
        }

        public virtual async Task<bool> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentException("Id cannot be null or empty", nameof(id));

            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            return true;
        }

        public virtual async Task<TEntity?> GetByIdAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;

            return await _dbSet
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public virtual async Task<TEntity?> GetFirstAsync(Expression<Func<TEntity, bool>> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            return await _dbSet
                .AsNoTracking()
                .FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<IEnumerable<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            return await _dbSet
                .AsNoTracking()
                .Where(predicate)
                .ToListAsync();
        }

        public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            return await _dbSet.AnyAsync(predicate);
        }

        public virtual IQueryable<TEntity> GetAll()
        {
            return _dbSet.AsNoTracking();
        }

        public virtual async Task<int> CountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public virtual async Task<TEntity> UpdateAsync(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var result = _dbSet.Update(entity);
            return result.Entity;
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
