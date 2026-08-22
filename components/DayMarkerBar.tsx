'use client';

import React from 'react';
import { DayInfo } from '../lib/utils';

interface DayMarkerBarProps {
  days: DayInfo[];
  annotations: Record<number, string>;
  onToggleAnnotation: (dayNumber: number) => void;
  onOpenDayDetail?: (dayNumber: number) => void;
}

export const DayMarkerBar: React.FC<DayMarkerBarProps> = ({
  days,
  annotations,
  onToggleAnnotation,
}) => {
  const spineDayThreshold = Math.ceil(days.length / 2);

  return (
    <div className="table-scroll-container" style={{ margin: '4px 0 6px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1.5px solid var(--ink-black)',
        borderBottom: '1.5px solid var(--ink-black)',
        minWidth: '100%',
        backgroundColor: 'rgba(0,0,0,0.015)'
      }}>
        {/* Align with Habit Name column */}
        <div className="sticky-habit-col" style={{
          width: '110px',
          minWidth: '110px',
          paddingLeft: '8px',
          fontSize: '11px',
          color: 'var(--ink-muted)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          height: '24px',
          borderRight: '1px solid var(--ink-black)',
        }}>
          HIGHLIGHTS
        </div>

        {/* Day Annotation Cells */}
        <div style={{ display: 'flex', flex: 1 }}>
          {days.map((day) => {
            const hasHeart = annotations[day.dayNumber] === 'heart';
            const isSpineSplit = day.dayNumber === spineDayThreshold;
            const isWeekEnd = day.dayOfWeekIndex === 6;

            return (
              <div
                key={`annot-${day.dayNumber}`}
                onClick={() => onToggleAnnotation(day.dayNumber)}
                title={`Toggle heart/highlight for day ${day.dayNumber}`}
                style={{
                  flex: 1,
                  minWidth: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRight: isSpineSplit 
                    ? '3px double var(--ink-black)' 
                    : (isWeekEnd ? '2.5px solid var(--ink-black)' : '1px solid var(--ink-black)'),
                  backgroundColor: day.isWeekend ? 'rgba(0,0,0,0.02)' : 'transparent',
                }}
              >
                {hasHeart && (
                  <span className="heart-marker active" style={{ fontSize: '14px', lineHeight: 1 }}>
                    ♡
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
