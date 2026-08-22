'use client';

import React from 'react';

interface PageFlip3DOverlayProps {
  direction: 'forward' | 'backward' | null;
  theme?: 'classic' | 'alpine';
}

export const PageFlip3DOverlay: React.FC<PageFlip3DOverlayProps> = ({ direction, theme = 'classic' }) => {
  if (!direction) return null;

  const isAlpine = theme === 'alpine';

  return (
    <div
      className="page-flip-3d-stage no-print"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'visible',
      }}
    >
      {/* Dynamic Ambient Shadow over stationary pages */}
      <div className={`flip-ambient-shadow flip-shadow-${direction}`} />

      {/* 180-Degree Rotating Page Leaf */}
      <div className={`flip-leaf-3d flip-leaf-${direction}`}>
        {/* FRONT FACE of the turning page (visible from 0deg to 90deg) */}
        <div
          className="flip-face flip-face-front"
          style={{
            backgroundColor: isAlpine ? '#fbf8f2' : 'var(--paper-bg)',
            borderColor: isAlpine ? '#23170a' : 'var(--ink-black)',
          }}
        >
          {/* Dot grid simulation */}
          <div className="flip-dot-grid" />
          {/* Subtle page gradient shadow during turn */}
          <div className="flip-lighting-front" />
        </div>

        {/* BACK FACE of the turning page (visible from 90deg to 180deg) */}
        <div
          className="flip-face flip-face-back"
          style={{
            backgroundColor: isAlpine ? '#fbf8f2' : 'var(--paper-bg)',
            borderColor: isAlpine ? '#23170a' : 'var(--ink-black)',
          }}
        >
          {/* Dot grid simulation */}
          <div className="flip-dot-grid" />
          {/* Subtle page shadow when landing */}
          <div className="flip-lighting-back" />
        </div>
      </div>
    </div>
  );
};
