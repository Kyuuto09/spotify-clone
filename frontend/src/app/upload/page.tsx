'use client';

import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import styles from './upload.module.css';

interface Genre {
  id: string;
  name: string;
}

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artistName: '',
    genreId: '',
    releaseDate: '',
    audioFile: null as File | null,
    posterFile: null as File | null,
    posterUrl: '',
    artistImageFile: null as File | null,
    artistImageUrl: ''
  });
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [posterMode, setPosterMode] = useState<'file' | 'url'>('file');
  const [artistImageMode, setArtistImageMode] = useState<'file' | 'url'>('file');
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setGenresLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/genre`);
      if (response.ok) {
        const data = await response.json();
        setGenres(data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
      setMessage({ text: 'Failed to load genres. Please check backend connection.', type: 'error' });
    } finally {
      setGenresLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (!formData.audioFile) {
        setMessage({ text: 'Please select an audio file', type: 'error' });
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      if (formData.description) formDataToSend.append('description', formData.description);
      formDataToSend.append('audioFile', formData.audioFile);
      
      // Handle poster - either file or URL
      if (posterMode === 'file' && formData.posterFile) {
        formDataToSend.append('posterFile', formData.posterFile);
      } else if (posterMode === 'url' && formData.posterUrl) {
        formDataToSend.append('posterUrl', formData.posterUrl);
      }
      
      // Handle artist image - either file or URL
      if (artistImageMode === 'file' && formData.artistImageFile) {
        formDataToSend.append('artistImageFile', formData.artistImageFile);
      } else if (artistImageMode === 'url' && formData.artistImageUrl) {
        formDataToSend.append('artistImageUrl', formData.artistImageUrl);
      }
      
      // Add artist name
      if (formData.artistName) {
        formDataToSend.append('artistName', formData.artistName);
      }
      
      if (formData.genreId) formDataToSend.append('genreId', formData.genreId);
      if (formData.releaseDate) formDataToSend.append('releaseDate', formData.releaseDate);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      console.log('Uploading to:', `${apiUrl}/api/track/upload`);
      
      const response = await fetch(`${apiUrl}/api/track/upload`, {
        method: 'POST',
        body: formDataToSend
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        setMessage({ text: 'Track uploaded successfully!', type: 'success' });
        
        // Trigger smooth confetti celebration from button location
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          
          // Multiple bursts for extra celebration
          const count = 150;
          const defaults = {
            origin: { x, y },
            colors: ['#ffffff', '#a1a1a1', '#f87171', '#60a5fa', '#34d399'],
            scalar: 1.1,
            gravity: 0.7,
            drift: 0.2,
            ticks: 250,
            decay: 0.93
          };

          // First burst - wide explosion
          confetti({
            ...defaults,
            particleCount: count * 0.35,
            spread: 120,
            startVelocity: 40
          });

          // Second burst - left side
          setTimeout(() => {
            confetti({
              ...defaults,
              particleCount: count * 0.25,
              spread: 80,
              startVelocity: 35,
              angle: 120
            });
          }, 100);

          // Third burst - right side
          setTimeout(() => {
            confetti({
              ...defaults,
              particleCount: count * 0.25,
              spread: 80,
              startVelocity: 35,
              angle: 60
            });
          }, 150);

          // Fourth burst - upward fountain
          setTimeout(() => {
            confetti({
              ...defaults,
              particleCount: count * 0.15,
              spread: 50,
              startVelocity: 45,
              angle: 90
            });
          }, 250);
        }

        // Reset form
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            artistName: '',
            genreId: '',
            releaseDate: '',
            audioFile: null,
            posterFile: null,
            posterUrl: '',
            artistImageFile: null,
            artistImageUrl: ''
          });
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        setMessage({ 
          text: errorText || 'Failed to upload track', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error uploading track:', error);
      setMessage({ 
        text: `Network error: ${error instanceof Error ? error.message : 'Please make sure backend is running on port 5001'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.uploadPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Upload Track</h1>
        <p className={styles.subtitle}>Share your music with the world</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Track Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter track title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter track description (optional)"
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Audio File *</label>
            <div className={styles.fileUploadArea}>
              <input
                type="file"
                name="audioFile"
                accept="audio/mp3,audio/wav,audio/flac,audio/mpeg"
                onChange={handleFileChange}
                className={styles.fileInput}
                id="audio-upload"
                required
              />
              <label htmlFor="audio-upload" className={styles.fileUploadLabel}>
                <div className={styles.fileIcon}>🎵</div>
                <p className={styles.fileText}>
                  {formData.audioFile ? formData.audioFile.name : 'Click to upload audio file'}
                </p>
                <p className={styles.fileHint}>MP3, WAV, or FLAC</p>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cover Image (optional)</label>
            <div className={styles.toggleButtons}>
              <button 
                type="button"
                className={posterMode === 'file' ? styles.toggleActive : styles.toggleInactive}
                onClick={() => setPosterMode('file')}
              >
                Upload File
              </button>
              <button
                type="button"
                className={posterMode === 'url' ? styles.toggleActive : styles.toggleInactive}
                onClick={() => setPosterMode('url')}
              >
                Enter URL
              </button>
            </div>
            {posterMode === 'file' ? (
              <div className={styles.fileUploadArea}>
                <input
                  type="file"
                  name="posterFile"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  id="poster-upload"
                />
                <label htmlFor="poster-upload" className={styles.fileUploadLabel}>
                  <div className={styles.fileIcon}>🖼️</div>
                  <p className={styles.fileText}>
                    {formData.posterFile ? formData.posterFile.name : 'Click to upload cover image'}
                  </p>
                  <p className={styles.fileHint}>JPG, PNG, or WebP</p>
                </label>
              </div>
            ) : (
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={styles.input}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="artistName" className={styles.label}>Artist Name (optional)</label>
            <input
              type="text"
              id="artistName"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="Enter artist name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Artist Profile Picture (optional)</label>
            <div className={styles.toggleButtons}>
              <button 
                type="button"
                className={artistImageMode === 'file' ? styles.toggleActive : styles.toggleInactive}
                onClick={() => setArtistImageMode('file')}
              >
                Upload File
              </button>
              <button
                type="button"
                className={artistImageMode === 'url' ? styles.toggleActive : styles.toggleInactive}
                onClick={() => setArtistImageMode('url')}
              >
                Enter URL
              </button>
            </div>
            {artistImageMode === 'file' ? (
              <div className={styles.fileUploadArea}>
                <input
                  type="file"
                  name="artistImageFile"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  id="artist-image-upload"
                />
                <label htmlFor="artist-image-upload" className={styles.fileUploadLabel}>
                  <div className={styles.fileIcon}>👤</div>
                  <p className={styles.fileText}>
                    {formData.artistImageFile ? formData.artistImageFile.name : 'Click to upload artist profile picture'}
                  </p>
                  <p className={styles.fileHint}>JPG, PNG, or WebP</p>
                </label>
              </div>
            ) : (
              <input
                type="url"
                name="artistImageUrl"
                value={formData.artistImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/artist-image.jpg"
                className={styles.input}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Genre</label>
            {genresLoading ? (
              <div className={styles.loadingText}>Loading genres...</div>
            ) : (
              <select
                name="genreId"
                value={formData.genreId}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select a genre (optional)</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {message.text && (
            <div className={`${styles.message} ${message.type === 'success' ? styles.messageSuccess : styles.messageError}`}>
              {message.text}
            </div>
          )}

          <button 
            ref={buttonRef} 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>
      </div>
    </main>
  );
}