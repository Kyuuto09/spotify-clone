'use client';

import { useState } from 'react';

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
        
        // Dispatch custom event to notify page of login
        window.dispatchEvent(new Event('userLoggedIn'));
        
        setTimeout(() => {
          onSuccess();
          // Don't reload - let the animation handle the transition
        }, 500);
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      {/* Left Side - Form */}
      <div>
        <h2 className="text-white font-bold mb-4" style={{ fontSize: '24px' }}>Sign In</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              placeholder="Password"
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

          <div style={{ marginTop: '8px' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="font-semibold transition-all duration-200"
              style={{
                fontSize: '15px',
                padding: '10px 28px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '500px',
                cursor: 'pointer',
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
              {isLoading ? 'Signing in...' : 'Login'}
              {!isLoading && <span>→</span>}
            </button>
          </div>

          <div style={{ marginTop: '4px' }}>
            <button 
              type="button" 
              className="text-gray-400 hover:text-white transition-colors"
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '14px',
                padding: '0'
              }}
            >
              Forgot your password?
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
        <h3 className="text-white font-semibold mb-3" style={{ fontSize: '18px' }}>Why sign in?</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: '#9CA3AF' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '12px' }}>✱</span>
            <span>Access your saved playlists</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '12px' }}>✱</span>
            <span>Stream unlimited music</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '12px' }}>✱</span>
            <span>Personalized recommendations</span>
          </li>
        </ul>
      </div>
    </div>
  );
}