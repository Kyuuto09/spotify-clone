'use client';

import { useState } from 'react';

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
      console.log('URL:', 'http://localhost:5001/api/auth/register');
      console.log('Data:', requestData);

      const response = await fetch('http://localhost:5001/api/auth/register', {
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      {/* Left Side - Form */}
      <div>
        <h2 className="text-white font-bold mb-4" style={{ fontSize: '24px' }}>Create an Account</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              autoComplete="off"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #4B5563',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = 'white';
                e.currentTarget.setAttribute('autocomplete', 'off');
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#4B5563'}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              autoComplete="off"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #4B5563',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = 'white';
                e.currentTarget.setAttribute('autocomplete', 'off');
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#4B5563'}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              autoComplete="off"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #4B5563',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = 'white';
                e.currentTarget.setAttribute('autocomplete', 'off');
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#4B5563'}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (min 6 characters)"
              required
              autoComplete="new-password"
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #4B5563',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = 'white';
                e.currentTarget.setAttribute('autocomplete', 'new-password');
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#4B5563'}
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #4B5563',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = 'white';
                e.currentTarget.setAttribute('autocomplete', 'new-password');
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#4B5563'}
            />
          </div>

          <div>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              placeholder="Birth Date"
              autoComplete="off"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #4B5563',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                colorScheme: 'dark'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = 'white';
                e.currentTarget.setAttribute('autocomplete', 'off');
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#4B5563'}
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="font-semibold"
              style={{
                fontSize: '15px',
                padding: '12px 32px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '500px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? 'Creating...' : 'Create an Account'}
              {!isLoading && <span>→</span>}
            </button>
          </div>

          {message && (
            <div style={{ 
              fontSize: '14px',
              color: message.includes('successful') ? '#4ade80' : '#f87171',
              marginTop: '8px'
            }}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Right Side - Info */}
      <div style={{ borderLeft: '1px solid #374151', paddingLeft: '40px' }}>
        <h3 className="text-white font-semibold mb-3" style={{ fontSize: '18px' }}>Why create an account?</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: '#9CA3AF' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '12px' }}>✱</span>
            <span>It&apos;s free</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '12px' }}>✱</span>
            <span>Create and share playlists</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '12px' }}>✱</span>
            <span>Discover new music daily</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
