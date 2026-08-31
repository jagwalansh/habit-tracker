'use client';

import React, { useState } from 'react';
import { Habit } from '../lib/types';
import { DayInfo, playPenSound } from '../lib/utils';
import { MountainArtwork } from './MountainArtwork';
import confetti from 'canvas-confetti';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface CrosshatchHabitGridProps {
  days: DayInfo[];
  habits: Habit[];
  completions: Record<string, Record<number, boolean>>;
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, dayNumber: number) => void;
  onDeleteHabit: (habitId: string) => void;
  onRenameHabit: (habitId: string, newName: string) => void;
}

interface CrosshatchHabitRowProps {
  habit: Habit;
  days: DayInfo[];
  habitCompletions: Record<number, boolean>;
  soundEnabled: boolean;
  onToggleHabit: (habitId: string, dayNumber: number) => void;
  onDeleteHabit: (habitId: string) => void;
  onRenameHabit: (habitId: string, newName: string) => void;
  handleCellClick: (habitId: string, dayNumber: number) => void;
}

const CrosshatchHabitRow: React.FC<CrosshatchHabitRowProps> = ({
  habit,
  days,
  habitCompletions,
  soundEnabled,
  onToggleHabit,
  onDeleteHabit,
  onRenameHabit,
  handleCellClick,
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const highlightColor = habit.color || '#fef08a';

  const getFontSize = (name: string) => {
    if (name.length > 9) return '11.5px';
    if (name.length > 7) return '12.5px';
    return '13px';
  };

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

  const fontSize = getFontSize(habit.name);

  return (
    <tr key={habit.id} style={{ borderBottom: '1px solid var(--ink-black)' }}>
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
                fontWeight: 700,
                letterSpacing: '0.03em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-primary)',
              }}
            />
          ) : (
            <span
              style={{
                position: 'relative',
                zIndex: 2,
                textTransform: 'uppercase',
                fontSize,
                fontWeight: 700,
                letterSpacing: '0.03em',
                lineHeight: 1.1,
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
                  <Edit2 size={13} color="#23170a" />
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
                    transition: 'opacity 0.15s',
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
          </td>
        );
      })}
    </tr>
  );
};

export const CrosshatchHabitGrid: React.FC<CrosshatchHabitGridProps> = ({
  days,
  habits,
  completions,
  soundEnabled,
  onToggleHabit,
  onDeleteHabit,
  onRenameHabit,
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

              return (
                <CrosshatchHabitRow
                  key={habit.id}
                  habit={habit}
                  days={days}
                  habitCompletions={habitCompletions}
                  soundEnabled={soundEnabled}
                  onToggleHabit={onToggleHabit}
                  onDeleteHabit={onDeleteHabit}
                  onRenameHabit={onRenameHabit}
                  handleCellClick={handleCellClick}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};