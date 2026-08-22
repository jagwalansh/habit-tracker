'use client';

import React from 'react';
import { Habit } from '../lib/types';
import { DayInfo, playPenSound } from '../lib/utils';
import { MountainArtwork } from './MountainArtwork';
import confetti from 'canvas-confetti';
import { Trash2 } from 'lucide-react';

interface CrosshatchHabitGridProps {
  days: DayInfo[];
  habits: Habit[];
  completions: Record<string, Record<number, boolean>>;
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, dayNumber: number) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const CrosshatchHabitGrid: React.FC<CrosshatchHabitGridProps> = ({
  days,
  habits,
  completions,
  soundEnabled,
  onToggleHabit,
  onDeleteHabit,
}) => {
  const handleCellClick = (habitId: string, dayNumber: number) => {
    if (soundEnabled) {
      playPenSound('scribble');
    }

    const willBeChecked = !(completions[habitId]?.[dayNumber]);
    if (willBeChecked) {
      let count = 0;
      habits.forEach(h => {
        if (h.id === habitId || completions[h.id]?.[dayNumber]) {
          count++;
        }
      });

      if (count === habits.length && habits.length > 2) {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#556b2f', '#cba273', '#1a1a1a', '#eab308']
        });
      }
    }

    onToggleHabit(habitId, dayNumber);
  };

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Top Banner Row: Mini Mountain + Kraft "Habits tracker:" Ribbon */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '2px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          <MountainArtwork variant="mini" />
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="habit-matrix-table" style={{ border: '2px solid var(--ink-black)' }}>
          <thead>
            {/* Header Row: Kraft Day Banner */}
            <tr style={{ backgroundColor: '#cba273', borderBottom: '2px solid var(--ink-black)' }}>
              <th className="habit-name-col sticky-habit-col" style={{
                backgroundColor: '#cba273',
                color: '#23170a',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                fontSize: '14px',
                borderRight: '2px solid var(--ink-black)',
                padding: '4px 8px',
              }}>
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>
                  Habits tracker:
                </span>
              </th>

              {days.map((day) => (
                <th
                  key={`alp-hd-${day.dayNumber}`}
                  style={{
                    height: '24px',
                    minWidth: '22px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 700,
                    color: '#23170a',
                    borderRight: '1px solid #23170a',
                    backgroundColor: day.isToday 
                      ? 'rgba(136, 19, 55, 0.25)' 
                      : (day.isWeekend ? 'rgba(0,0,0,0.1)' : 'transparent'),
                  }}
                  title={day.isToday ? "Today's Date" : undefined}
                >
                  {day.isToday ? (
                    <span className="today-kraft-marker" title="Today">
                      {day.dayNumber}
                    </span>
                  ) : (
                    day.dayNumber
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => {
              const habitCompletions = completions[habit.id] || {};
              const highlightColor = habit.color || '#fef08a';

              return (
                <tr key={habit.id} style={{ borderBottom: '1px solid var(--ink-black)' }}>
                  {/* Habit Name Column with Pastel Marker Underline */}
                  <td className="habit-name-col sticky-habit-col" style={{
                    borderRight: '2px solid var(--ink-black)',
                    padding: '4px 6px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      width: '100%',
                      gap: '4px',
                    }}>
                      {/* Pastel Highlighter Streak under text */}
                      <span style={{
                        position: 'relative',
                        zIndex: 2,
                        textTransform: 'uppercase',
                        fontSize: habit.name.length > 9 ? '11.5px' : habit.name.length > 7 ? '12.5px' : '13px',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        lineHeight: 1.1,
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {habit.name}
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: '1px',
                            height: '6px',
                            backgroundColor: highlightColor,
                            opacity: 0.65,
                            zIndex: -1,
                            borderRadius: '1px',
                          }}
                        />
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
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
                      >
                        <Trash2 size={13} color="#991b1b" />
                      </button>
                    </div>
                  </td>

                  {/* Day Check Cells with Diagonal Crosshatching */}
                  {days.map((day) => {
                    const isChecked = !!habitCompletions[day.dayNumber];

                    return (
                      <td
                        key={`${habit.id}-${day.dayNumber}`}
                        className={`day-cell ${isChecked ? 'crosshatch-filled' : ''} ${day.isToday ? 'is-today-column' : ''}`}
                        onClick={() => handleCellClick(habit.id, day.dayNumber)}
                        title={day.isToday ? `Today (Day ${day.dayNumber}) - ${habit.name}` : `Day ${day.dayNumber} - ${habit.name}`}
                        style={{
                          height: '24px',
                          minWidth: '22px',
                          borderRight: '1px solid var(--ink-black)',
                          backgroundColor: isChecked 
                            ? undefined 
                            : (day.isToday ? 'rgba(234, 179, 8, 0.15)' : (day.isWeekend ? 'rgba(0, 0, 0, 0.025)' : 'transparent')),
                          cursor: 'pointer',
                        }}
                      >
                        {/* The diagonal fineliner crosshatch pattern is rendered via CSS */}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
