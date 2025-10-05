'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      gsap.fromTo(
        subtitleRef.current,
        { 
          opacity: 0, 
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1, // Delay could be adjusted if you want to wait for title animation, also be aware that title animation duration is around 0.8s + stagger time
          ease: 'power2.out'
        }
      );
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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-6xl mx-auto z-10">
            <h1 
              ref={titleRef}
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent text-center"
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              Spotify Clone
            </h1>
            <p 
              ref={subtitleRef}
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto"
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
      </div>
    </>
  );
}