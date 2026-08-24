'use client';

import React, { useState } from 'react';
import { MONTH_NAMES } from '../lib/utils';
import { Sparkles, Moon, Sun, Layers } from 'lucide-react';
import { Notebook3DSpread } from './Notebook3DSpread';

interface JournalBookProps {
  year: number;
  month: number;
  activeTab: 'TRACKER' | 'STATS' | 'SETTINGS';
  flipDirection?: 'forward' | 'backward' | null;
  onTabChange: (tab: 'TRACKER' | 'STATS' | 'SETTINGS') => void;
  onMonthSelect: (monthIndex: number) => void;
  children: React.ReactNode;
}

export const JournalBook: React.FC<JournalBookProps> = ({
  year,
  month,
  activeTab,
  flipDirection,
  onTabChange,
  onMonthSelect,
  children,
}) => {
  const [showBinder, setShowBinder] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const prevMonthName = MONTH_NAMES[(month + 11) % 12].slice(0, 3);
  const currentMonthName = MONTH_NAMES[month].slice(0, 3);
  const nextMonthName = MONTH_NAMES[(month + 1) % 12].slice(0, 3);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className="journal-wrapper">
      {/* Top Floating Controls Bar */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        padding: '0 4px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '13px',
            fontFamily: 'var(--font-primary)',
            fontWeight: 700,
            color: 'var(--ink-muted)'
          }}>
            BULLET JOURNAL VIEW
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowBinder(!showBinder)}
            className="hand-button"
            title="Toggle Leather Binder Border"
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Layers size={14} />
            <span>{showBinder ? 'Minimal View' : 'Leather Binder View'}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="hand-button"
            title="Toggle Dark Paper Mode"
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Notebook Spine Ribbon Top Decoration (matching photo) */}
      <div style={{ position: 'relative' }} className="page-flip-container">
        {/* Top Sticky Page Tabs (Like in the photo: NOV, HOME, DEC, STATS) */}
        <div className="tabs-header-bar no-print">
          <div
            className={`journal-tab tab-black ${activeTab === 'TRACKER' ? 'active' : ''}`}
            onClick={() => onTabChange('TRACKER')}
            title={`Current Month (${currentMonthName})`}
          >
            {currentMonthName}
          </div>

          <div
            className="journal-tab tab-purple"
            onClick={() => onTabChange('TRACKER')}
            title="Home Spread"
          >
            HOME
          </div>

          <div
            className="journal-tab tab-paper"
            onClick={() => onMonthSelect((month + 1) % 12)}
            title={`Next Month (${nextMonthName})`}
          >
            {nextMonthName}
          </div>

          <div
            className={`journal-tab tab-yellow ${activeTab === 'STATS' ? 'active' : ''}`}
            onClick={() => onTabChange(activeTab === 'STATS' ? 'TRACKER' : 'STATS')}
            title="Insights & Statistics"
          >
            STATS
          </div>
        </div>

        {/* Notebook Leather Binder Outer Wrap */}
        <div className={showBinder ? 'binder-leather' : ''}>
          {/* Bullet Grid Notebook Paper Page */}
          <div className="bullet-paper journal-book" style={{ padding: '16px 14px 18px 18px', position: 'relative' }}>
            {/* Washi Tape Strip along left edge */}
            {showBinder && <div className="washi-tape no-print" />}

            {/* Subtle Page Crease Down the Center for 2-page spread feel */}
            <div className="spine-crease no-print" />

            {/* Inner Content (Page flip animation commented out for later) */}
            {children}
            {/*
            <Notebook3DSpread
              currentKey={`${year}-${month}`}
              flipDirection={flipDirection || null}
              theme="classic"
            >
              {children}
            </Notebook3DSpread>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};
