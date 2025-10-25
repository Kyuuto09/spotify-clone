'use client';

import { useEffect, useState } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import ConfirmModal from '@/components/ConfirmModal';
import InfoModal from '@/components/InfoModal';
import { apiConfig } from '@/config/api';
import styles from './tracks.module.css';

export default function TracksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; trackId: string | null; trackTitle: string }>({
    isOpen: false,
    trackId: null,
    trackTitle: ''
  });
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; trackId: string }>({
    isOpen: false,
    trackId: ''
  });
  
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
        const response = await fetch(apiConfig.endpoints.tracks);
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

  const handleDelete = async (trackId: string, trackTitle: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteModal({ isOpen: true, trackId, trackTitle });
  };

  const confirmDelete = async () => {
    if (!deleteModal.trackId) return;

    try {
      const response = await fetch(apiConfig.endpoints.track(deleteModal.trackId), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete track');
      }

      removeTrack(deleteModal.trackId);
      setDeleteModal({ isOpen: false, trackId: null, trackTitle: '' });
    } catch (err) {
      console.error('Failed to delete track:', err);
      alert('Failed to delete track. Please try again.');
      setDeleteModal({ isOpen: false, trackId: null, trackTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, trackId: null, trackTitle: '' });
  };

  const handleEdit = (trackId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setInfoModal({ isOpen: true, trackId });
  };

  const closeInfoModal = () => {
    setInfoModal({ isOpen: false, trackId: '' });
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
                    className={styles.editButton}
                    onClick={(e) => handleEdit(track.id, e)}
                    aria-label="Edit track"
                  >
                    ✎
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDelete(track.id, track.title, e)}
                    aria-label="Delete track"
                  >
                    ✕
                  </button>
                  <div className={styles.albumArtContainer}>
                    <div 
                      className={styles.albumArt}
                      style={{
                        backgroundImage: track.posterUrl 
                          ? `url(${apiConfig.getMediaURL(track.posterUrl)})`
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
                      <div className={styles.artistInfo}>
                        {track.artists[0].imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={apiConfig.getMediaURL(track.artists[0].imageUrl)}
                            alt={track.artists[0].name}
                            className={styles.artistImage}
                          />
                        ) : (
                          <div className={styles.artistImagePlaceholder}>
                            👤
                          </div>
                        )}
                        <p className={styles.artistName}>
                          {track.artists.map(a => a.name).join(', ')}
                        </p>
                      </div>
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Track"
        message={`Are you sure you want to delete "${deleteModal.trackTitle}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <InfoModal
        isOpen={infoModal.isOpen}
        title="Feature In Development"
        message={
          <>
            This feature is currently in development. Stay tuned for{' '}
            <a 
              href="https://github.com/Kyuuto09/spotify-clone" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              updates
            </a>
            !
          </>
        }
        onClose={closeInfoModal}
        closeText="Got it"
      />
    </main>
  );
}