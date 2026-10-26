'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DayMetric } from '../lib/types';
import { DayInfo } from '../lib/utils';
import { Edit3 } from 'lucide-react';

interface MetricChartProps {
  days: DayInfo[];
  metrics: Record<number, DayMetric>;
  month?: number;
  onUpdateDayMetric: (dayNumber: number, field: 'mood' | 'stress' | 'sleep', value: number) => void;
  onOpenMetricModal: (dayNumber: number) => void;
}

export const MetricChart: React.FC<MetricChartProps> = ({
  days,
  metrics,
  month = 7,
  onUpdateDayMetric,
  onOpenMetricModal,
}) => {
  const [activePen, setActivePen] = useState<'all' | 'mood' | 'stress' | 'sleep'>('all');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredY, setHoveredY] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const numDays = days.length;
  const spineDayThreshold = Math.ceil(numDays / 2);

  // SVG coordinate dimensions
  const chartHeight = 220;
  const paddingTop = 18;
  const paddingBottom = 22;

  const minChartWidth = 130 + numDays * 26;
  const [chartWidth, setChartWidth] = useState<number>(() => Math.max(minChartWidth, 936));
  const [habitColWidth, setHabitColWidth] = useState<number>(130);
  const [dayPositions, setDayPositions] = useState<Record<number, number>>({});
  const [weekBounds, setWeekBounds] = useState<Record<number, number>>({});
  const [spineX, setSpineX] = useState<number | null>(null);

  const yLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  // Measure table DOM column positions to achieve pixel-perfect alignment
  const updateAlignment = useCallback(() => {
    if (!containerRef.current) return;
    const chartRect = containerRef.current.getBoundingClientRect();
    if (chartRect.width > 0) {
      setChartWidth(chartRect.width);
    }

    const table = document.getElementById('habit-matrix-table');
    if (!table) return;

    const nameCol = table.querySelector('.habit-name-col');
    if (nameCol) {
      const nameRect = nameCol.getBoundingClientRect();
      if (nameRect.width > 0) {
        setHabitColWidth(nameRect.width);
      }
    }

    const centers: Record<number, number> = {};
    const wBounds: Record<number, number> = {};
    let sX: number | null = null;

    days.forEach((d) => {
      const th = table.querySelector(`[data-day-col="${d.dayNumber}"]`);
      if (th) {
        const thRect = th.getBoundingClientRect();
        // Distance from chart's left edge to column center
        const center = thRect.left - chartRect.left + thRect.width / 2;
        centers[d.dayNumber] = center;

        if (d.dayOfWeekIndex === 6) {
          wBounds[d.dayNumber] = thRect.right - chartRect.left;
        }
        if (d.dayNumber === spineDayThreshold) {
          sX = thRect.right - chartRect.left;
        }
      }
    });

    if (Object.keys(centers).length > 0) {
      setDayPositions(centers);
    }
    if (Object.keys(wBounds).length > 0) {
      setWeekBounds(wBounds);
    }
    if (sX !== null) {
      setSpineX(sX);
    }
  }, [days, spineDayThreshold]);

  // Keep alignment synced on mount, resize, and DOM updates
  useEffect(() => {
    updateAlignment();
    const timer1 = setTimeout(updateAlignment, 50);
    const timer2 = setTimeout(updateAlignment, 200);

    const handleResize = () => {
      updateAlignment();
    };
    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => updateAlignment());
      ro.observe(containerRef.current);
      const table = document.getElementById('habit-matrix-table');
      if (table) ro.observe(table);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
    };
  }, [updateAlignment]);

  // Synchronize horizontal scrolling between habit grid and metric chart
  useEffect(() => {
    const chartScroll = scrollContainerRef.current;
    const gridScroll = document.getElementById('habit-grid-scroll-container');
    if (!chartScroll || !gridScroll) return;

    let isSyncingChart = false;
    let isSyncingGrid = false;

    const onGridScroll = () => {
      if (isSyncingGrid) return;
      isSyncingChart = true;
      chartScroll.scrollLeft = gridScroll.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingChart = false;
      });
    };

    const onChartScroll = () => {
      if (isSyncingChart) return;
      isSyncingGrid = true;
      gridScroll.scrollLeft = chartScroll.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingGrid = false;
      });
    };

    gridScroll.addEventListener('scroll', onGridScroll, { passive: true });
    chartScroll.addEventListener('scroll', onChartScroll, { passive: true });

    return () => {
      gridScroll.removeEventListener('scroll', onGridScroll);
      chartScroll.removeEventListener('scroll', onChartScroll);
    };
  }, []);

  // Helper to calculate X and Y coordinates
  const getColWidth = () => {
    const avail = chartWidth - habitColWidth;
    return avail / numDays;
  };

  const getDayX = (dayNumber: number) => {
    if (dayPositions[dayNumber] != null) {
      return dayPositions[dayNumber];
    }
    const colWidth = getColWidth();
    return habitColWidth + (dayNumber - 0.5) * colWidth;
  };

  const getSpineDividerX = () => {
    if (spineX != null) return spineX;
    const colWidth = getColWidth();
    return habitColWidth + spineDayThreshold * colWidth;
  };

  const getWeekDividerX = (dayNumber: number) => {
    if (weekBounds[dayNumber] != null) return weekBounds[dayNumber];
    const colWidth = getColWidth();
    return habitColWidth + dayNumber * colWidth;
  };

  const getY = (value: number) => {
    // 10 is at paddingTop, 1 is at chartHeight - paddingBottom
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    const normalized = (value - 1) / 9; // 0 to 1
    return (chartHeight - paddingBottom) - (normalized * availableHeight);
  };

  // Build SVG path string for a metric
  const buildPath = (metricKey: 'mood' | 'stress' | 'sleep') => {
    const points: { x: number; y: number; day: number; val: number }[] = [];

    days.forEach((d) => {
      const val = metrics[d.dayNumber]?.[metricKey];
      if (val != null && val >= 1 && val <= 10) {
        points.push({
          x: getDayX(d.dayNumber),
          y: getY(val),
          day: d.dayNumber,
          val,
        });
      }
    });

    if (points.length === 0) return { path: '', points: [] };

    let pathStr = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathStr += ` L ${points[i].x} ${points[i].y}`;
    }

    return { path: pathStr, points };
  };

  const moodData = buildPath('mood');
  const stressData = buildPath('stress');
  const sleepData = buildPath('sleep');

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked in left margin (Y-axis label area)
    if (clickX < habitColWidth - 10) {
      onOpenMetricModal(hoveredDay || 1);
      return;
    }

    // Find closest day
    let closestDay = 1;
    let minDistance = Infinity;
    days.forEach((d) => {
      const dX = getDayX(d.dayNumber);
      const dist = Math.abs(clickX - dX);
      if (dist < minDistance) {
        minDistance = dist;
        closestDay = d.dayNumber;
      }
    });

    // Calculate score 1-10 from clickY
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    const relativeY = (chartHeight - paddingBottom) - clickY;
    const rawVal = 1 + (relativeY / availableHeight) * 9;
    const roundedVal = Math.max(1, Math.min(10, Math.round(rawVal * 2) / 2)); // 0.5 step

    if (activePen === 'mood') {
      onUpdateDayMetric(closestDay, 'mood', roundedVal);
    } else if (activePen === 'stress') {
      onUpdateDayMetric(closestDay, 'stress', roundedVal);
    } else if (activePen === 'sleep') {
      onUpdateDayMetric(closestDay, 'sleep', roundedVal);
    } else {
      // If 'all' is active, open modal for full day score adjustment
      onOpenMetricModal(closestDay);
    }
  };

  return (
    <div style={{ position: 'relative', marginTop: '4px' }}>
      {/* Scrollable Container */}
      <div className="table-scroll-container" ref={scrollContainerRef} id="metric-chart-scroll-container">
        <div
          ref={containerRef}
          style={{
            minWidth: `${minChartWidth}px`,
            position: 'relative',
            backgroundColor: 'var(--paper-card)',
            border: '1.5px solid var(--ink-black)',
            borderRadius: '3px',
          }}
        >
          {/* SVG Canvas for Multi-line Chart */}
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            style={{ width: `${chartWidth}px`, height: `${chartHeight}px`, display: 'block', cursor: 'crosshair' }}
            onClick={handleSvgClick}
          >
            {/* Background Canvas */}
            <rect width={chartWidth} height={chartHeight} fill="var(--paper-card)" />

            {/* Today's Column Highlight - perfectly aligned with Today column in calendar above */}
            {days.map((d) => {
              if (!d.isToday) return null;
              const cW = getColWidth();
              const x = getDayX(d.dayNumber) - cW / 2;
              return (
                <rect
                  key="today-highlight-metric"
                  x={x}
                  y={paddingTop - 6}
                  width={cW}
                  height={chartHeight - paddingTop - paddingBottom + 12}
                  fill="rgba(234, 179, 8, 0.12)"
                />
              );
            })}

            {/* Y-Axis Guidelines & Numbers (10 to 1) */}
            {yLevels.map((lvl) => {
              const y = getY(lvl);
              return (
                <g key={`y-${lvl}`}>
                  {/* Dashed line extending across day columns */}
                  <line
                    x1={habitColWidth}
                    y1={y}
                    x2={chartWidth - 2}
                    y2={y}
                    stroke="var(--paper-dot)"
                    strokeWidth="0.8"
                    strokeDasharray="2,3"
                  />
                  {/* Number label right-aligned to baseline */}
                  <text
                    x={habitColWidth - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--ink-black)"
                    fontFamily="var(--font-primary)"
                    fontSize="13px"
                    fontWeight="700"
                  >
                    {lvl}
                  </text>
                  {/* Tick mark */}
                  <line
                    x1={habitColWidth - 4}
                    y1={y}
                    x2={habitColWidth}
                    y2={y}
                    stroke="var(--ink-black)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Y-Axis Baseline - exactly aligned with habit column separator */}
            <line
              x1={habitColWidth}
              y1={paddingTop - 6}
              x2={habitColWidth}
              y2={chartHeight - paddingBottom + 6}
              stroke="var(--ink-black)"
              strokeWidth="2"
            />

            {/* Left Margin Habit Column Decor (authentic bullet journal style) */}
            <g opacity="0.6">
              <text
                x={Math.max(14, (habitColWidth - 76) / 2)}
                y={paddingTop + 14}
                fill="var(--ink-muted)"
                fontFamily="var(--font-primary)"
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                DAILY
              </text>
              <text
                x={Math.max(14, (habitColWidth - 76) / 2)}
                y={paddingTop + 28}
                fill="var(--ink-muted)"
                fontFamily="var(--font-primary)"
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                SCORES
              </text>
              <text
                x={Math.max(14, (habitColWidth - 76) / 2)}
                y={chartHeight - paddingBottom - 4}
                fill="var(--ink-muted)"
                fontFamily="var(--font-primary)"
                fontSize="10px"
                fontWeight="600"
                letterSpacing="0.04em"
              >
                1 – 10
              </text>
            </g>

            {/* Vertical Week Dividers & Spine Crease */}
            {/* Spine Crease */}
            {(() => {
              const sX = getSpineDividerX();
              return (
                <g key="spine-crease-lines">
                  <line
                    x1={sX - 1.5}
                    y1={paddingTop - 6}
                    x2={sX - 1.5}
                    y2={chartHeight - paddingBottom + 6}
                    stroke="var(--ink-black)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <line
                    x1={sX + 1.5}
                    y1={paddingTop - 6}
                    x2={sX + 1.5}
                    y2={chartHeight - paddingBottom + 6}
                    stroke="var(--ink-black)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </g>
              );
            })()}

            {/* Week Dividers */}
            {days.map((d) => {
              if (d.dayOfWeekIndex !== 6 || d.dayNumber === numDays) return null;
              const wX = getWeekDividerX(d.dayNumber);
              return (
                <line
                  key={`week-${d.dayNumber}`}
                  x1={wX}
                  y1={paddingTop - 6}
                  x2={wX}
                  y2={chartHeight - paddingBottom + 6}
                  stroke="var(--paper-dot)"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Chart Lines with Ink Gel Pen Stroke Styling */}

            {/* MOOD Line (Cyan / Blue) */}
            {(activePen === 'all' || activePen === 'mood') && (
              <g>
                <path
                  d={moodData.path}
                  fill="none"
                  stroke="var(--ink-blue)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {moodData.points.map((pt) => {
                  const isHovered = hoveredDay === pt.day && hoveredY === pt.y;
                  return (
                    <circle
                      key={`mood-pt-${pt.day}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? 'var(--ink-blue)' : 'var(--paper-bg)'}
                      stroke="var(--ink-blue)"
                      strokeWidth={isHovered ? 2.5 : 2}
                      onMouseEnter={() => {
                        setHoveredDay(pt.day);
                        setHoveredY(pt.y);
                      }}
                      onMouseLeave={() => {
                        setHoveredDay(null);
                        setHoveredY(null);
                      }}
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    />
                  );
                })}
              </g>
            )}

            {/* STRESS Line (Pink / Magenta) */}
            {(activePen === 'all' || activePen === 'stress') && (
              <g>
                <path
                  d={stressData.path}
                  fill="none"
                  stroke="var(--ink-pink)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {stressData.points.map((pt) => {
                  const isHovered = hoveredDay === pt.day && hoveredY === pt.y;
                  return (
                    <circle
                      key={`stress-pt-${pt.day}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? 'var(--ink-pink)' : 'var(--paper-bg)'}
                      stroke="var(--ink-pink)"
                      strokeWidth={isHovered ? 2.5 : 2}
                      onMouseEnter={() => {
                        setHoveredDay(pt.day);
                        setHoveredY(pt.y);
                      }}
                      onMouseLeave={() => {
                        setHoveredDay(null);
                        setHoveredY(null);
                      }}
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    />
                  );
                })}
              </g>
            )}

            {/* SLEEP Line (Navy / Indigo) */}
            {(activePen === 'all' || activePen === 'sleep') && (
              <g>
                <path
                  d={sleepData.path}
                  fill="none"
                  stroke="var(--ink-navy)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {sleepData.points.map((pt) => {
                  const isHovered = hoveredDay === pt.day && hoveredY === pt.y;
                  return (
                    <circle
                      key={`sleep-pt-${pt.day}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? 'var(--ink-navy)' : 'var(--paper-bg)'}
                      stroke="var(--ink-navy)"
                      strokeWidth={isHovered ? 2.5 : 2}
                      onMouseEnter={() => {
                        setHoveredDay(pt.day);
                        setHoveredY(pt.y);
                      }}
                      onMouseLeave={() => {
                        setHoveredDay(null);
                        setHoveredY(null);
                      }}
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    />
                  );
                })}
              </g>
            )}

            {/* Hovered Day Indicator Column (Vertical) */}
            {hoveredDay && (
              <line
                x1={getDayX(hoveredDay)}
                y1={paddingTop - 6}
                x2={getDayX(hoveredDay)}
                y2={chartHeight - paddingBottom + 6}
                stroke="var(--ink-black)"
                strokeWidth="1.2"
                strokeDasharray="2,2"
                opacity="0.5"
              />
            )}

            {/* Hovered Indicator Row (Horizontal) */}
            {hoveredY !== null && (
              <line
                x1={habitColWidth}
                y1={hoveredY}
                x2={chartWidth - 2}
                y2={hoveredY}
                stroke="var(--ink-black)"
                strokeWidth="1.2"
                strokeDasharray="2,2"
                opacity="0.55"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Footer Legend & Handwritten Labels */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px 4px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Handwritten Inks Legend (Clickable to isolate pen or click to draw) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePen(activePen === 'mood' ? 'all' : 'mood')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-primary)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--ink-blue)',
              opacity: activePen === 'all' || activePen === 'mood' ? 1 : 0.4,
              borderBottom: activePen === 'mood' ? '2px solid var(--ink-blue)' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 0 }}>•</span>
            <span>MOOD</span>
          </button>

          <button
            onClick={() => setActivePen(activePen === 'stress' ? 'all' : 'stress')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-primary)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--ink-pink)',
              opacity: activePen === 'all' || activePen === 'stress' ? 1 : 0.4,
              borderBottom: activePen === 'stress' ? '2px solid var(--ink-pink)' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 0 }}>•</span>
            <span>STRESS</span>
          </button>

          <button
            onClick={() => setActivePen(activePen === 'sleep' ? 'all' : 'sleep')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-primary)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--ink-navy)',
              opacity: activePen === 'all' || activePen === 'sleep' ? 1 : 0.4,
              borderBottom: activePen === 'sleep' ? '2px solid var(--ink-navy)' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 0 }}>•</span>
            <span>SLEEP</span>
          </button>

          <button
            onClick={() => onOpenMetricModal(hoveredDay || 1)}
            className="no-print hand-button"
            style={{ fontSize: '12px', padding: '3px 8px' }}
          >
            <Edit3 size={12} />
            <span>Log Daily Scores</span>
          </button>
        </div>

        {/* Bottom Right Handwritten Month Number */}
        <div style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--ink-black)',
          paddingRight: '6px',
          userSelect: 'none',
        }}>
          {month + 1}
        </div>
      </div>
    </div>
  );
};
