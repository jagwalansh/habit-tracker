'use client';

import React, { useState } from 'react';
import { DayInfo } from '../lib/utils';
import { DayMetric } from '../lib/types';

interface SleepIntervalChartProps {
  days: DayInfo[];
  metrics: Record<number, DayMetric>;
  onOpenMetricModal: (dayNumber: number) => void;
  onUpdateDayMetric: (dayNumber: number, field: 'mood' | 'stress' | 'sleep' | 'energy' | 'sleepStart' | 'sleepEnd', value: number) => void;
}

export const SleepIntervalChart: React.FC<SleepIntervalChartProps> = ({
  days,
  metrics,
  onOpenMetricModal,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredY, setHoveredY] = useState<number | null>(null);

  const numDays = days.length;
  const chartHeight = 290;
  const paddingLeft = 44;
  const paddingRight = 14;

  const svgWidth = Math.max(760, numDays * 24 + paddingLeft + paddingRight);
  const colWidth = (svgWidth - paddingLeft - paddingRight) / numDays;

  const getX = (dayNumber: number) => {
    return paddingLeft + (dayNumber - 0.5) * colWidth;
  };

  // ---- TOP SECTION: Emotion faces (:D :) :| :() ----
  // Score 1–10 mapped to y 108 down to y 48
  const emotionTop = 48;
  const emotionBottom = 108;
  const getEmotionY = (score: number) => {
    const norm = (score - 1) / 9;
    return emotionBottom - norm * (emotionBottom - emotionTop);
  };

  // ---- BOTTOM SECTION: 0–10 numeric scale ----
  // 10 at y=135, 0 at y=275
  const numericTop = 135;   // y for score 10
  const numericBottom = 275; // y for score 0
  const getSleepY = (score: number) => {
    const norm = (score - 0) / 10;
    return numericBottom - norm * (numericBottom - numericTop);
  };

  // Build mood/energy line (top section)
  const energyPoints: { x: number; y: number; day: number; val: number }[] = [];
  days.forEach((d) => {
    const val = metrics[d.dayNumber]?.energy ?? metrics[d.dayNumber]?.mood;
    if (val != null) {
      energyPoints.push({
        x: getX(d.dayNumber),
        y: getEmotionY(val),
        day: d.dayNumber,
        val,
      });
    }
  });

  let energyPathStr = '';
  if (energyPoints.length > 0) {
    energyPathStr = `M ${energyPoints[0].x} ${energyPoints[0].y}`;
    for (let i = 1; i < energyPoints.length; i++) {
      energyPathStr += ` L ${energyPoints[i].x} ${energyPoints[i].y}`;
    }
  }

  // Build sleep line (bottom section) — connected line using sleep score 0–10
  const sleepPoints: { x: number; y: number; day: number; val: number }[] = [];
  days.forEach((d) => {
    const m = metrics[d.dayNumber];
    // Use the sleep field directly (0–10 score), or compute from sleepEnd-sleepStart hours
    let val = m?.sleep;
    if (val == null && m?.sleepStart != null && m?.sleepEnd != null) {
      // Convert hours slept to a 0–10 score (8h = 10, 0h = 0)
      let hours = m.sleepEnd - m.sleepStart;
      if (hours < 0) hours += 24; // past midnight
      val = Math.min(10, Math.max(0, (hours / 8) * 10));
    }
    if (val != null) {
      sleepPoints.push({
        x: getX(d.dayNumber),
        y: getSleepY(val),
        day: d.dayNumber,
        val,
      });
    }
  });

  let sleepPathStr = '';
  if (sleepPoints.length > 0) {
    sleepPathStr = `M ${sleepPoints[0].x} ${sleepPoints[0].y}`;
    for (let i = 1; i < sleepPoints.length; i++) {
      sleepPathStr += ` L ${sleepPoints[i].x} ${sleepPoints[i].y}`;
    }
  }

  return (
    <div className="table-scroll-container" style={{ margin: '6px 0 10px' }}>
      <div style={{
        minWidth: `${svgWidth}px`,
        position: 'relative',
        backgroundColor: 'var(--paper-card)',
        border: '1.5px solid var(--ink-black)',
        borderRadius: '3px',
      }}>
        {/* SVG Drawing Canvas */}
        <svg
          viewBox={`0 0 ${svgWidth} ${chartHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
          onClick={() => onOpenMetricModal(hoveredDay || 1)}
        >
          {/* Background Canvas */}
          <rect width={svgWidth} height={chartHeight} fill="var(--paper-card)" />

          {/* ======= DAY NUMBERS ROW (kraft ribbon inside SVG) ======= */}
          <rect
            x={paddingLeft}
            y={0}
            width={svgWidth - paddingLeft - paddingRight}
            height={28}
            fill="#cba273"
            stroke="#23170a"
            strokeWidth="1.5"
          />
          {days.map((d) => {
            const x = getX(d.dayNumber);
            return (
              <g key={`day-label-${d.dayNumber}`}>
                {d.isToday && (
                  <rect
                    x={x - colWidth / 2}
                    y={0}
                    width={colWidth}
                    height={28}
                    fill="rgba(136, 19, 55, 0.25)"
                  />
                )}
                {d.isWeekend && !d.isToday && (
                  <rect
                    x={x - colWidth / 2}
                    y={0}
                    width={colWidth}
                    height={28}
                    fill="rgba(0,0,0,0.08)"
                  />
                )}
                {d.dayNumber < numDays && (
                  <line
                    x1={x + colWidth / 2}
                    y1={0}
                    x2={x + colWidth / 2}
                    y2={28}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="1"
                  />
                )}
                <text
                  x={x}
                  y={18}
                  textAnchor="middle"
                  fill="#23170a"
                  fontFamily="var(--font-primary)"
                  fontSize="11px"
                  fontWeight="700"
                >
                  {d.dayNumber}
                </text>
              </g>
            );
          })}

          {/* ======= TOP SECTION: EMOTION FACES (:D, :), :|, :() ======= */}
          {/* :D (Big Joy) — score 10 → y 48 */}
          <g>
            <text x={paddingLeft - 12} y={52} textAnchor="end" fill="var(--ink-black)" fontFamily="var(--font-primary)" fontSize="16px" fontWeight="700" letterSpacing="0.05em">:D</text>
            <line x1={paddingLeft - 5} y1={48} x2={paddingLeft} y2={48} stroke="var(--ink-black)" strokeWidth="1.2" />
          </g>

          {/* :) (Happy) — score ~7 → y 68 */}
          <g>
            <text x={paddingLeft - 12} y={72} textAnchor="end" fill="var(--ink-black)" fontFamily="var(--font-primary)" fontSize="16px" fontWeight="700">:)</text>
            <line x1={paddingLeft - 5} y1={68} x2={paddingLeft} y2={68} stroke="var(--ink-black)" strokeWidth="1.2" />
          </g>

          {/* :| (Neutral) — score ~4 → y 88 */}
          <g>
            <text x={paddingLeft - 12} y={92} textAnchor="end" fill="var(--ink-black)" fontFamily="var(--font-primary)" fontSize="16px" fontWeight="700">:|</text>
            <line x1={paddingLeft - 5} y1={88} x2={paddingLeft} y2={88} stroke="var(--ink-black)" strokeWidth="1.2" />
            {/* Horizontal dashed guideline at neutral */}
            <line x1={paddingLeft} y1={88} x2={svgWidth - paddingRight} y2={88} stroke="var(--paper-dot)" strokeWidth="0.9" strokeDasharray="4,4" />
          </g>

          {/* :( (Sad) — score 1 → y 108 */}
          <g>
            <text x={paddingLeft - 12} y={112} textAnchor="end" fill="var(--ink-black)" fontFamily="var(--font-primary)" fontSize="16px" fontWeight="700">:(</text>
            <line x1={paddingLeft - 5} y1={108} x2={paddingLeft} y2={108} stroke="var(--ink-black)" strokeWidth="1.2" />
          </g>

          {/* Separator between Emotions & Numeric Y-axis */}
          <line x1={paddingLeft - 8} y1={122} x2={svgWidth - paddingRight} y2={122} stroke="var(--paper-dot)" strokeWidth="0.8" strokeDasharray="2,3" />

          {/* ======= BOTTOM SECTION: 0–10 SCALE ======= */}
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((num) => {
            const y = getSleepY(num);
            return (
              <g key={`y-num-${num}`}>
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--ink-black)"
                  fontFamily="var(--font-primary)"
                  fontSize="12px"
                  fontWeight="700"
                >
                  {num}
                </text>
                <line x1={paddingLeft - 4} y1={y} x2={paddingLeft} y2={y} stroke="var(--ink-black)" strokeWidth="1.2" />
                {/* Light horizontal guideline */}
                <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="var(--paper-dot)" strokeWidth="0.5" strokeDasharray="2,4" />
              </g>
            );
          })}

          {/* Y-Axis Baseline */}
          <line x1={paddingLeft} y1={30} x2={paddingLeft} y2={chartHeight - 10} stroke="var(--ink-black)" strokeWidth="1.8" />

          {/* ======= MOOD / ENERGY CONNECTED LINE (top section) ======= */}
          {energyPathStr && (
            <g>
              <path
                d={energyPathStr}
                fill="none"
                stroke="var(--ink-olive)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {energyPoints.map((pt) => {
                const isHovered = hoveredDay === pt.day && hoveredY === pt.y;
                return (
                  <circle
                    key={`energy-node-${pt.day}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4.8 : 3.2}
                    fill={isHovered ? 'var(--ink-olive)' : 'var(--paper-bg)'}
                    stroke="var(--ink-olive)"
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

          {/* ======= SLEEP CONNECTED LINE (bottom section) ======= */}
          {sleepPathStr && (
            <g>
              <path
                d={sleepPathStr}
                fill="none"
                stroke="#5b7a3d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6,3"
              />
              {sleepPoints.map((pt) => {
                const isHovered = hoveredDay === pt.day && hoveredY === pt.y;
                return (
                  <circle
                    key={`sleep-node-${pt.day}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4.5 : 3}
                    fill={isHovered ? '#5b7a3d' : 'var(--paper-bg)'}
                    stroke="#5b7a3d"
                    strokeWidth={isHovered ? 2.5 : 1.8}
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

          {/* Hover highlight vertical column */}
          {hoveredDay && (
            <line
              x1={getX(hoveredDay)}
              y1={30}
              x2={getX(hoveredDay)}
              y2={chartHeight - 10}
              stroke="var(--ink-black)"
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.5"
            />
          )}

          {/* Hover highlight horizontal guideline */}
          {hoveredY !== null && (
            <line
              x1={paddingLeft}
              y1={hoveredY}
              x2={svgWidth - paddingRight}
              y2={hoveredY}
              stroke="var(--ink-black)"
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.55"
            />
          )}
        </svg>

        {/* Bottom Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 14px 6px',
          fontSize: '12px',
          fontFamily: 'var(--font-primary)',
          fontWeight: 700,
          color: 'var(--ink-muted)',
          borderTop: '1px dashed var(--paper-dot)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--ink-olive)' }}>
              ── Mood / Emotion (:D → :()
            </span>
            <span style={{ color: '#5b7a3d' }}>
              - - Sleep Score (0–10)
            </span>
          </div>
          <span className="no-print" style={{ color: 'var(--ink-black)', cursor: 'pointer' }} onClick={() => onOpenMetricModal(1)}>
            [Click anywhere on chart to edit daily scores]
          </span>
        </div>
      </div>
    </div>
  );
};
