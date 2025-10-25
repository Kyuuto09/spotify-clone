'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<'login' | 'signup' | 'user' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownPanelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Check if user is logged in (only on client side)
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
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
    <>
      {/* Overlay when dropdown is open */}
      {activeDropdown && (
        <div 
          className={styles.overlay}
          onClick={() => setActiveDropdown(null)}
        />
      )}

      <nav ref={navRef} className={styles.navbar}>
        <div className={styles.navContent}>
          {/* Logo */}
          <Link ref={logoRef} href="/" className={styles.logoLink}>
            Spotify Clone
          </Link>

          {/* Navigation Links (only show when logged in) */}
          {isMounted && isLoggedIn && (
            <div className={styles.navLinks}>
              <Link href="/tracks" className={styles.navLink}>
                All Tracks
              </Link>
              <Link href="/genres" className={styles.navLink}>
                Genres
              </Link>
              <Link href="/upload" className={styles.navLink}>
                Upload Track
              </Link>
            </div>
          )}

          {/* Auth Buttons or User Menu */}
          <div 
            ref={(el) => {
              dropdownRef.current = el;
              buttonsRef.current = el;
            }}
            className={styles.authButtons}
          >
            {!isMounted ? (
              /* Placeholder during SSR to prevent hydration mismatch */
              <>
                <button className={`${styles.loginButton} ${styles.hiddenPlaceholder}`}>
                  Log in
                </button>
                <button className={`${styles.signupButton} ${styles.hiddenPlaceholder}`}>
                  Sign up
                </button>
              </>
            ) : isLoggedIn ? (
              /* User Menu */
              <button
                onClick={() => toggleDropdown('user')}
                className={styles.userButton}
              >
                <div className={styles.userIcon}>
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                {user?.firstName || 'User'}
              </button>
            ) : (
              /* Login/Signup Buttons */
              <>
                <button
                  onClick={() => toggleDropdown('login')}
                  className={styles.loginButton}
                >
                  Log in
                </button>
                <button
                  onClick={() => toggleDropdown('signup')}
                  className={styles.signupButton}
                >
                  Sign up
                </button>
              </>
            )}

            {/* Dropdown Panel for Login/Signup */}
            {activeDropdown && activeDropdown !== 'user' && (
              <div ref={dropdownPanelRef} className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <h2 className={styles.dropdownHeaderTitle}>
                    {activeDropdown === 'login' ? 'Welcome Back' : 'Join Spotify Clone'}
                  </h2>
                  <p className={styles.dropdownHeaderSubtitle}>
                    {activeDropdown === 'login' 
                      ? 'Log in to continue to your account' 
                      : 'Create your account to get started'}
                  </p>
                </div>
                <div className={styles.dropdownContent}>
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
              <div ref={dropdownPanelRef} className={styles.dropdown}>
                <div className={styles.userMenuContent}>
                  <div className={styles.userInfo}>
                    <div className={styles.userInfoAvatar}>
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className={styles.userInfoDetails}>
                      <div className={styles.userInfoName}>
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className={styles.userInfoEmail}>
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className={styles.menuDivider} />

                  <button onClick={handleLogout} className={styles.logoutButton}>
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
      </nav>
    </>
  );
}