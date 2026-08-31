'use client';

import React, { useState } from 'react';
import { Habit } from '../lib/types';
import { DayInfo, playPenSound } from '../lib/utils';
import confetti from 'canvas-confetti';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface HabitGridProps {
  days: DayInfo[];
  habits: Habit[];
  completions: Record<string, Record<number, boolean>>;
  annotations?: Record<number, string>;
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, dayNumber: number) => void;
  onDeleteHabit: (habitId: string) => void;
  onRenameHabit: (habitId: string, newName: string) => void;
  onToggleAnnotation?: (dayNumber: number) => void;
}

interface HabitRowProps {
  habit: Habit;
  days: DayInfo[];
  habitCompletions: Record<number, boolean>;
  spineDayThreshold: number;
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, dayNumber: number) => void;
  onDeleteHabit: (habitId: string) => void;
  onRenameHabit: (habitId: string, newName: string) => void;
  handleCellClick: (habitId: string, dayNumber: number) => void;
}

const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  days,
  habitCompletions,
  spineDayThreshold,
  soundEnabled,
  onToggleHabit,
  onDeleteHabit,
  onRenameHabit,
  handleCellClick,
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const startEditing = () => {
    setEditValue(habit.name);
    setEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim().toUpperCase();
    if (trimmed && trimmed !== habit.name) {
      onRenameHabit(habit.id, trimmed);
    }
    setEditing(false);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue('');
  };

  const getFontSize = (name: string) => {
    if (name.length > 14) return '11px';
    if (name.length > 9) return '12px';
    return '13px';
  };

  const fontSize = getFontSize(habit.name);

  return (
    <tr key={habit.id}>
      <td className="habit-name-col sticky-habit-col" title={habit.name}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '4px',
        }}>
          {editing ? (
            <input
              type="text"
              className="hand-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              onBlur={cancelEdit}
              autoFocus
              maxLength={20}
              style={{
                flex: 1,
                minWidth: 0,
                fontSize,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-primary)',
              }}
            />
          ) : (
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-primary)',
                fontSize,
                lineHeight: 1.15,
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
              onDoubleClick={startEditing}
            >
              {habit.name}
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {editing ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveEdit();
                  }}
                  className="no-print"
                  title="Save"
                  style={{
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#166534',
                  }}
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelEdit();
                  }}
                  className="no-print"
                  title="Cancel"
                  style={{
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#991b1b',
                  }}
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing();
                  }}
                  className="no-print"
                  title="Rename habit"
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
                  <Edit2 size={13} color="#1a1a1a" />
                </button>
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
              </>
            )}
          </div>
        </div>
      </td>

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
};

export const HabitGrid: React.FC<HabitGridProps> = ({
  days,
  habits,
  completions,
  annotations,
  soundEnabled,
  onToggleHabit,
  onDeleteHabit,
  onRenameHabit,
  onToggleAnnotation,
}) => {
  const spineDayThreshold = Math.ceil(days.length / 2);

  const handleCellClick = (habitId: string, dayNumber: number) => {
    if (soundEnabled) {
      playPenSound('dot');
    }

    const willBeChecked = !(completions[habitId]?.[dayNumber]);
    if (willBeChecked) {
      let completedCount = 0;
      habits.forEach(h => {
        if (h.id === habitId || completions[h.id]?.[dayNumber]) {
          completedCount++;
        }
      });

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
          <tr>
            <th className="habit-name-col sticky-habit-col" style={{ borderBottom: '1px solid var(--ink-black)' }} />
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
              <HabitRow
                key={habit.id}
                habit={habit}
                days={days}
                habitCompletions={habitCompletions}
                spineDayThreshold={spineDayThreshold}
                soundEnabled={soundEnabled}
                onToggleHabit={onToggleHabit}
                onDeleteHabit={onDeleteHabit}
                onRenameHabit={onRenameHabit}
                handleCellClick={handleCellClick}
              />
            );
          })}

          {annotations && onToggleAnnotation && (
            <tr className="highlights-row" style={{ borderTop: '2px solid var(--ink-black)' }}>
              <td
                className="habit-name-col sticky-habit-col"
                style={{
                  fontSize: '11px',
                  color: 'var(--ink-muted)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                HIGHLIGHTS
              </td>
              {days.map((day) => {
                const hasHeart = annotations[day.dayNumber] === 'heart';
                const isSpineSplit = day.dayNumber === spineDayThreshold;
                const isWeekEnd = day.dayOfWeekIndex === 6;
                const dividerClass = isSpineSplit
                  ? 'spine-divider-right'
                  : (isWeekEnd ? 'week-divider-right' : '');

                return (
                  <td
                    key={`annot-${day.dayNumber}`}
                    className={`day-cell ${dividerClass} ${day.isToday ? 'is-today-column' : ''}`}
                    onClick={() => onToggleAnnotation(day.dayNumber)}
                    title={`Toggle highlight for day ${day.dayNumber}`}
                    style={{
                      height: '24px',
                      cursor: 'pointer',
                      backgroundColor: day.isToday
                        ? 'rgba(234, 179, 8, 0.12)'
                        : (day.isWeekend ? 'rgba(0, 0, 0, 0.02)' : 'transparent'),
                    }}
                  >
                    {hasHeart && (
                      <span className="heart-marker active" style={{ fontSize: '14px', lineHeight: 1 }}>
                        ♡
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};