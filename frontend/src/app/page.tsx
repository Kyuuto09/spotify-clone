'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const mainAppRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        setIsLoggedIn(true);
      }
      
      // Listen for login event (when user logs in without page reload)
      const handleLogin = () => {
        setIsLoggedIn(true);
      };
      
      window.addEventListener('userLoggedIn', handleLogin);
      
      return () => {
        window.removeEventListener('userLoggedIn', handleLogin);
      };
    }
  }, []);

  // Animate letters flying away when logged in
  useEffect(() => {
    if (isLoggedIn && titleRef.current && subtitleRef.current && heroSectionRef.current) {
      // If letters aren't split yet (entrance animation didn't run), split them now
      const titleLetters = titleRef.current.querySelectorAll('span');
      if (titleLetters.length === 0) {
        // Split title
        const titleText = titleRef.current.textContent || '';
        titleRef.current.innerHTML = '';
        titleText.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          span.style.opacity = '1';
          if (char === ' ') span.style.width = '0.5em';
          titleRef.current?.appendChild(span);
        });
      }
      
      const subtitleWords = subtitleRef.current.querySelectorAll('span');
      if (subtitleWords.length === 0) {
        // Split subtitle
        const subtitleText = subtitleRef.current.textContent || '';
        subtitleRef.current.innerHTML = '';
        subtitleText.split(' ').forEach((word, index, array) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.style.display = 'inline-block';
          span.style.opacity = '1';
          subtitleRef.current?.appendChild(span);
          
          // Add space after each word except the last one
          if (index < array.length - 1) {
            const space = document.createTextNode(' ');
            subtitleRef.current?.appendChild(space);
          }
        });
      }

      // Wait 500ms so user can see the full text before it flies away
      setTimeout(() => {
        if (!titleRef.current || !subtitleRef.current) return;

        // Animate title letters flying away
        const letters = titleRef.current.querySelectorAll('span');
        if (letters.length > 0) {
          gsap.to(letters, {
            opacity: 0, // Fades to 0
            y: -80, // Much shorter distance - fade out before reaching edge
            x: (index) => (index % 2 === 0 ? -150 : 150), // Shorter horizontal
            rotation: (index) => (index % 2 === 0 ? -45 : 45),
            scale: 0,
            duration: 0.5, // Even faster
            stagger: 0.012,
            ease: 'power2.in' // Fast fade
          });
        }

        // Animate subtitle words flying away
        const words = subtitleRef.current.querySelectorAll('span');
        if (words.length > 0) {
          gsap.to(words, {
            opacity: 0,
            y: 80, // Shorter distance
            x: (index) => (index % 2 === 0 ? 150 : -150),
            rotation: (index) => (index % 2 === 0 ? 45 : -45),
            scale: 0,
            duration: 0.5,
            stagger: 0.01,
            delay: 0.08,
            ease: 'power2.in'
          });
        }

        // Fade out floating elements
        if (floatingElementsRef.current) {
          gsap.to(floatingElementsRef.current.children, {
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: 'power2.in'
          });
        }

        // Fade out hero section and show main app
        if (heroSectionRef.current) {
          gsap.to(heroSectionRef.current, {
            opacity: 0,
            duration: 0.6,
            delay: 1.5,
            ease: 'power2.in',
            onComplete: () => {
              setShowMainApp(true);
              setTimeout(() => {
                if (mainAppRef.current) {
                  gsap.fromTo(
                    mainAppRef.current,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
                  );
                }
              }, 50);
            }
          });
        }
      }, 500);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Prevent animation from running multiple times in dev mode
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Skip entrance animations if user is already logged in
    if (isLoggedIn) {
      // Just split the text without animating - show everything immediately
      if (titleRef.current) {
        const text = titleRef.current.textContent || '';
        titleRef.current.innerHTML = '';
        
        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          span.style.opacity = '1'; // Fully visible immediately
          if (char === ' ') {
            span.style.width = '0.5em';
          }
          titleRef.current?.appendChild(span);
        });
      }

      if (subtitleRef.current) {
        const text = subtitleRef.current.textContent || '';
        subtitleRef.current.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach((word, index) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.style.display = 'inline-block';
          span.style.opacity = '1'; // Fully visible immediately
          subtitleRef.current?.appendChild(span);
          
          // Add space after each word except the last one
          if (index < words.length - 1) {
            const space = document.createTextNode(' ');
            subtitleRef.current?.appendChild(space);
          }
        });
      }
      
      return; // Exit early, don't run entrance animations
    }

    // Split title into individual letters and animate
    if (titleRef.current) {
      const text = titleRef.current.textContent || '';
      titleRef.current.innerHTML = ''; // Clear the text
      
      // Create span for each character (including spaces)
      text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        // Preserve spaces
        if (char === ' ') {
          span.style.width = '0.5em';
        }
        titleRef.current?.appendChild(span);
      });

      // Animate each letter with X-axis rotation
      const letters = titleRef.current.querySelectorAll('span');
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          rotationX: -90,
          y: 50
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          duration: 0.8,
          stagger: 0.05, // Delay between each letter
          ease: 'back.out(1.2)',
          transformPerspective: 400,
          transformOrigin: '50% 50%'
        }
      );
    }

    // Animate subtitle with delay
    if (subtitleRef.current) {
      const text = subtitleRef.current.textContent || '';
      subtitleRef.current.innerHTML = '';
      
      // Split into words and wrap each in a span
      const words = text.split(' ');
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        subtitleRef.current?.appendChild(span);
        
        // Add space after each word except the last one
        if (index < words.length - 1) {
          const space = document.createTextNode(' ');
          subtitleRef.current?.appendChild(space);
        }
      });

      // Animate each word with smooth fade and slide effect
      const wordSpans = subtitleRef.current.querySelectorAll('span');
      gsap.fromTo(
        wordSpans,
        {
          opacity: 0,
          y: 30,
          filter: 'blur(8px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: {
            amount: 1.2, // Total time for all words
            from: 'start',
            ease: 'power2.out'
          },
          delay: 1.2,
          ease: 'power3.out'
        }
      );

      // Add subtle glow pulse to words after they appear
      gsap.to(wordSpans, {
        textShadow: '0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.4), 0 0 90px rgba(255,255,255,0.2)',
        duration: 1.5,
        stagger: 0.1,
        delay: 2.5,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut'
      });
    }

    // Animate floating elements
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.children;
      
      Array.from(elements).forEach((element, index) => {
        // Initial fade in
        gsap.fromTo(
          element,
          { 
            opacity: 0,
            scale: 0
          },
          {
            opacity: 0.6,
            scale: 1,
            duration: 0.8,
            delay: 0.5 + index * 0.1,
            ease: 'back.out(1.7)'
          }
        );

        // Continuous floating animation
        gsap.to(element, {
          y: '+=30',
          x: '+=20',
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2
        });

        // Rotation animation
        gsap.to(element, {
          rotation: 360,
          duration: 10 + index * 2,
          repeat: -1,
          ease: 'none'
        });
      });
    }
  }, [isLoggedIn]); // Added isLoggedIn dependency

  return (
    <>
      <div 
        className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black" 
        style={{ 
          overflow: 'hidden', 
          position: 'relative',
          width: '100vw',
          height: '100vh'
        }}
      >
        {/* Hero Section */}
        {!showMainApp && (
        <section 
          ref={heroSectionRef}
          className="relative flex items-center justify-center min-h-screen" 
          style={{ 
            overflow: 'hidden',
            width: '100%',
            height: '100%'
          }}
        >
          <div 
            className="text-center z-10" 
            style={{ 
              overflow: 'visible',
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem'
            }}
          >
            <h1 
              ref={titleRef}
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent text-center"
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              Spotify Clone
            </h1>
            <p 
              ref={subtitleRef}
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed text-center"
              style={{ 
                perspective: '1000px', 
                transformStyle: 'preserve-3d',
                overflow: 'visible',
                margin: '0 auto',
                maxWidth: '800px'
              }}
            >
              A modern music streaming app built with React, Next.js, and Tailwind CSS.
            </p>
          </div>

          {/* Floating Music Elements */}
          <div ref={floatingElementsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/12 w-3 h-3 bg-green-400/60 rounded-full"></div>
            <div className="absolute top-1/3 right-1/12 w-4 h-4 bg-purple-400/60 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/6 w-2 h-2 bg-blue-400/60 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/6 w-3 h-3 bg-pink-400/60 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-yellow-400/60 rounded-full"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full"></div>
            <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-orange-400/60 rounded-full"></div>
            <div className="absolute top-1/6 right-2/3 w-1 h-1 bg-red-400/60 rounded-full"></div>
          </div>
        </section>
        )}

        {/* Main App - Shows after login */}
        {showMainApp && (
          <div 
            ref={mainAppRef}
            className="flex items-center justify-center min-h-screen"
          >
            <h1 className="text-6xl font-bold text-white">test</h1>
          </div>
        )}
      </div>
    </>
  );
}