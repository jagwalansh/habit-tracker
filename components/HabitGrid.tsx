'use client';

import React from 'react';
import { Habit } from '../lib/types';
import { DayInfo, playPenSound } from '../lib/utils';
import confetti from 'canvas-confetti';
import { Trash2 } from 'lucide-react';

interface HabitGridProps {
  days: DayInfo[];
  habits: Habit[];
  completions: Record<string, Record<number, boolean>>;
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, dayNumber: number) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({
  days,
  habits,
  completions,
  soundEnabled,
  onToggleHabit,
  onDeleteHabit,
}) => {
  const spineDayThreshold = Math.ceil(days.length / 2); // e.g. 13 or 15 for booklet split

  const handleCellClick = (habitId: string, dayNumber: number) => {
    if (soundEnabled) {
      playPenSound('dot');
    }
    
    // Check if this action completes all habits for this day
    const willBeChecked = !(completions[habitId]?.[dayNumber]);
    if (willBeChecked) {
      let completedCount = 0;
      habits.forEach(h => {
        if (h.id === habitId || completions[h.id]?.[dayNumber]) {
          completedCount++;
        }
      });

      // If all habits are checked for the day, trigger subtle confetti celebration
      if (completedCount === habits.length && habits.length > 2) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#e11d48', '#1a1a1a', '#eab308']
        });
      }
    }

    onToggleHabit(habitId, dayNumber);
  };

  return (
    <div className="table-scroll-container">
      <table className="habit-matrix-table">
        <thead>
          {/* Row 1: Day of Week Initials (S M T W T F S) */}
          <tr>
            <th className="habit-name-col sticky-habit-col" style={{ borderBottom: '1px solid var(--ink-black)' }}>
              {/* Empty upper-left corner */}
            </th>
            {days.map((day) => {
              const isSpineSplit = day.dayNumber === spineDayThreshold;
              const isWeekEnd = day.dayOfWeekIndex === 6;
              const dividerClass = isSpineSplit 
                ? 'spine-divider-right' 
                : (isWeekEnd ? 'week-divider-right' : '');

              return (
                <th
                  key={`dow-${day.dayNumber}`}
                  className={`day-header-dow ${dividerClass}`}
                  style={{
                    backgroundColor: day.isWeekend ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                  }}
                >
                  {day.dayOfWeekLetter}
                </th>
              );
            })}
          </tr>

          {/* Row 2: Day Numbers (1 2 3 ... 30) */}
          <tr style={{ borderBottom: '2px solid var(--ink-black)' }}>
            <th className="habit-name-col sticky-habit-col" style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              HABITS
            </th>
            {days.map((day) => {
              const isSpineSplit = day.dayNumber === spineDayThreshold;
              const isWeekEnd = day.dayOfWeekIndex === 6;
              const dividerClass = isSpineSplit 
                ? 'spine-divider-right' 
                : (isWeekEnd ? 'week-divider-right' : '');

              return (
                <th
                  key={`num-${day.dayNumber}`}
                  className={`day-header-num ${dividerClass} ${day.isToday ? 'is-today-column' : ''}`}
                  style={{
                    backgroundColor: day.isToday ? 'rgba(234, 179, 8, 0.25)' : (day.isWeekend ? 'rgba(0, 0, 0, 0.03)' : 'transparent'),
                  }}
                  title={day.isToday ? "Today's Date" : undefined}
                >
                  {day.isToday ? (
                    <span className="today-circle-marker" title="Today">
                      {day.dayNumber}
                    </span>
                  ) : (
                    day.dayNumber
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => {
            const habitCompletions = completions[habit.id] || {};

            return (
              <tr key={habit.id}>
                {/* Habit Name Column */}
                <td className="habit-name-col sticky-habit-col" title={habit.name}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: '4px',
                  }}>
                    <span style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontFamily: 'var(--font-primary)',
                      fontSize: habit.name.length > 9 ? '11.5px' : habit.name.length > 7 ? '12.5px' : '13.5px',
                      lineHeight: 1.1,
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {habit.name}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove "${habit.name}" habit?`)) {
                          onDeleteHabit(habit.id);
                        }
                      }}
                      className="no-print"
                      title="Delete habit"
                      style={{
                        flexShrink: 0,
                        opacity: 0.45,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'opacity 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
                    >
                      <Trash2 size={13} color="#991b1b" />
                    </button>
                  </div>
                </td>

                {/* Day Check Cells */}
                {days.map((day) => {
                  const isChecked = !!habitCompletions[day.dayNumber];
                  const isSpineSplit = day.dayNumber === spineDayThreshold;
                  const isWeekEnd = day.dayOfWeekIndex === 6;
                  const dividerClass = isSpineSplit 
                    ? 'spine-divider-right' 
                    : (isWeekEnd ? 'week-divider-right' : '');

                  return (
                    <td
                      key={`${habit.id}-${day.dayNumber}`}
                      className={`day-cell ${dividerClass} ${day.isToday ? 'is-today-column' : ''}`}
                      onClick={() => handleCellClick(habit.id, day.dayNumber)}
                      style={{
                        backgroundColor: day.isToday 
                          ? 'rgba(234, 179, 8, 0.12)' 
                          : (day.isWeekend ? 'rgba(0, 0, 0, 0.02)' : 'transparent'),
                      }}
                      title={day.isToday ? `Today (Day ${day.dayNumber})` : undefined}
                    >
                      <span className={`ink-dot ${isChecked ? 'filled' : ''}`} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
