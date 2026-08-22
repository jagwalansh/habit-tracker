'use client';

import React, { useState } from 'react';
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

  const numDays = days.length;
  const spineDayThreshold = Math.ceil(numDays / 2);

  // SVG coordinate dimensions
  const chartHeight = 220;
  const paddingLeft = 32;
  const paddingRight = 14;
  const paddingTop = 18;
  const paddingBottom = 22;

  const yLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  // Helper to calculate X and Y coordinates
  const getX = (dayNumber: number, totalWidth: number) => {
    const availableWidth = totalWidth - paddingLeft - paddingRight;
    const colWidth = availableWidth / numDays;
    return paddingLeft + (dayNumber - 0.5) * colWidth;
  };

  const getY = (value: number) => {
    // 10 is at paddingTop, 1 is at chartHeight - paddingBottom
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    const normalized = (value - 1) / 9; // 0 to 1
    return (chartHeight - paddingBottom) - (normalized * availableHeight);
  };

  // Build SVG path string for a metric
  const buildPath = (metricKey: 'mood' | 'stress' | 'sleep', totalWidth: number) => {
    const points: { x: number; y: number; day: number; val: number }[] = [];

    days.forEach((d) => {
      const val = metrics[d.dayNumber]?.[metricKey];
      if (val != null && val >= 1 && val <= 10) {
        points.push({
          x: getX(d.dayNumber, totalWidth),
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

  // Reference SVG viewBox width
  const svgWidth = Math.max(760, numDays * 28 + paddingLeft + paddingRight);

  const moodData = buildPath('mood', svgWidth);
  const stressData = buildPath('stress', svgWidth);
  const sleepData = buildPath('sleep', svgWidth);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const clickY = ((e.clientY - rect.top) / rect.height) * chartHeight;

    // Find closest day
    const availableWidth = svgWidth - paddingLeft - paddingRight;
    const colWidth = availableWidth / numDays;
    const relativeX = clickX - paddingLeft;
    const dayIndex = Math.floor(relativeX / colWidth);
    const dayNumber = Math.max(1, Math.min(numDays, dayIndex + 1));

    // Calculate score 1-10 from clickY
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    const relativeY = (chartHeight - paddingBottom) - clickY;
    const rawVal = 1 + (relativeY / availableHeight) * 9;
    const roundedVal = Math.max(1, Math.min(10, Math.round(rawVal * 2) / 2)); // 0.5 step

    if (activePen === 'mood') {
      onUpdateDayMetric(dayNumber, 'mood', roundedVal);
    } else if (activePen === 'stress') {
      onUpdateDayMetric(dayNumber, 'stress', roundedVal);
    } else if (activePen === 'sleep') {
      onUpdateDayMetric(dayNumber, 'sleep', roundedVal);
    } else {
      // If 'all' is active, open modal for full day score adjustment
      onOpenMetricModal(dayNumber);
    }
  };

  return (
    <div style={{ position: 'relative', marginTop: '4px' }}>
      {/* Scrollable Container */}
      <div className="table-scroll-container">
        <div style={{
          minWidth: `${svgWidth}px`,
          position: 'relative',
          backgroundColor: 'var(--paper-card)',
          border: '1.5px solid var(--ink-black)',
          borderRadius: '3px',
        }}>
          {/* SVG Canvas for Multi-line Chart */}
          <svg
            viewBox={`0 0 ${svgWidth} ${chartHeight}`}
            style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
            onClick={handleSvgClick}
          >
            {/* Background Dot Grid inside SVG */}
            <defs>
              <pattern id="chartDots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="var(--paper-dot)" />
              </pattern>
            </defs>
            <rect width={svgWidth} height={chartHeight} fill="var(--paper-card)" />
            <rect width={svgWidth} height={chartHeight} fill="url(#chartDots)" />

            {/* Y-Axis Guidelines & Numbers (10 to 1) */}
            {yLevels.map((lvl) => {
              const y = getY(lvl);
              return (
                <g key={`y-${lvl}`}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="var(--paper-dot)"
                    strokeWidth="0.8"
                    strokeDasharray="2,3"
                  />
                  <text
                    x={paddingLeft - 8}
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
                    x1={paddingLeft - 4}
                    y1={y}
                    x2={paddingLeft}
                    y2={y}
                    stroke="var(--ink-black)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Y-Axis Baseline */}
            <line
              x1={paddingLeft}
              y1={paddingTop - 6}
              x2={paddingLeft}
              y2={chartHeight - paddingBottom + 6}
              stroke="var(--ink-black)"
              strokeWidth="2"
            />

            {/* Vertical Week Dividers & Spine Crease */}
            {days.map((d) => {
              const x = getX(d.dayNumber, svgWidth);
              const isSpine = d.dayNumber === spineDayThreshold;
              const isWeekEnd = d.dayOfWeekIndex === 6;

              if (isSpine) {
                return (
                  <g key={`spine-${d.dayNumber}`}>
                    <line
                      x1={x + 10}
                      y1={paddingTop}
                      x2={x + 10}
                      y2={chartHeight - paddingBottom}
                      stroke="var(--ink-black)"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                    <line
                      x1={x + 13}
                      y1={paddingTop}
                      x2={x + 13}
                      y2={chartHeight - paddingBottom}
                      stroke="var(--ink-black)"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </g>
                );
              }

              if (isWeekEnd) {
                return (
                  <line
                    key={`week-${d.dayNumber}`}
                    x1={x + 12}
                    y1={paddingTop}
                    x2={x + 12}
                    y2={chartHeight - paddingBottom}
                    stroke="var(--paper-dot)"
                    strokeWidth="1.2"
                    strokeDasharray="4,4"
                  />
                );
              }

              return null;
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
                x1={getX(hoveredDay, svgWidth)}
                y1={paddingTop}
                x2={getX(hoveredDay, svgWidth)}
                y2={chartHeight - paddingBottom}
                stroke="var(--ink-black)"
                strokeWidth="1.2"
                strokeDasharray="2,2"
                opacity="0.5"
              />
            )}

            {/* Hovered Indicator Row (Horizontal) */}
            {hoveredY !== null && (
              <line
                x1={paddingLeft}
                y1={hoveredY}
                x2={svgWidth - paddingRight}
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
