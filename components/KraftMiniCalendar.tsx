'use client';

import React from 'react';
import { MONTH_NAMES } from '../lib/utils';

interface KraftMiniCalendarProps {
  year: number;
  month: number;
}

export const KraftMiniCalendar: React.FC<KraftMiniCalendarProps> = ({ year, month }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  
  // Sunday-first week layout (S M T W Th F Sa)
  const sundayFirstOffset = firstDayOfWeek; // already 0 = Sun

  const dayHeaders = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

  const cells: (number | null)[] = [];
  for (let i = 0; i < sundayFirstOffset; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
  const todayDate = now.getDate();

  return (
    <div
      className="kraft-paper"
      style={{
        width: '100%',
        maxWidth: '120px',
        padding: '6px 8px 8px',
        borderRadius: '3px',
        fontFamily: 'var(--font-primary)',
        boxShadow: '2px 3px 6px rgba(0,0,0,0.25)',
        transform: 'rotate(-1deg)',
        userSelect: 'none',
      }}
    >
      {/* Header Days of Week */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        fontSize: '11px',
        fontWeight: 700,
        borderBottom: '1px solid #785226',
        paddingBottom: '3px',
        marginBottom: '4px',
        color: '#2a1a08'
      }}>
        {dayHeaders.map((dh, i) => (
          <span key={`dh-${i}`} style={{ color: (i === 0 || i === 6) ? '#881337' : 'inherit' }}>
            {dh}
          </span>
        ))}
      </div>

      {/* Grid of Days */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        textAlign: 'center',
        fontSize: '10px',
        fontWeight: 700,
        lineHeight: 1.3,
        color: '#2a1a08'
      }}>
        {cells.map((dayNum, i) => {
          const isToday = isCurrentMonth && dayNum === todayDate;
          return (
            <div
              key={`k-cell-${i}`}
              style={{
                padding: '1px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: dayNum ? ((i % 7 === 0 || i % 7 === 6) ? '#881337' : '#1c1307') : 'transparent'
              }}
            >
              {dayNum ? (
                isToday ? (
                  <span className="today-calendar-circle" title="Today">
                    {dayNum}
                  </span>
                ) : (
                  dayNum
                )
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
