'use client';

import React, { useState } from 'react';
import { X, Check, Calendar, Sparkles } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  currentMonthName?: string;
  year?: number;
  onClose: () => void;
  onAddHabit: (name: string, scope: 'month' | 'year') => void;
}

const PRESET_IDEAS = [
  'MEDITATE', 'WORKOUT', 'WATER 2L', 'JOURNAL', 'STRETCH', 
  'NO SUGAR', 'WALK 8K', 'VITAMINS', 'READ 20P', 'STUDY'
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  currentMonthName,
  year,
  onClose,
  onAddHabit,
}) => {
  const [habitName, setHabitName] = useState('');
  const [scope, setScope] = useState<'month' | 'year'>('month');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    onAddHabit(habitName.trim().toUpperCase(), scope);
    setHabitName('');
    onClose();
  };

  const handleSelectPreset = (preset: string) => {
    onAddHabit(preset, scope);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--ink-black)',
          paddingBottom: '10px',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontFamily: 'var(--font-primary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Add New Habit
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-black)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              marginBottom: '6px'
            }}>
              HABIT NAME:
            </label>
            <input
              type="text"
              className="hand-input"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g. WORKOUT, MEDITATE, DRINK WATER"
              autoFocus
              maxLength={20}
            />
          </div>

          {/* Scope Selector: This Month vs Whole Year */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              marginBottom: '6px'
            }}>
              APPLY TO:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setScope('month')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-primary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '7px 12px',
                  border: '1.8px solid var(--ink-black)',
                  borderRadius: '3px',
                  backgroundColor: scope === 'month' ? 'var(--ink-black)' : 'var(--paper-warm)',
                  color: scope === 'month' ? '#ffffff' : 'var(--ink-black)',
                  boxShadow: scope === 'month' ? '2px 2px 0px var(--ink-black)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Calendar size={14} />
                <span>{currentMonthName ? `${currentMonthName} Only` : 'This Month Only'}</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('year')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-primary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '7px 12px',
                  border: '1.8px solid var(--ink-black)',
                  borderRadius: '3px',
                  backgroundColor: scope === 'year' ? 'var(--ink-black)' : 'var(--paper-warm)',
                  color: scope === 'year' ? '#ffffff' : 'var(--ink-black)',
                  boxShadow: scope === 'year' ? '2px 2px 0px var(--ink-black)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Sparkles size={14} color={scope === 'year' ? '#fde047' : '#854d0e'} />
                <span>Whole Year {year ? `(${year})` : '(All Months)'}</span>
              </button>
            </div>
          </div>

          {/* Quick preset suggestions */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              display: 'block',
              fontSize: '12px',
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-primary)',
              marginBottom: '8px'
            }}>
              OR PICK A QUICK HABIT:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESET_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => handleSelectPreset(idea)}
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    border: '1px solid var(--ink-black)',
                    borderRadius: '2px',
                    background: 'var(--paper-warm)',
                    cursor: 'pointer'
                  }}
                >
                  +{idea}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="hand-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!habitName.trim()}
              className="hand-button primary"
            >
              <Check size={16} />
              <span>Add to Journal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
