'use client';

import { useEffect } from 'react';
import styles from './InfoModal.module.css';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  onClose: () => void;
  closeText?: string;
}

export default function InfoModal({
  isOpen,
  title,
  message,
  onClose,
  closeText = 'Got it',
}: InfoModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
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
                d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
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
          <div className={styles.modalMessage}>{message}</div>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.closeButton}`}
            onClick={onClose}
          >
            <span>{closeText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
