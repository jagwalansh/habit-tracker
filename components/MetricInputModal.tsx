'use client';

import React, { useState, useEffect } from 'react';
import { DayMetric } from '../lib/types';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface MetricInputModalProps {
  isOpen: boolean;
  dayNumber: number;
  maxDays: number;
  currentMetric?: DayMetric;
  onClose: () => void;
  onSave: (dayNumber: number, metric: DayMetric) => void;
  onNavigateDay: (dayNumber: number) => void;
}

export const MetricInputModal: React.FC<MetricInputModalProps> = ({
  isOpen,
  dayNumber,
  maxDays,
  currentMetric,
  onClose,
  onSave,
  onNavigateDay,
}) => {
  const [mood, setMood] = useState<number>(currentMetric?.mood ?? 7);
  const [stress, setStress] = useState<number>(currentMetric?.stress ?? 5);
  const [sleep, setSleep] = useState<number>(currentMetric?.sleep ?? 7.5);
  const [notes, setNotes] = useState<string>(currentMetric?.notes ?? '');

  useEffect(() => {
    setMood(currentMetric?.mood ?? 7);
    setStress(currentMetric?.stress ?? 5);
    setSleep(currentMetric?.sleep ?? 7.5);
    setNotes(currentMetric?.notes ?? '');
  }, [currentMetric, dayNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dayNumber, { mood, stress, sleep, notes });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header with Day navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--ink-black)',
          paddingBottom: '10px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              disabled={dayNumber <= 1}
              onClick={() => onNavigateDay(dayNumber - 1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: dayNumber <= 1 ? 'not-allowed' : 'pointer',
                opacity: dayNumber <= 1 ? 0.3 : 1
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <h2 style={{
              fontSize: '20px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              DAY {dayNumber} LOG
            </h2>

            <button
              type="button"
              disabled={dayNumber >= maxDays}
              onClick={() => onNavigateDay(dayNumber + 1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: dayNumber >= maxDays ? 'not-allowed' : 'pointer',
                opacity: dayNumber >= maxDays ? 0.3 : 1
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

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
          {/* Mood Slider */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: 'var(--ink-blue)',
                fontSize: '15px'
              }}>
                • MOOD / EMOTION: {mood}/10
              </label>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)', fontWeight: 700 }}>
                {mood >= 8 ? ':D Ecstatic' : mood >= 6 ? ':) Happy' : mood >= 4 ? ':| Neutral' : ':( Down'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={mood}
              onChange={(e) => setMood(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ink-blue)', cursor: 'pointer' }}
            />
          </div>

          {/* Stress Slider */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: 'var(--ink-pink)',
                fontSize: '15px'
              }}>
                • STRESS: {stress}/10
              </label>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                {stress >= 8 ? '🔥 High' : stress >= 4 ? '⚡ Moderate' : '🌿 Calm'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={stress}
              onChange={(e) => setStress(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ink-pink)', cursor: 'pointer' }}
            />
          </div>

          {/* Sleep Slider */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: 'var(--ink-navy)',
                fontSize: '15px'
              }}>
                • SLEEP: {sleep}/10
              </label>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                {sleep >= 8 ? '💤 Well Rested' : sleep >= 5 ? '😴 Decent' : '🥱 Fatigued'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ink-navy)', cursor: 'pointer' }}
            />
          </div>

          {/* Day Note */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              fontSize: '13px',
              marginBottom: '4px'
            }}>
              DAILY NOTE / HIGHLIGHT:
            </label>
            <input
              type="text"
              className="hand-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed chapter 4, great walk in the morning..."
              maxLength={120}
            />
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
              className="hand-button primary"
            >
              <Check size={16} />
              <span>Save Day {dayNumber}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
