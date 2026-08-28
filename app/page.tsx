'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MonthData, DayMetric, Habit, JournalTheme } from '../lib/types';
import { 
  loadJournalMonth, 
  saveJournalMonth, 
  getPhotoReplicaData, 
  getAlpinePhotoReplicaData,
  getInitialMonthData,
  loadSavedTheme,
  saveTheme,
  addHabitToYear
} from '../lib/storage';
import { getDaysInMonth, playPenSound, MONTH_NAMES } from '../lib/utils';
import { JournalBook } from '../components/JournalBook';
import { JournalHeader } from '../components/JournalHeader';
import { HabitGrid } from '../components/HabitGrid';
import { DayMarkerBar } from '../components/DayMarkerBar';
import { MetricChart } from '../components/MetricChart';
import { AlpineSpiralBook } from '../components/AlpineSpiralBook';
import { SleepIntervalChart } from '../components/SleepIntervalChart';
import { CrosshatchHabitGrid } from '../components/CrosshatchHabitGrid';
import { AddHabitModal } from '../components/AddHabitModal';
import { MetricInputModal } from '../components/MetricInputModal';
import { InsightsDrawer } from '../components/InsightsDrawer';

export default function HabitTrackerPage() {
  const [theme, setTheme] = useState<JournalTheme>('classic');
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [month, setMonth] = useState<number>(() => new Date().getMonth());
  const [activeTab, setActiveTab] = useState<'TRACKER' | 'STATS' | 'SETTINGS'>('TRACKER');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [monthData, setMonthData] = useState<MonthData | null>(null);

  // Modals state
  const [isAddHabitOpen, setIsAddHabitOpen] = useState<boolean>(false);
  const [metricModalDay, setMetricModalDay] = useState<number | null>(null);

  // Month navigation handlers (page flip animation commented out for later)
  /*
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const triggerFlip = useCallback((direction: 'forward' | 'backward', newYear: number, newMonth: number) => {
    if (soundEnabled) playPenSound('pageflip');
    setFlipDirection(direction);
    setTimeout(() => {
      setYear(newYear);
      setMonth(newMonth);
    }, 280);
    setTimeout(() => {
      setFlipDirection(null);
    }, 720);
  }, [soundEnabled]);
  */

  const handleMonthChange = useCallback((newYear: number, newMonth: number) => {
    if (soundEnabled) playPenSound('click');
    setYear(newYear);
    setMonth(newMonth);
  }, [soundEnabled]);

  // Load saved theme on mount
  useEffect(() => {
    const saved = loadSavedTheme();
    setTheme(saved);
  }, []);

  // Load data when year/month/theme changes
  useEffect(() => {
    const data = loadJournalMonth(year, month, theme);
    setMonthData(data);
  }, [year, month, theme]);

  // Jump to Current Month & Date
  const handleJumpToToday = () => {
    const now = new Date();
    const newYear = now.getFullYear();
    const newMonth = now.getMonth();
    if (newYear === year && newMonth === month) return;
    handleMonthChange(newYear, newMonth);
  };

  // Persist data updates
  const updateData = (newData: MonthData) => {
    setMonthData(newData);
    saveJournalMonth(newData);
  };

  const handleThemeChange = (newTheme: JournalTheme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const days = getDaysInMonth(year, month);

  // Toggle habit check
  const handleToggleHabit = (habitId: string, dayNumber: number) => {
    if (!monthData) return;
    const currentHabitCompletions = monthData.completions[habitId] || {};
    const updatedHabitCompletions = {
      ...currentHabitCompletions,
      [dayNumber]: !currentHabitCompletions[dayNumber],
    };

    const updatedData: MonthData = {
      ...monthData,
      completions: {
        ...monthData.completions,
        [habitId]: updatedHabitCompletions,
      },
    };

    updateData(updatedData);
  };

  // Add new habit with scope (this month only vs whole year)
  const handleAddHabit = (name: string, scope: 'month' | 'year' = 'month') => {
    if (!monthData) return;
    const pastelColors = ['#fef08a', '#fed7aa', '#fbcfe8', '#bbf7d0', '#e9d5ff'];
    const randomColor = pastelColors[monthData.habits.length % pastelColors.length];

    const newHabit: Habit = {
      id: `h-${Date.now()}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name.toUpperCase(),
      color: randomColor,
    };

    if (scope === 'year') {
      addHabitToYear(year, newHabit, theme);
    }

    const updatedData: MonthData = {
      ...monthData,
      habits: [...monthData.habits, newHabit],
    };

    updateData(updatedData);
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    if (!monthData) return;
    const updatedHabits = monthData.habits.filter((h) => h.id !== habitId);
    const updatedCompletions = { ...monthData.completions };
    delete updatedCompletions[habitId];

    const updatedData: MonthData = {
      ...monthData,
      habits: updatedHabits,
      completions: updatedCompletions,
    };

    updateData(updatedData);
  };

  // Toggle day annotation (heart marker)
  const handleToggleAnnotation = (dayNumber: number) => {
    if (!monthData) return;
    const current = monthData.annotations[dayNumber];
    const updatedAnnotations = { ...monthData.annotations };

    if (current === 'heart') {
      delete updatedAnnotations[dayNumber];
    } else {
      updatedAnnotations[dayNumber] = 'heart';
    }

    const updatedData: MonthData = {
      ...monthData,
      annotations: updatedAnnotations,
    };

    updateData(updatedData);
  };

  // Single metric update
  const handleUpdateDayMetric = (
    dayNumber: number, 
    field: 'mood' | 'stress' | 'sleep' | 'energy' | 'sleepStart' | 'sleepEnd', 
    value: number
  ) => {
    if (!monthData) return;
    const currentDayMetric = monthData.metrics[dayNumber] || {};
    const updatedMetrics = {
      ...monthData.metrics,
      [dayNumber]: {
        ...currentDayMetric,
        [field]: value,
      },
    };

    const updatedData: MonthData = {
      ...monthData,
      metrics: updatedMetrics,
    };

    updateData(updatedData);
  };

  // Full day score update via modal
  const handleSaveDayMetric = (dayNumber: number, metric: DayMetric) => {
    if (!monthData) return;
    const updatedMetrics = {
      ...monthData.metrics,
      [dayNumber]: metric,
    };

    const updatedData: MonthData = {
      ...monthData,
      metrics: updatedMetrics,
    };

    updateData(updatedData);
  };

  // Photo 1 Demo
  const handleLoadClassicPreset = () => {
    setYear(2020);
    setMonth(10);
    const replica = getPhotoReplicaData();
    updateData(replica);
  };

  // Photo 2 Demo
  const handleLoadAlpinePreset = () => {
    setYear(2026);
    setMonth(0);
    const replica = getAlpinePhotoReplicaData();
    updateData(replica);
  };

  // Reset month
  const handleResetMonth = () => {
    if (!monthData) return;
    if (!confirm('Clear all habit checks and metric entries for this month? (Your habit list will be kept)')) return;
    const clean: MonthData = {
      ...monthData,
      completions: {},
      metrics: {},
      annotations: {},
    };
    updateData(clean);
  };

  if (!monthData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-primary)'
      }}>
        Loading Bullet Journal...
      </div>
    );
  }

  return (
    <main className={theme === 'alpine' ? 'marble-backdrop' : ''}>
      {/* Theme Switcher Header Bar */}
      <div className="no-print" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '14px 16px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}>
        <div style={{
          backgroundColor: 'var(--paper-card)',
          border: '2px solid var(--ink-black)',
          borderRadius: '24px',
          padding: '4px',
          display: 'inline-flex',
          boxShadow: '3px 3px 0px var(--ink-black)',
        }}>
          <button
            onClick={() => handleThemeChange('classic')}
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: '13px',
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: theme === 'classic' ? '#1a1a1a' : 'transparent',
              color: theme === 'classic' ? '#ffffff' : 'var(--ink-black)',
              transition: 'all 0.15s ease',
            }}
          >
            📖 Theme 1: Traveler&apos;s Leather (Photo 1)
          </button>

          <button
            onClick={() => handleThemeChange('alpine')}
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: '13px',
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: theme === 'alpine' ? '#1a1a1a' : 'transparent',
              color: theme === 'alpine' ? '#ffffff' : 'var(--ink-black)',
              transition: 'all 0.15s ease',
            }}
          >
            🏔️ Theme 2: Alpine Spiral Sketchbook (Photo 2)
          </button>
        </div>
      </div>

      {theme === 'alpine' ? (
        /* ================= THEME 2: ALPINE SPIRAL SKETCHBOOK ================= */
        <AlpineSpiralBook
          year={year}
          month={month}
          soundEnabled={soundEnabled}
          activeView={activeTab}
          onMonthChange={handleMonthChange}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenAddHabit={() => setIsAddHabitOpen(true)}
          onLoadAlpinePreset={handleLoadAlpinePreset}
          onResetMonth={handleResetMonth}
          onToggleView={setActiveTab}
          onJumpToToday={handleJumpToToday}
          topChartSlot={
            <SleepIntervalChart
              days={days}
              metrics={monthData.metrics}
              onOpenMetricModal={(d) => setMetricModalDay(d)}
              onUpdateDayMetric={handleUpdateDayMetric}
            />
          }
        >
          {activeTab === 'STATS' ? (
            <InsightsDrawer
              data={monthData}
              onClose={() => setActiveTab('TRACKER')}
            />
          ) : (
            <CrosshatchHabitGrid
              days={days}
              habits={monthData.habits}
              completions={monthData.completions}
              soundEnabled={soundEnabled}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}
        </AlpineSpiralBook>
      ) : (
        /* ================= THEME 1: CLASSIC TRAVELER'S B&W JOURNAL ================= */
        <JournalBook
          year={year}
          month={month}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMonthSelect={(mIndex) => {
            const newYear = (mIndex === 0 && month === 11) ? year + 1 : (mIndex === 11 && month === 0) ? year - 1 : year;
            handleMonthChange(newYear, mIndex);
          }}
        >
          <JournalHeader
            year={year}
            month={month}
            soundEnabled={soundEnabled}
            activeView={activeTab}
            onMonthChange={handleMonthChange}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onOpenAddHabit={() => setIsAddHabitOpen(true)}
            onLoadPhotoPreset={handleLoadClassicPreset}
            onResetMonth={handleResetMonth}
            onToggleView={setActiveTab}
            onJumpToToday={handleJumpToToday}
          />

          {activeTab === 'STATS' ? (
            <InsightsDrawer
              data={monthData}
              onClose={() => setActiveTab('TRACKER')}
            />
          ) : (
            <>
              {/* Monthly Habit Matrix with perfectly aligned Highlights row */}
              <HabitGrid
                days={days}
                habits={monthData.habits}
                completions={monthData.completions}
                annotations={monthData.annotations}
                soundEnabled={soundEnabled}
                onToggleHabit={handleToggleHabit}
                onDeleteHabit={handleDeleteHabit}
                onToggleAnnotation={handleToggleAnnotation}
              />

              {/* Bottom Half: 1-10 Mood, Stress, Sleep Line Chart */}
              <MetricChart
                days={days}
                metrics={monthData.metrics}
                month={month}
                onUpdateDayMetric={handleUpdateDayMetric}
                onOpenMetricModal={(d) => setMetricModalDay(d)}
              />
            </>
          )}
        </JournalBook>
      )}

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddHabitOpen}
        currentMonthName={MONTH_NAMES[month]}
        year={year}
        onClose={() => setIsAddHabitOpen(false)}
        onAddHabit={handleAddHabit}
      />

      <MetricInputModal
        isOpen={metricModalDay !== null}
        dayNumber={metricModalDay || 1}
        maxDays={days.length}
        currentMetric={metricModalDay ? monthData.metrics[metricModalDay] : undefined}
        onClose={() => setMetricModalDay(null)}
        onSave={handleSaveDayMetric}
        onNavigateDay={(newDay) => setMetricModalDay(newDay)}
      />
    </main>
  );
}
