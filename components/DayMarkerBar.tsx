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
      <table className="habit-matrix-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr className="highlights-row" style={{ borderTop: '1.5px solid var(--ink-black)', borderBottom: '1.5px solid var(--ink-black)' }}>
            <td
              className="habit-name-col sticky-habit-col"
              style={{
                fontSize: '11px',
                color: 'var(--ink-muted)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                height: '24px',
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
        </tbody>
      </table>
    </div>
  );
};
