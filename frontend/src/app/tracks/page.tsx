'use client';

import { useEffect, useState } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import styles from './tracks.module.css';

interface Track {
  id: string;
  title: string;
  audioUrl: string;
  posterUrl?: string;
  description?: string;
  releaseDate: string;
  genre?: {
    id: string;
    name: string;
  };
  artists?: Array<{
    id: string;
    name: string;
  }>;
}

export default function TracksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const {
    currentTrack,
    isPlaying,
    tracks,
    setTracks,
    playTrack,
    removeTrack,
  } = useAudioPlayer();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/track');
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        setError('Failed to load tracks. Please make sure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [setTracks]);

  const handleDelete = async (trackId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this track?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/track/${trackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete track');
      }

      removeTrack(trackId);
    } catch (err) {
      console.error('Failed to delete track:', err);
      alert('Failed to delete track. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className={styles.tracksPage}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading tracks...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.tracksPage}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.tracksPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>All Tracks</h1>
        <p className={styles.subtitle}>
          {tracks.length === 0 
            ? 'No tracks yet. Upload your first track!' 
            : `Browse ${tracks.length} available tracks`}
        </p>
        
        {tracks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎵</div>
            <p className={styles.emptyText}>No tracks available</p>
            <p className={styles.emptyHint}>Upload your first track to get started!</p>
          </div>
        ) : (
          <div className={styles.tracksGrid}>
            {tracks.map((track) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isCurrentTrack && isPlaying;
              
              return (
                <div 
                  key={track.id} 
                  className={`${styles.trackCard} ${isCurrentTrack ? styles.activeTrack : ''}`}
                >
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDelete(track.id, e)}
                    aria-label="Delete track"
                  >
                    ✕
                  </button>
                  <div className={styles.albumArtContainer}>
                    <div 
                      className={styles.albumArt}
                      style={{
                        backgroundImage: track.posterUrl 
                          ? `url(${track.posterUrl.startsWith('http') 
                              ? track.posterUrl 
                              : `http://localhost:5001${track.posterUrl}`})`
                          : 'none',
                        backgroundColor: track.posterUrl ? 'transparent' : 'var(--card-background)'
                      }}
                    >
                      {!track.posterUrl && <span className={styles.musicIcon}>🎵</span>}
                    </div>
                    <div className={styles.playOverlay}>
                      <button
                        className={styles.playButton}
                        onClick={() => playTrack(track)}
                        aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                      >
                        {isCurrentlyPlaying ? '⏸' : '▶'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.trackInfo}>
                    <h3 className={styles.trackTitle}>{track.title}</h3>
                    {track.artists && track.artists.length > 0 && (
                      <p className={styles.artistName}>
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                    )}
                    {track.genre && (
                      <span className={styles.genreBadge}>{track.genre.name}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}