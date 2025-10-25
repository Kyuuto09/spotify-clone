'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedHeaderProps {
  title: string;
  subtitle: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ title, subtitle }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.4,
        }
      );
    }
  }, []);

  return (
    <div className="text-center mb-12">
      <h1 ref={titleRef} className="text-5xl font-bold mb-4 opacity-0">
        {title}
      </h1>
      <p ref={subtitleRef} className="text-gray-400 text-lg opacity-0">
        {subtitle}
      </p>
    </div>
  );
};

export default AnimatedHeader;
