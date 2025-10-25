'use client';

import { useEffect, useState } from 'react';
import styles from './genres.module.css';

interface Genre {
  id: string;
  name: string;
  description?: string;
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/genre');
      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }
      const data = await response.json();
      setGenres(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load genres');
      console.error('Error fetching genres:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGenreSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '');
  };

  if (loading) {
    return (
      <main className={styles.genresPage}>
        <div className={styles.container}>
          <h1 className={styles.title}>Loading genres...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.genresPage}>
        <div className={styles.container}>
          <h1 className={styles.title}>Error</h1>
          <p className={styles.subtitle}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.genresPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Genres</h1>
        <p className={styles.subtitle}>Explore music by genre</p>
        
        <div className={styles.genresGrid}>
          {genres.map((genre) => (
            <div
              key={genre.id}
              className={`${styles.genreCard} ${styles[getGenreSlug(genre.name)]}`}
            >
              <div className={styles.genreInitial}>{genre.name[0]}</div>
              <h3 className={styles.genreName}>{genre.name}</h3>
              {genre.description && (
                <p className={styles.genreDescription}>{genre.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}