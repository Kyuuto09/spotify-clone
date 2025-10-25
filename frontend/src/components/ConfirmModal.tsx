'use client';

import { useEffect } from 'react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Icon Container with animated background */}
        <div className={styles.iconContainer}>
          <div className={styles.iconCircle}>
            <svg 
              className={styles.iconSvg} 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className={styles.contentWrapper}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <p className={styles.modalMessage}>{message}</p>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            <span>{cancelText}</span>
          </button>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
