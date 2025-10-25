'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import ConfirmModal from '@/components/ConfirmModal';
import { apiConfig } from '@/config/api';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; genreId: string | null; genreName: string }>({
    isOpen: false,
    genreId: null,
    genreName: ''
  });
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch(apiConfig.endpoints.genres);
      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load genres');
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new genre
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(apiConfig.endpoints.genres, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name })
      });

      if (response.ok) {
        // Success confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1a1', '#737373']
        });

        setShowAddModal(false);
        setFormData({ name: '' });
        fetchGenres();
        setError('');
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to add genre');
      }
    } catch {
      setError('Network error. Please check backend connection.');
    }
  };

  // Edit genre
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenre) return;

    try {
      const response = await fetch(apiConfig.endpoints.genre(editingGenre.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name })
      });

      if (response.ok) {
        // Success confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1a1', '#737373']
        });

        setEditingGenre(null);
        setFormData({ name: '' });
        fetchGenres();
        setError('');
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to update genre');
      }
    } catch {
      setError('Network error. Please check backend connection.');
    }
  };

  // Delete genre - open confirmation modal
  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, genreId: id, genreName: name });
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteModal.genreId) return;

    try {
      const response = await fetch(apiConfig.endpoints.genre(deleteModal.genreId), {
        method: 'DELETE'
      });

      if (response.ok || response.status === 204) {
        fetchGenres();
        setError('');
        setDeleteModal({ isOpen: false, genreId: null, genreName: '' });
      } else {
        setError('Failed to delete genre');
        setDeleteModal({ isOpen: false, genreId: null, genreName: '' });
      }
    } catch {
      setError('Network error. Please check backend connection.');
      setDeleteModal({ isOpen: false, genreId: null, genreName: '' });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, genreId: null, genreName: '' });
  };

  const openAddModal = () => {
    setFormData({ name: '' });
    setShowAddModal(true);
    setError('');
  };

  const openEditModal = (genre: Genre) => {
    setFormData({ name: genre.name });
    setEditingGenre(genre);
    setError('');
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditingGenre(null);
    setFormData({ name: '' });
    setError('');
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

  return (
    <main className={styles.genresPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Music Genres</h1>
            <p className={styles.subtitle}>Manage your music genres</p>
          </div>
          <button onClick={openAddModal} className={styles.addButton}>
            + Add Genre
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        
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
              <div className={styles.cardActions}>
                <button 
                  onClick={() => openEditModal(genre)}
                  className={styles.editButton}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(genre.id, genre.name)}
                  className={styles.deleteButton}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingGenre) && (
        <div className={styles.modal} onClick={closeModals}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingGenre ? 'Edit Genre' : 'Add New Genre'}
            </h2>
            <form onSubmit={editingGenre ? handleEdit : handleAdd}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Genre Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={styles.input}
                  required
                  placeholder="e.g., J-Core, Hi-Tech, Pop"
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={closeModals}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingGenre ? 'Update' : 'Add'} Genre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Genre"
        message={`Are you sure you want to delete "${deleteModal.genreName}"? This action cannot be undone and may affect tracks using this genre.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </main>
  );
}