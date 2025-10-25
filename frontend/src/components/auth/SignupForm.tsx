'use client';

import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { apiConfig } from '@/config/api';
import styles from './auth.module.css';

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      // Format data for backend
      const requestData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate || null
      };

      console.log('Sending registration request...');
      console.log('URL:', apiConfig.endpoints.register);
      console.log('Data:', requestData);

      const response = await fetch(apiConfig.endpoints.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response received:', response.status, response.statusText);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setMessage('Registration successful!');
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
          const count = 120;
          const defaults = {
            origin: { x, y },
            colors: ['#ffffff', '#a1a1a1', '#737373', '#525252'],
            scalar: 1,
            gravity: 0.8,
            drift: 0.1,
            ticks: 200,
            decay: 0.94
          };

          // First burst - explosion
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

          // Third burst - upward spray
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
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please make sure backend is running on port 5001.');
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
        <h2 className={styles.title}>Create an Account</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameFields}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              autoComplete="off"
              className={styles.input}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              autoComplete="off"
              className={styles.input}
            />
          </div>

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
              placeholder="Password (min 6 characters)"
              required
              autoComplete="new-password"
              minLength={6}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              autoComplete="new-password"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              placeholder="Birth Date"
              autoComplete="off"
              className={`${styles.input} ${styles.dateInput}`}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              ref={buttonRef}
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Creating...' : 'Create an Account'}
              {!isLoading && <span>→</span>}
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
        <h3 className={styles.infoTitle}>Why create an account?</h3>
        <ul className={styles.benefitsList}>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✱</span>
            <span>It&apos;s free</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✱</span>
            <span>Create and share playlists</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✱</span>
            <span>Discover new music daily</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
