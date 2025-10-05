'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<'login' | 'signup' | 'user' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownPanelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setActiveDropdown(null);
    window.location.reload();
  };

  // Animate navbar on mount
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        {
          y: -100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }

    // Animate logo
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {
          x: -30,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.6
        }
      );
    }

    // Animate buttons
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll('button');
      gsap.fromTo(
        buttons,
        {
          x: 30,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.7
        }
      );
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  useEffect(() => {
    if (activeDropdown && dropdownPanelRef.current) {
      // Animate dropdown opening
      gsap.fromTo(
        dropdownPanelRef.current,
        {
          opacity: 0,
          y: -20,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out'
        }
      );
    }
  }, [activeDropdown]);

  const toggleDropdown = (type: 'login' | 'signup' | 'user') => {
    if (activeDropdown === type) {
      // Animate out before closing
      if (dropdownPanelRef.current) {
        gsap.to(dropdownPanelRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => setActiveDropdown(null)
        });
      }
    } else {
      setActiveDropdown(type);
    }
  };

  return (
    <nav 
      ref={navRef}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50, 
        background: 'black'
      }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 40px',
        width: '100%',
        borderBottom: '1px solid #1F2937'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: '80px',
          width: '100%'
        }}>
          {/* Logo */}
          <Link 
            ref={logoRef}
            href="/" 
            style={{ 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '20px',
              letterSpacing: '-0.02em', 
              flexShrink: 0,
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#D1D5DB'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            Spotify Clone
          </Link>

          {/* Auth Buttons or User Menu */}
          <div 
            ref={(el) => {
              dropdownRef.current = el;
              buttonsRef.current = el;
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', flexShrink: 0 }} 
          >
            {isLoggedIn ? (
              /* User Menu */
              <button
                onClick={() => toggleDropdown('user')}
                className="font-medium"
                style={{ 
                  fontSize: '15px',
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
                {user?.firstName || 'User'}
              </button>
            ) : (
              /* Login/Signup Buttons */
              <>
            <button
              onClick={() => toggleDropdown('login')}
              className="font-medium"
              style={{ 
                fontSize: '15px',
                padding: '10px 24px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Log in
            </button>
            <button
              onClick={() => toggleDropdown('signup')}
              className="font-semibold"
              style={{ 
                fontSize: '15px',
                padding: '12px 28px',
                background: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '500px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,255,255,0.1)';
              }}
            >
              Sign up
            </button>
            </>
            )}

            {/* Dropdown Panel */}
            {activeDropdown && activeDropdown !== 'user' && (
              <div 
                ref={dropdownPanelRef}
                className="absolute bg-black border border-gray-700"
                style={{
                  top: 'calc(100% + 20px)',
                  right: '0',
                  width: '700px',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  zIndex: 100
                }}
              >
                {/* Arrow pointing up */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: activeDropdown === 'signup' ? '52px' : '20px',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #374151'
                  }}
                />

                <div style={{ padding: '32px' }}>
                  {activeDropdown === 'login' ? (
                    <LoginForm onSuccess={() => setActiveDropdown(null)} />
                  ) : (
                    <SignupForm onSuccess={() => setActiveDropdown(null)} />
                  )}
                </div>
              </div>
            )}

            {/* User Dropdown Menu */}
            {activeDropdown === 'user' && (
              <div
                ref={dropdownPanelRef}
                className="absolute bg-black border border-gray-700"
                style={{
                  top: 'calc(100% + 20px)',
                  right: '0',
                  minWidth: '220px',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  zIndex: 100
                }}
              >
                {/* Arrow pointing up */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '20px',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #374151'
                  }}
                />

                <div style={{ padding: '16px' }}>
                  {/* User Info */}
                  <div style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #374151',
                    marginBottom: '8px'
                  }}>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
                      {user?.email}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      color: '#f87171',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}