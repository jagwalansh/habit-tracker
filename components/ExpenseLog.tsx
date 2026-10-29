'use client';

import React, { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '../lib/types';
import { DayInfo } from '../lib/utils';
import { Plus, ChevronDown, ChevronRight, Edit3, Trash2 } from 'lucide-react';

const CATEGORY_META: Record<ExpenseCategory, { emoji: string; label: string; color: string }> = {
  food:          { emoji: '🍕', label: 'Food',          color: '#f97316' },
  transport:     { emoji: '🚕', label: 'Transport',     color: '#0ea5e9' },
  shopping:      { emoji: '🛒', label: 'Shopping',      color: '#a855f7' },
  bills:         { emoji: '📄', label: 'Bills',         color: '#6b7280' },
  entertainment: { emoji: '🎬', label: 'Entertainment', color: '#ec4899' },
  health:        { emoji: '💊', label: 'Health',        color: '#10b981' },
  other:         { emoji: '📌', label: 'Other',         color: '#78716c' },
};

const DOW_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface ExpenseLogProps {
  days: DayInfo[];
  expenses: Expense[];
  year: number;
  month: number;
  theme: 'classic' | 'alpine';
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseLog: React.FC<ExpenseLogProps> = ({
  days,
  expenses,
  year,
  month,
  theme,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});

  // Group expenses by day
  const groupedByDay = useMemo(() => {
    const groups: Record<number, Expense[]> = {};
    for (const exp of expenses) {
      if (!groups[exp.dayNumber]) groups[exp.dayNumber] = [];
      groups[exp.dayNumber].push(exp);
    }
    // Sort each group by creation time
    for (const dayNum of Object.keys(groups)) {
      groups[Number(dayNum)].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return groups;
  }, [expenses]);

  // Sorted day numbers (descending — most recent first)
  const sortedDayNumbers = useMemo(() => {
    return Object.keys(groupedByDay)
      .map(Number)
      .sort((a, b) => b - a);
  }, [groupedByDay]);

  // Category breakdown for the month
  const categoryTotals = useMemo(() => {
    const totals: Record<ExpenseCategory, number> = {
      food: 0, transport: 0, shopping: 0, bills: 0,
      entertainment: 0, health: 0, other: 0,
    };
    for (const exp of expenses) {
      totals[exp.category] += exp.amount;
    }
    return totals;
  }, [expenses]);

  const monthTotal = useMemo(() =>
    expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const toggleDay = (dayNum: number) => {
    setCollapsedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const getDayLabel = (dayNumber: number) => {
    const dayInfo = days.find(d => d.dayNumber === dayNumber);
    if (!dayInfo) return `Day ${dayNumber}`;
    return `${DOW_NAMES[dayInfo.dayOfWeekIndex]}, ${dayNumber}`;
  };

  const getDayTotal = (dayNumber: number) => {
    return (groupedByDay[dayNumber] || []).reduce((sum, e) => sum + e.amount, 0);
  };

  const isAlpine = theme === 'alpine';

  // Category breakdown bar segments
  const nonZeroCategories = useMemo(() => {
    return (Object.entries(categoryTotals) as [ExpenseCategory, number][])
      .filter(([, total]) => total > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [categoryTotals]);

  return (
    <div style={{
      position: 'relative',
      marginTop: '16px',
    }}>
      {/* Section Header */}
      <div style={{
        border: isAlpine ? '1.5px solid var(--kraft-border, var(--ink-black))' : '1.5px solid var(--ink-black)',
        borderRadius: '3px',
        backgroundColor: isAlpine ? 'var(--kraft-bg)' : 'var(--paper-card)',
        overflow: 'hidden',
      }}>
        {/* Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: `1.5px ${isAlpine ? 'dashed' : 'solid'} var(--ink-black)`,
          backgroundColor: isAlpine ? 'var(--kraft-dark)' : 'rgba(0, 0, 0, 0.03)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>💰</span>
            <h3 style={{
              fontSize: '15px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
              color: isAlpine ? 'var(--kraft-text)' : 'var(--ink-black)',
            }}>
              Daily Expenses
            </h3>
            {monthTotal > 0 && (
              <span style={{
                fontSize: '14px',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                color: isAlpine ? 'var(--kraft-text)' : 'var(--ink-muted)',
                opacity: 0.8,
              }}>
                — ₹{monthTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <button
            className="hand-button"
            onClick={onAddExpense}
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              backgroundColor: isAlpine ? '#c89e6c' : undefined,
            }}
          >
            <Plus size={13} />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '0',
          backgroundColor: isAlpine ? '#d4b083' : 'var(--paper-card)',
        }}>
          {sortedDayNumbers.length === 0 ? (
            /* Empty state */
            <div style={{
              padding: '28px 20px',
              textAlign: 'center',
              color: 'var(--ink-faint)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>📝</div>
              <p style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '14px',
                fontWeight: 600,
                margin: 0,
              }}>
                No expenses logged yet
              </p>
              <p style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '12px',
                marginTop: '4px',
                opacity: 0.7,
              }}>
                Click &quot;Add Expense&quot; to start tracking your spending
              </p>
            </div>
          ) : (
            <>
              {/* Day-grouped expense list */}
              {sortedDayNumbers.map((dayNum, idx) => {
                const dayExpenses = groupedByDay[dayNum];
                const isCollapsed = collapsedDays[dayNum];
                const dayTotal = getDayTotal(dayNum);
                const dayInfo = days.find(d => d.dayNumber === dayNum);
                const isToday = dayInfo?.isToday;

                return (
                  <div key={dayNum} style={{
                    borderBottom: idx < sortedDayNumbers.length - 1
                      ? '1px dashed var(--paper-dot)' : 'none',
                  }}>
                    {/* Day header row */}
                    <div
                      onClick={() => toggleDay(dayNum)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        backgroundColor: isToday
                          ? 'rgba(234, 179, 8, 0.12)'
                          : 'transparent',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isToday) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isToday) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isCollapsed
                          ? <ChevronRight size={14} color="var(--ink-muted)" />
                          : <ChevronDown size={14} color="var(--ink-muted)" />
                        }
                        <span style={{
                          fontFamily: 'var(--font-primary)',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: isToday ? 'var(--ink-pink)' : 'var(--ink-black)',
                        }}>
                          {getDayLabel(dayNum)}
                          {isToday && <span style={{ fontSize: '11px', marginLeft: '6px', opacity: 0.7 }}>TODAY</span>}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-primary)',
                          fontSize: '11px',
                          color: 'var(--ink-faint)',
                        }}>
                          ({dayExpenses.length} {dayExpenses.length === 1 ? 'entry' : 'entries'})
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--ink-black)',
                      }}>
                        ₹{dayTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Expanded expense entries */}
                    {!isCollapsed && (
                      <div style={{ padding: '0 14px 8px 34px' }}>
                        {dayExpenses.map((exp) => {
                          const meta = CATEGORY_META[exp.category];
                          return (
                            <div
                              key={exp.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5px 0',
                                borderBottom: '1px dotted var(--paper-dot)',
                                gap: '8px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                {/* Category pill */}
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '11px',
                                  fontFamily: 'var(--font-primary)',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  backgroundColor: `${meta.color}18`,
                                  border: `1px solid ${meta.color}40`,
                                  color: meta.color,
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0,
                                }}>
                                  {meta.emoji} {meta.label.toUpperCase()}
                                </span>
                                {/* Note */}
                                {exp.note && (
                                  <span style={{
                                    fontSize: '13px',
                                    fontFamily: 'var(--font-primary)',
                                    color: 'var(--ink-muted)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {exp.note}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <span style={{
                                  fontFamily: 'var(--font-primary)',
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  color: 'var(--ink-black)',
                                }}>
                                  ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </span>

                                {/* Edit/Delete buttons */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditExpense(exp);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    color: 'var(--ink-faint)',
                                    transition: 'color 0.1s ease',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-blue)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-faint)')}
                                  title="Edit expense"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteExpense(exp.id);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    color: 'var(--ink-faint)',
                                    transition: 'color 0.1s ease',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-pink)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-faint)')}
                                  title="Delete expense"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Category Breakdown Footer */}
              {nonZeroCategories.length > 0 && (
                <div style={{
                  borderTop: '1.5px solid var(--ink-black)',
                  padding: '12px 14px',
                  backgroundColor: isAlpine ? 'rgba(0,0,0,0.04)' : 'rgba(0, 0, 0, 0.02)',
                }}>
                  {/* Breakdown bar */}
                  <div style={{
                    display: 'flex',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    border: '1px solid var(--paper-dot)',
                  }}>
                    {nonZeroCategories.map(([cat, total]) => (
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

                  {/* Category labels */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px 14px',
                  }}>
                    {nonZeroCategories.map(([cat, total]) => {
                      const meta = CATEGORY_META[cat];
                      const pct = Math.round((total / monthTotal) * 100);
                      return (
                        <span
                          key={cat}
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 700,
                            color: 'var(--ink-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: meta.color,
                            display: 'inline-block',
                            flexShrink: 0,
                          }} />
                          {meta.emoji} {meta.label}
                          <span style={{ color: 'var(--ink-faint)' }}>
                            ₹{total.toLocaleString('en-IN')} ({pct}%)
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Grand Total */}
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '2px solid var(--ink-black)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-primary)',
                      fontSize: '14px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      Month Total
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-primary)',
                      fontSize: '18px',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      textDecorationStyle: 'wavy',
                    }}>
                      ₹{monthTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

