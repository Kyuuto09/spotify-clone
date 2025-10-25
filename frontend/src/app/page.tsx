'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './home.module.css';

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Prevent animation from running multiple times in dev mode
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Split title into individual letters and animate with 3D flip
    if (titleRef.current) {
      const text = titleRef.current.textContent || '';
      titleRef.current.innerHTML = ''; // Clear the text
      
      // Create span for each character (including spaces)
      text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        // Preserve spaces with proper width
        if (char === ' ') {
          span.style.width = '0.4em';
        }
        titleRef.current?.appendChild(span);
      });

      // Enhanced 3D flip animation - smoother than before
      const letters = titleRef.current.querySelectorAll('span');
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          rotationX: -90,
          y: 50,
          scale: 0.8
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.04,
          ease: 'back.out(1.4)',
          transformPerspective: 600,
          transformOrigin: '50% 50%'
        }
      );
    }

    // Animate subtitle word by word - enhanced smoothness
    if (subtitleRef.current) {
      const text = subtitleRef.current.textContent || '';
      subtitleRef.current.innerHTML = '';
      
      // Split into words and wrap each in a span
      const words = text.split(' ');
      words.forEach((word) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.35em';
        span.style.opacity = '0';
        subtitleRef.current?.appendChild(span);
      });

      // Smooth word-by-word fade up animation
      const wordSpans = subtitleRef.current.querySelectorAll('span');
      gsap.fromTo(
        wordSpans,
        {
          opacity: 0,
          y: 20,
          filter: 'blur(4px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.08, // Smooth sequential appearance
          delay: 0.8,
          ease: 'power2.out'
        }
      );

      // Add smooth glow effect to subtitle
      gsap.to(wordSpans, {
        textShadow: '0 0 25px rgba(255,255,255,0.5), 0 0 50px rgba(255,255,255,0.3), 0 0 75px rgba(255,255,255,0.2)',
        duration: 1.5,
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
  }, []);

  return (
    <>
      <div className={styles.homepage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 
              ref={titleRef}
              className={styles.title}
            >
              Spotify Clone
            </h1>
            <p 
              ref={subtitleRef}
              className={styles.subtitle}
            >
              A modern music streaming app built with React, Next.js, and Tailwind CSS.
            </p>
            
            {/* Author Credit */}
            <div className={styles.authorCredit}>
              <div className={styles.authorBadge}>
                <span className={styles.craftedText}>Crafted with</span>
                <span className={styles.heartEmoji}>💜</span>
                <span className={styles.byText}>by</span>
                <a 
                  href="https://github.com/Kyuuto09" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.authorLink}
                >
                  <span className={styles.authorName}>Kyuuto09</span>
                </a>
              </div>
            </div>
          </div>

          {/* Floating Music Elements */}
          <div ref={floatingElementsRef} className={styles.floatingElements}>
            <div className={`${styles.dot} ${styles.dot1}`}></div>
            <div className={`${styles.dot} ${styles.dot2}`}></div>
            <div className={`${styles.dot} ${styles.dot3}`}></div>
            <div className={`${styles.dot} ${styles.dot4}`}></div>
            <div className={`${styles.dot} ${styles.dot5}`}></div>
            <div className={`${styles.dot} ${styles.dot6}`}></div>
            <div className={`${styles.dot} ${styles.dot7}`}></div>
            <div className={`${styles.dot} ${styles.dot8}`}></div>
          </div>
        </section>
      </div>
    </>
  );
}