'use client';

import React from 'react';
import { MONTH_NAMES } from '../lib/utils';
import { MountainArtwork } from './MountainArtwork';
import { KraftMiniCalendar } from './KraftMiniCalendar';
import { Notebook3DSpread } from './Notebook3DSpread';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Volume2, VolumeX, Printer, RotateCcw, BarChart2, BookOpen, Calendar } from 'lucide-react';

interface AlpineSpiralBookProps {
  year: number;
  month: number;
  soundEnabled: boolean;
  activeView: 'TRACKER' | 'STATS' | 'SETTINGS';
  flipDirection?: 'forward' | 'backward' | null;
  onMonthChange: (year: number, month: number) => void;
  onToggleSound: () => void;
  onOpenAddHabit: () => void;
  onLoadAlpinePreset: () => void;
  onResetMonth: () => void;
  onToggleView: (view: 'TRACKER' | 'STATS' | 'SETTINGS') => void;
  onJumpToToday?: () => void;
  children: React.ReactNode;
  topChartSlot?: React.ReactNode;
}

export const AlpineSpiralBook: React.FC<AlpineSpiralBookProps> = ({
  year,
  month,
  soundEnabled,
  activeView,
  flipDirection,
  onMonthChange,
  onToggleSound,
  onOpenAddHabit,
  onLoadAlpinePreset,
  onResetMonth,
  onToggleView,
  onJumpToToday,
  children,
  topChartSlot,
}) => {
  const monthName = MONTH_NAMES[month];

  const handlePrevMonth = () => {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  };

  return (
    <div className="journal-wrapper" style={{ position: 'relative' }}>
      {/* Top Floating Controls Bar */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '13px',
            fontFamily: 'var(--font-primary)',
            fontWeight: 700,
            color: 'var(--ink-muted)'
          }}>
            ALPINE WIRE-O SPIRAL SPREAD
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onJumpToToday && (
            <button
              onClick={onJumpToToday}
              className="hand-button"
              title="Jump to Current Month & Date"
            >
              <Calendar size={15} />
              <span>Today</span>
            </button>
          )}

          <button
            onClick={() => onToggleView(activeView === 'STATS' ? 'TRACKER' : 'STATS')}
            className={`hand-button ${activeView === 'STATS' ? 'primary' : ''}`}
            title="Toggle Analytics"
          >
            {activeView === 'STATS' ? <BookOpen size={15} /> : <BarChart2 size={15} />}
            <span>{activeView === 'STATS' ? 'Journal' : 'Stats'}</span>
          </button>

          <button
            onClick={onOpenAddHabit}
            className="hand-button"
            title="Add New Habit"
          >
            <Plus size={15} />
            <span>Add Habit</span>
          </button>

          <button
            onClick={onLoadAlpinePreset}
            className="hand-button"
            title="Load exact replica data from the Alpine reference photo"
            style={{ background: '#fef08a' }}
          >
            <Sparkles size={15} color="#854d0e" />
            <span style={{ color: '#854d0e' }}>Alpine Photo Demo</span>
          </button>

          <button
            onClick={onToggleSound}
            className="hand-button"
            title={soundEnabled ? 'Mute Pen Audio' : 'Enable Pen Audio'}
            style={{ padding: '6px 8px' }}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={() => window.print()}
            className="hand-button"
            title="Print Journal Spread"
            style={{ padding: '6px 8px' }}
          >
            <Printer size={15} />
          </button>

          <button
            onClick={onResetMonth}
            className="hand-button danger"
            title="Clear Month Completions & Scores for Fresh Data"
            style={{ padding: '6px 10px' }}
          >
            <RotateCcw size={15} />
            <span>Reset Month</span>
          </button>
        </div>
      </div>

      {/* Main Spiral Notebook Card Container */}
      <div style={{ position: 'relative' }} className="page-flip-container">
        {/* Paper Page */}
        <div className="bullet-paper" style={{
          padding: '24px 20px 32px 20px',
          borderRadius: '4px 4px 6px 6px',
          border: '1.8px solid var(--ink-black)',
          boxShadow: '0 25px 50px -12px rgba(45, 30, 20, 0.3), 0 0 0 1px rgba(0,0,0,0.06)',
          position: 'relative'
        }}>
          {/* Top Row: Brush Lettered Month Name + Mountain Range Artwork */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottom: '2px solid var(--ink-black)',
            paddingBottom: '4px',
            marginBottom: '12px',
          }}>
            {/* Brush Script Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px' }}>
              <button
                onClick={handlePrevMonth}
                className="no-print"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <ChevronLeft size={18} />
              </button>

              <h1 style={{
                fontFamily: 'var(--font-brush)',
                fontSize: 'clamp(42px, 6.5vw, 64px)',
                lineHeight: 0.9,
                fontWeight: 400,
                color: 'var(--ink-black)',
                letterSpacing: '0.02em',
                userSelect: 'none',
              }}>
                {monthName.toLowerCase()}
              </h1>

              <button
                onClick={handleNextMonth}
                className="no-print"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Hand-sketched Mountain Illustration */}
            <div style={{ flex: 1, maxWidth: '680px' }}>
              <MountainArtwork variant="top" />
            </div>
          </div>

          {activeView === 'TRACKER' ? (
            <>
              {/* Upper Section: Kraft Mini Calendar (Left) + Sleep/Energy Graph (Right) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(110px, 120px) 1fr',
                gap: '14px',
                alignItems: 'start',
                marginBottom: '10px',
              }}>
                <div style={{ paddingTop: '8px' }}>
                  <KraftMiniCalendar year={year} month={month} />
                </div>
                <div>
                  {topChartSlot}
                </div>
              </div>

              {/* Lower Section: Crosshatch Habit Tracker */}
              {children}
            </>
          ) : (
            children
          )}
        </div>

        {/* Bottom Wire Spiral Binding (Rings looping through paper) */}
        <div className="spiral-bottom-container no-print">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={`ring-${i}`} className="spiral-ring">
              <div className="spiral-hole" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
