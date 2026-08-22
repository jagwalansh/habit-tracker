'use client';

import React from 'react';
import { MonthData } from '../lib/types';
import { calculateJournalStats, MONTH_NAMES } from '../lib/utils';
import { Flame, CheckCircle, Award, TrendingUp, Moon, Smile, Zap } from 'lucide-react';

interface InsightsDrawerProps {
  data: MonthData;
  onClose: () => void;
}

export const InsightsDrawer: React.FC<InsightsDrawerProps> = ({
  data,
  onClose,
}) => {
  const stats = calculateJournalStats(data);
  const monthName = MONTH_NAMES[data.month];

  // Best performing habit
  const sortedHabits = [...stats.habitStats].sort((a, b) => b.completionRate - a.completionRate);
  const topHabit = sortedHabits[0];

  return (
    <div style={{
      backgroundColor: 'var(--paper-card)',
      border: '2px solid var(--ink-black)',
      borderRadius: '4px',
      padding: '20px 24px',
      marginTop: '16px',
      boxShadow: '4px 4px 0px var(--ink-black)',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px dashed var(--ink-black)',
        paddingBottom: '12px',
        marginBottom: '16px'
      }}>
        <h2 style={{
          fontSize: '22px',
          fontFamily: 'var(--font-primary)',
          fontWeight: 700,
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Award size={22} />
          <span>{monthName} {data.year} JOURNAL INSIGHTS</span>
        </h2>

        <button onClick={onClose} className="hand-button" style={{ fontSize: '12px', padding: '4px 10px' }}>
          Back to Journal
        </button>
      </div>

      {/* Top Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Total Completion Rate */}
        <div style={{
          border: '1.5px solid var(--ink-black)',
          padding: '12px',
          borderRadius: '3px',
          backgroundColor: 'var(--paper-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)' }}>
            <CheckCircle size={15} />
            <span>OVERALL CONSISTENCY</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>
            {stats.overallRate}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            {stats.totalCompletions} out of {stats.totalOpportunities} habit slots
          </div>
        </div>

        {/* Top Habit */}
        <div style={{
          border: '1.5px solid var(--ink-black)',
          padding: '12px',
          borderRadius: '3px',
          backgroundColor: 'var(--paper-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)' }}>
            <Flame size={15} color="#e11d48" />
            <span>TOP HABIT</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase' }}>
            {topHabit?.name || 'N/A'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            {topHabit ? `${topHabit.completionRate}% completion (${topHabit.maxStreak} day max streak)` : '-'}
          </div>
        </div>

        {/* Average Mood */}
        <div style={{
          border: '1.5px solid var(--ink-black)',
          padding: '12px',
          borderRadius: '3px',
          backgroundColor: 'var(--paper-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-blue)' }}>
            <Smile size={15} />
            <span>AVG MOOD</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px', color: 'var(--ink-blue)' }}>
            {stats.averages.mood} / 10
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            Stress Avg: {stats.averages.stress} / 10
          </div>
        </div>

        {/* Average Sleep */}
        <div style={{
          border: '1.5px solid var(--ink-black)',
          padding: '12px',
          borderRadius: '3px',
          backgroundColor: 'var(--paper-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-navy)' }}>
            <Moon size={15} />
            <span>AVG SLEEP</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px', color: 'var(--ink-navy)' }}>
            {stats.averages.sleep} / 10
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            Daily restorative sleep
          </div>
        </div>
      </div>

      {/* Habit Breakdown Table */}
      <h3 style={{
        fontSize: '16px',
        fontFamily: 'var(--font-primary)',
        fontWeight: 700,
        marginBottom: '10px',
        textTransform: 'uppercase'
      }}>
        Habit Consistency & Streak Breakdown
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--ink-black)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>HABIT</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>DAYS CHECKED</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>COMPLETION %</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>CURRENT STREAK</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>LONGEST STREAK</th>
            </tr>
          </thead>
          <tbody>
            {stats.habitStats.map((h) => (
              <tr key={h.id} style={{ borderBottom: '1px dashed var(--paper-dot)' }}>
                <td style={{ padding: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {h.name}
                </td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  {h.completedDays}
                </td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{
                      width: '60px',
                      height: '8px',
                      backgroundColor: 'var(--paper-dot)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${h.completionRate}%`,
                        height: '100%',
                        backgroundColor: 'var(--ink-black)'
                      }} />
                    </div>
                    <span>{h.completionRate}%</span>
                  </div>
                </td>
                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>
                  {h.currentStreak > 0 ? `🔥 ${h.currentStreak}d` : '-'}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>
                  {h.maxStreak > 0 ? `⚡ ${h.maxStreak}d` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Habit Correlation Tip */}
      <div style={{
        marginTop: '18px',
        padding: '12px 16px',
        border: '1.5px dashed var(--ink-black)',
        borderRadius: '3px',
        backgroundColor: 'var(--paper-warm)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <TrendingUp size={20} color="var(--ink-blue)" />
        <span style={{ fontSize: '13px' }}>
          <strong>Journal Insight:</strong> Consistent sleep (7.5+ scores) corresponds with higher habit execution rates and noticeably lowered stress readings.
        </span>
      </div>
    </div>
  );
};
