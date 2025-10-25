'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(210); // 3:30 in seconds
  const [volume, setVolume] = useState(70);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const albumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate dashboard entrance
    if (playerRef.current) {
      gsap.fromTo(
        playerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    // Rotate album when playing
    if (albumRef.current) {
      if (isPlaying) {
        gsap.to(albumRef.current, {
          rotation: 360,
          duration: 10,
          repeat: -1,
          ease: 'none'
        });
      } else {
        gsap.killTweensOf(albumRef.current);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className={styles.dashboard}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Music</h1>
          <p className={styles.subtitle}>Discover and play your favorite tracks</p>

          {/* Dashboard content will be built from scratch */}
        </div>
      </main>

      {/* Bottom Music Player */}
      <div ref={playerRef} className={styles.player}>
        <div className={styles.playerContainer}>
          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className={styles.progressBar}
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
              }}
            />
            <span className={styles.timeLabel}>{formatTime(duration)}</span>
          </div>

          <div className={styles.playerMain}>
            {/* Current Track Info */}
            <div className={styles.trackInfo}>
              <div ref={albumRef} className={styles.albumArt}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className={styles.trackDetails}>
                <h3>Summer Vibes</h3>
                <p>Featured Artist</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className={styles.controls}>
              <button className={styles.controlButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              
              <button onClick={togglePlay} className={styles.playButton}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button className={styles.controlButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className={styles.volumeSection}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeBar}
                style={{
                  background: `linear-gradient(to right, white 0%, white ${volume}%, #374151 ${volume}%, #374151 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
