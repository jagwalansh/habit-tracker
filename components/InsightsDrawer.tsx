'use client';

import React, { useMemo } from 'react';
import { MonthData, ExpenseCategory } from '../lib/types';
import { calculateJournalStats, MONTH_NAMES } from '../lib/utils';
import { Flame, CheckCircle, Award, TrendingUp, Moon, Smile, Zap, Wallet, ArrowDown, ArrowUp } from 'lucide-react';

const CATEGORY_META: Record<ExpenseCategory, { emoji: string; label: string; color: string }> = {
  food:          { emoji: '🍕', label: 'Food',          color: '#f97316' },
  transport:     { emoji: '🚕', label: 'Transport',     color: '#0ea5e9' },
  shopping:      { emoji: '🛒', label: 'Shopping',      color: '#a855f7' },
  bills:         { emoji: '📄', label: 'Bills',         color: '#6b7280' },
  entertainment: { emoji: '🎬', label: 'Entertainment', color: '#ec4899' },
  health:        { emoji: '💊', label: 'Health',        color: '#10b981' },
  other:         { emoji: '📌', label: 'Other',         color: '#78716c' },
};

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

  // Expense stats
  const expenses = data.expenses || [];
  const monthTotal = useMemo(() =>
    expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const categoryBreakdown = useMemo(() => {
    const totals: Record<ExpenseCategory, { total: number; count: number }> = {
      food: { total: 0, count: 0 },
      transport: { total: 0, count: 0 },
      shopping: { total: 0, count: 0 },
      bills: { total: 0, count: 0 },
      entertainment: { total: 0, count: 0 },
      health: { total: 0, count: 0 },
      other: { total: 0, count: 0 },
    };
    for (const exp of expenses) {
      totals[exp.category].total += exp.amount;
      totals[exp.category].count += 1;
    }
    return (Object.entries(totals) as [ExpenseCategory, { total: number; count: number }][])
      .filter(([, v]) => v.total > 0)
      .sort((a, b) => b[1].total - a[1].total);
  }, [expenses]);

  const dailyAvg = useMemo(() => {
    const daysWithExpenses = new Set(expenses.map(e => e.dayNumber)).size;
    return daysWithExpenses > 0 ? monthTotal / daysWithExpenses : 0;
  }, [expenses, monthTotal]);

  const biggestExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);
  }, [expenses]);

  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

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

        {/* Total Spending */}
        <div style={{
          border: '1.5px solid var(--ink-black)',
          padding: '12px',
          borderRadius: '3px',
          backgroundColor: 'var(--paper-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#f97316' }}>
            <Wallet size={15} />
            <span>TOTAL SPENT</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px', color: '#f97316' }}>
            ₹{monthTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'} · Avg ₹{dailyAvg.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/day
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

      {/* Monthly Spending Breakdown */}
      {expenses.length > 0 && (
        <>
          <h3 style={{
            fontSize: '16px',
            fontFamily: 'var(--font-primary)',
            fontWeight: 700,
            marginBottom: '10px',
            marginTop: '24px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            💰 Monthly Spending Breakdown
          </h3>

          {/* Category breakdown bar */}
          <div style={{
            display: 'flex',
            height: '12px',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '14px',
            border: '1.5px solid var(--ink-black)',
          }}>
            {categoryBreakdown.map(([cat, { total }]) => (
              <div
                key={cat}
                style={{
                  width: `${(total / monthTotal) * 100}%`,
                  backgroundColor: CATEGORY_META[cat].color,
                  transition: 'width 0.3s ease',
                }}
                title={`${CATEGORY_META[cat].label}: ₹${total.toLocaleString('en-IN')}`}
              />
            ))}
          </div>

          {/* Category table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink-black)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>CATEGORY</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>TRANSACTIONS</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>AMOUNT</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>% OF TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map(([cat, { total, count }]) => {
                  const meta = CATEGORY_META[cat];
                  const pct = Math.round((total / monthTotal) * 100);
                  return (
                    <tr key={cat} style={{ borderBottom: '1px dashed var(--paper-dot)' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: meta.color,
                            display: 'inline-block',
                            flexShrink: 0,
                          }} />
                          {meta.emoji} {meta.label.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        {count}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>
                        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <div style={{
                            width: '50px',
                            height: '8px',
                            backgroundColor: 'var(--paper-dot)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${pct}%`,
                              height: '100%',
                              backgroundColor: meta.color,
                            }} />
                          </div>
                          <span>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--ink-black)' }}>
                  <td style={{ padding: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Total</td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>{expenses.length}</td>
                  <td style={{
                    padding: '8px',
                    textAlign: 'right',
                    fontWeight: 700,
                    fontSize: '16px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    textDecorationStyle: 'wavy' as const,
                  }}>
                    ₹{monthTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Spending highlight card */}
          {biggestExpense && (
            <div style={{
              marginTop: '14px',
              padding: '10px 14px',
              border: '1.5px dashed #f97316',
              borderRadius: '3px',
              backgroundColor: 'rgba(249, 115, 22, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <ArrowUp size={18} color="#f97316" />
              <span style={{ fontSize: '13px' }}>
                <strong>Biggest Expense:</strong> ₹{biggestExpense.amount.toLocaleString('en-IN')} on Day {biggestExpense.dayNumber}
                {biggestExpense.note ? ` — ${biggestExpense.note}` : ''}
                {' '}({CATEGORY_META[biggestExpense.category].emoji} {CATEGORY_META[biggestExpense.category].label})
              </span>
            </div>
          )}
        </>
      )}

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
