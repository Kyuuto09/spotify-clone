'use client';

import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import styles from './auth.module.css';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Trigger smooth confetti from button location
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          
          // Multiple bursts for smoother effect
          const count = 100;
          const defaults = {
            origin: { x, y },
            colors: ['#ffffff', '#a1a1a1', '#737373', '#525252'],
            scalar: 1,
            gravity: 0.8,
            drift: 0.1,
            ticks: 200,
            decay: 0.94
          };

          // First burst - wider spread
          confetti({
            ...defaults,
            particleCount: count * 0.4,
            spread: 100,
            startVelocity: 35
          });

          // Second burst - focused
          setTimeout(() => {
            confetti({
              ...defaults,
              particleCount: count * 0.3,
              spread: 60,
              startVelocity: 30
            });
          }, 100);

          // Third burst - upward
          setTimeout(() => {
            confetti({
              ...defaults,
              particleCount: count * 0.3,
              spread: 120,
              startVelocity: 25,
              angle: 60
            });
          }, 200);
        }
        
        setTimeout(() => {
          onSuccess();
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.authContainer}>
      {/* Left Side - Form */}
      <div className={styles.formSection}>
        <h2 className={styles.title}>Sign In</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              autoComplete="off"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="new-password"
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              ref={buttonRef}
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Signing in...' : 'Login'}
              {!isLoading && <span>→</span>}
            </button>
          </div>

          <div>
            <button type="button" className={styles.forgotPassword}>
              Forgot your password?
            </button>
          </div>

          {message && (
            <div className={`${styles.message} ${message.includes('successful') ? styles.messageSuccess : styles.messageError}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Right Side - Info */}
      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>Why sign in?</h3>
        <ul className={styles.benefitsList}>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✱</span>
            <span>Access your saved playlists</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✱</span>
            <span>Stream unlimited music</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✱</span>
            <span>Personalized recommendations</span>
          </li>
        </ul>
      </div>
    </div>
  );
}