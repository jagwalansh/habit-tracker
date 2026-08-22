'use client';

import React from 'react';

interface MountainArtworkProps {
  variant?: 'top' | 'mini';
}

export const MountainArtwork: React.FC<MountainArtworkProps> = ({ variant = 'top' }) => {
  if (variant === 'mini') {
    return (
      <svg
        viewBox="0 0 100 50"
        style={{ width: '80px', height: '40px', display: 'block' }}
        fill="none"
        stroke="var(--ink-black)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Left Peak */}
        <polygon points="10,46 38,12 58,46" strokeWidth="1.8" fill="rgba(255,255,255,0.8)" />
        {/* Right Peak */}
        <polygon points="45,46 72,6 94,46" strokeWidth="1.8" fill="rgba(255,255,255,0.8)" />
        
        {/* Ridge line */}
        <path d="M 38,12 L 35,26 L 44,38 L 48,46" strokeWidth="1.2" />
        <path d="M 72,6 L 68,22 L 76,34 L 80,46" strokeWidth="1.2" />

        {/* Shading hatches */}
        <path d="M 32,20 L 26,24 M 34,26 L 24,32 M 36,32 L 20,40 M 38,38 L 16,46" strokeWidth="0.9" opacity="0.8" />
        <path d="M 66,16 L 58,22 M 68,24 L 54,32 M 70,32 L 50,42 M 72,38 L 48,46" strokeWidth="0.9" opacity="0.8" />
      </svg>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: '62px' }}>
      <svg
        viewBox="0 0 700 70"
        style={{ width: '100%', height: '100%', display: 'block' }}
        fill="none"
        stroke="var(--ink-black)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Background small peaks */}
        <polygon points="20,68 80,30 140,68" strokeWidth="1.2" fill="none" opacity="0.4" />
        <polygon points="520,68 580,24 640,68" strokeWidth="1.2" fill="none" opacity="0.4" />

        {/* Main Mountain Silhouette */}
        {/* Peak 1 */}
        <polygon points="50,68 115,22 180,68" strokeWidth="2" fill="rgba(255,255,255,0.9)" />
        <path d="M 115,22 L 110,38 L 122,50 L 125,68" strokeWidth="1.4" />
        <path d="M 108,28 L 92,38 M 110,36 L 86,48 M 112,44 L 78,58" strokeWidth="1" />

        {/* Peak 2 (Highest center-left) */}
        <polygon points="160,68 245,6 330,68" strokeWidth="2.2" fill="rgba(255,255,255,0.9)" />
        <path d="M 245,6 L 240,24 L 255,42 L 250,56 L 260,68" strokeWidth="1.5" />
        <path d="M 238,14 L 210,30 M 240,24 L 195,44 M 242,34 L 180,58 M 246,44 L 168,68" strokeWidth="1.1" />

        {/* Peak 3 (Center) */}
        <polygon points="310,68 375,18 440,68" strokeWidth="2" fill="rgba(255,255,255,0.9)" />
        <path d="M 375,18 L 370,36 L 385,52 L 388,68" strokeWidth="1.4" />
        <path d="M 368,26 L 348,38 M 370,36 L 338,50 M 372,46 L 328,62" strokeWidth="1" />

        {/* Peak 4 (Center-right sharp) */}
        <polygon points="420,68 495,8 570,68" strokeWidth="2.2" fill="rgba(255,255,255,0.9)" />
        <path d="M 495,8 L 488,28 L 505,46 L 512,68" strokeWidth="1.5" />
        <path d="M 488,18 L 460,34 M 490,28 L 445,48 M 492,38 L 430,62" strokeWidth="1.1" />

        {/* Peak 5 (Far Right) */}
        <polygon points="550,68 625,16 690,68" strokeWidth="2" fill="rgba(255,255,255,0.9)" />
        <path d="M 625,16 L 618,34 L 632,50 L 638,68" strokeWidth="1.4" />
        <path d="M 618,24 L 595,38 M 620,34 L 580,50 M 622,44 L 565,64" strokeWidth="1" />

        {/* Base line */}
        <line x1="0" y1="68" x2="700" y2="68" stroke="var(--ink-black)" strokeWidth="2" />
      </svg>
    </div>
  );
};
