'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Notebook3DSpreadProps {
  currentKey: string; // e.g. "2026-08"
  flipDirection: 'forward' | 'backward' | null;
  children: React.ReactNode;
  theme?: 'classic' | 'alpine';
}

export const Notebook3DSpread: React.FC<Notebook3DSpreadProps> = ({
  currentKey,
  flipDirection,
  children,
  theme = 'classic',
}) => {
  // Keep previous content for the outgoing side during 180-degree flip
  const [displayedChildren, setDisplayedChildren] = useState<React.ReactNode>(children);
  const [outgoingChildren, setOutgoingChildren] = useState<React.ReactNode>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const prevKeyRef = useRef<string>(currentKey);

  useEffect(() => {
    if (prevKeyRef.current !== currentKey) {
      if (flipDirection) {
        setOutgoingChildren(displayedChildren);
        setDisplayedChildren(children);
        setIsFlipping(true);

        const timer = setTimeout(() => {
          setIsFlipping(false);
          setOutgoingChildren(null);
        }, 700);

        prevKeyRef.current = currentKey;
        return () => clearTimeout(timer);
      } else {
        setDisplayedChildren(children);
        prevKeyRef.current = currentKey;
      }
    } else {
      setDisplayedChildren(children);
    }
  }, [currentKey, children, flipDirection, displayedChildren]);

  if (!isFlipping || !outgoingChildren || !flipDirection) {
    // Normal stationary spread
    return (
      <div className="notebook-spread-root" style={{ position: 'relative', width: '100%' }}>
        {displayedChildren}
      </div>
    );
  }

  // ================= 180-DEGREE REALISTIC 2-PAGE SPREAD FLIP =================
  return (
    <div
      className="notebook-spread-root notebook-perspective-stage"
      style={{
        position: 'relative',
        width: '100%',
        perspective: '2800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. STATIONARY BASE SPREAD UNDERNEATH */}
      <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
        {/* Left Stationary Page */}
        <div
          style={{
            width: '50%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ width: '200%', position: 'relative', left: '0%' }}>
            {flipDirection === 'forward' ? outgoingChildren : displayedChildren}
          </div>
        </div>

        {/* Right Stationary Page */}
        <div
          style={{
            width: '50%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ width: '200%', position: 'relative', left: '-100%' }}>
            {flipDirection === 'forward' ? displayedChildren : outgoingChildren}
          </div>
        </div>
      </div>

      {/* 2. REALISTIC 180-DEGREE ROTATING PAGE LEAF ACROSS CENTER SPINE */}
      {flipDirection === 'forward' ? (
        // Forward: Right page (50% to 100%) lifts from right edge and flips 180 deg to the left
        <div
          className="flip-leaf-3d-wrapper flip-leaf-forward-180"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          {/* FRONT of the turning leaf: Outgoing Right Page */}
          <div
            className="flip-leaf-side flip-leaf-front"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              backgroundColor: theme === 'alpine' ? '#fbf8f2' : 'var(--paper-bg)',
              boxShadow: 'inset 8px 0 16px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '200%', position: 'relative', left: '-100%' }}>
              {outgoingChildren}
            </div>
            {/* Dynamic shading gradient during lift */}
            <div className="flip-shading-front-forward" />
          </div>

          {/* BACK of the turning leaf: Incoming Left Page (lands on the left side) */}
          <div
            className="flip-leaf-side flip-leaf-back"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: theme === 'alpine' ? '#fbf8f2' : 'var(--paper-bg)',
              boxShadow: 'inset -8px 0 16px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '200%', position: 'relative', left: '0%' }}>
              {displayedChildren}
            </div>
            {/* Dynamic shading gradient during landing */}
            <div className="flip-shading-back-forward" />
          </div>
        </div>
      ) : (
        // Backward: Left page (0% to 50%) lifts from left edge and flips 180 deg to the right
        <div
          className="flip-leaf-3d-wrapper flip-leaf-backward-180"
          style={{
            position: 'absolute',
            top: 0,
            left: '0%',
            width: '50%',
            height: '100%',
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          {/* FRONT of the turning leaf: Outgoing Left Page */}
          <div
            className="flip-leaf-side flip-leaf-front"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              backgroundColor: theme === 'alpine' ? '#fbf8f2' : 'var(--paper-bg)',
              boxShadow: 'inset -8px 0 16px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '200%', position: 'relative', left: '0%' }}>
              {outgoingChildren}
            </div>
            {/* Dynamic shading gradient during lift */}
            <div className="flip-shading-front-backward" />
          </div>

          {/* BACK of the turning leaf: Incoming Right Page (lands on the right side) */}
          <div
            className="flip-leaf-side flip-leaf-back"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: theme === 'alpine' ? '#fbf8f2' : 'var(--paper-bg)',
              boxShadow: 'inset 8px 0 16px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '200%', position: 'relative', left: '-100%' }}>
              {displayedChildren}
            </div>
            {/* Dynamic shading gradient during landing */}
            <div className="flip-shading-back-backward" />
          </div>
        </div>
      )}
    </div>
  );
};
