'use client';

import React from 'react';
import { MONTH_NAMES } from '../lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Printer, 
  RotateCcw,
  BarChart2,
  BookOpen,
  Calendar
} from 'lucide-react';

interface JournalHeaderProps {
  year: number;
  month: number; // 0-11
  soundEnabled: boolean;
  activeView: 'TRACKER' | 'STATS' | 'SETTINGS';
  onMonthChange: (year: number, month: number) => void;
  onToggleSound: () => void;
  onOpenAddHabit: () => void;
  onLoadPhotoPreset: () => void;
  onResetMonth: () => void;
  onToggleView: (view: 'TRACKER' | 'STATS' | 'SETTINGS') => void;
  onJumpToToday?: () => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({
  year,
  month,
  soundEnabled,
  activeView,
  onMonthChange,
  onToggleSound,
  onOpenAddHabit,
  onLoadPhotoPreset,
  onResetMonth,
  onToggleView,
  onJumpToToday,
}) => {
  const monthName = MONTH_NAMES[month];

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '12px 14px 10px',
      borderBottom: '2px solid var(--ink-black)',
      marginBottom: '10px',
    }}>
      {/* Left: Handwritten Month & Year with subtle navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handlePrevMonth}
          className="no-print"
          title="Previous Month"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--ink-black)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <h1 style={{
          fontSize: 'clamp(22px, 3.8vw, 32px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
          fontFamily: 'var(--font-primary)',
          color: 'var(--ink-black)',
          lineHeight: 1,
          borderBottom: '2px dashed transparent',
          transition: 'border-color 0.2s',
        }}>
          {monthName} {year}
        </h1>

        <button
          onClick={handleNextMonth}
          className="no-print"
          title="Next Month"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--ink-black)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Middle: "TRACKING." Box (Matching the photo's iconic boxed heading) */}
      <div style={{
        position: 'relative',
        padding: '3px 18px 2px 14px',
        border: '2px solid var(--ink-black)',
        fontWeight: 700,
        fontSize: 'clamp(15px, 2.5vw, 19px)',
        letterSpacing: '0.14em',
        fontFamily: 'var(--font-primary)',
        boxShadow: '3px -3px 0px var(--ink-black), 3px 0px 0px var(--ink-black)',
        backgroundColor: 'var(--paper-card)',
        transform: 'rotate(-0.5deg)',
      }}>
        TRACKING.
      </div>

      {/* Right: Quick Action Controls */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
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
          title="Toggle Habit & Metric Analytics"
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
          onClick={onLoadPhotoPreset}
          className="hand-button"
          title="Load exact replica data from the reference photo"
          style={{ background: '#fef08a' }}
        >
          <Sparkles size={15} color="#854d0e" />
          <span style={{ color: '#854d0e' }}>Photo Demo</span>
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
  );
};
