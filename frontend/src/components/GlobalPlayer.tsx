'use client';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import styles from './GlobalPlayer.module.css';

export default function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    tracks,
    togglePlayPause,
    skipNext,
    skipPrevious,
    seekTo,
    setVolume,
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || isNaN(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    seekTo(percentage * duration);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < tracks.length - 1;

  return (
    <div className={styles.globalPlayer}>
      {/* Progress Bar at Top */}
      <div className={styles.topProgressBar} onClick={handleProgressClick}>
        <div
          className={styles.topProgressFill}
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        />
      </div>

      <div className={styles.playerContent}>
        {/* Track Info */}
        <div className={styles.trackInfo}>
          <div
            className={styles.cover}
            style={{
              backgroundImage: currentTrack.posterUrl
                ? `url(${currentTrack.posterUrl.startsWith('http')
                    ? currentTrack.posterUrl
                    : `http://localhost:5001${currentTrack.posterUrl}`})`
                : 'none',
            }}
          >
            {!currentTrack.posterUrl && '🎵'}
          </div>
          <div className={styles.trackText}>
            <div className={styles.title}>{currentTrack.title}</div>
            {currentTrack.artists && currentTrack.artists.length > 0 && (
              <div className={styles.artist}>
                {currentTrack.artists.map(a => a.name).join(', ')}
              </div>
            )}
          </div>
          <div className={styles.timeDisplay}>
            <span className={styles.timeText}>{formatTime(currentTime)}</span>
            <span className={styles.timeSeparator}>/</span>
            <span className={styles.timeText}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className={styles.controls}>
          <div className={styles.controlButtons}>
            <button
              className={styles.skipButton}
              onClick={skipPrevious}
              disabled={!canGoPrevious}
              aria-label="Previous track"
            >
              ⏮
            </button>
            <button
              className={styles.playButton}
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              className={styles.skipButton}
              onClick={skipNext}
              disabled={!canGoNext}
              aria-label="Next track"
            >
              ⏭
            </button>
          </div>
        </div>

        {/* Progress & Volume */}
        <div className={styles.volumeSection}>
          <div className={styles.volumeControl}>
            <span className={styles.volumeIcon} onClick={toggleMute}>
              {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </span>
            <div className={styles.volumeSlider} onClick={handleVolumeChange}>
              <div
                className={styles.volumeFill}
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
