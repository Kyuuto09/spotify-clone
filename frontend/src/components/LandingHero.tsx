'use client';

export default function LandingHero() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="text-center px-8 max-w-4xl">
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-8">
          Spotify Clone
        </h1>
        <p className="text-2xl md:text-3xl text-gray-300">
          A modern music streaming app built with React, Next.js, and Tailwind CSS.
        </p>
      </div>
    </div>
  );
}
