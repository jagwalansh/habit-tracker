import { MonthData, Habit, DayMetric, JournalTheme } from './types';

export const DEFAULT_HABITS: Habit[] = [
  { id: 'h-write', name: 'WRITE' },
  { id: 'h-read', name: 'READ' },
  { id: 'h-scare', name: 'S. CARE' },
  { id: 'h-home', name: 'HOME' },
  { id: 'h-cook', name: 'COOK' },
  { id: 'h-plants', name: 'PLANTS' },
  { id: 'h-noshop', name: 'NO SHOP' },
  { id: 'h-social', name: 'SOCIAL' },
  { id: 'h-family', name: 'FAMILY' },
];

export const DEFAULT_ALPINE_HABITS: Habit[] = [
  { id: 'alp-workout', name: 'WORKOUT', color: '#fef08a' },
  { id: 'alp-meditate', name: 'MEDITATE', color: '#fed7aa' },
  { id: 'alp-reading', name: 'READING 30M', color: '#fbcfe8' },
  { id: 'alp-water', name: 'WATER 2.5L', color: '#bbf7d0' },
  { id: 'alp-journal', name: 'JOURNAL', color: '#fed7aa' },
  { id: 'alp-sleep', name: 'SLEEP BY 11', color: '#e9d5ff' },
  { id: 'alp-walk', name: 'WALK 8K STEPS', color: '#fef08a' },
  { id: 'alp-nosugar', name: 'NO JUNK FOOD', color: '#fbcfe8' },
  { id: 'alp-clean', name: 'TIDY ROOM', color: '#bbf7d0' },
];

/**
 * Creates the exact photo replica data for November 2020 (Theme 1)
 */
export function getPhotoReplicaData(): MonthData {
  const monthKey = '2020-11';
  const completions: Record<string, Record<number, boolean>> = {
    'h-write': {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
      9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true,
      17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true,
      25: true, 26: true, 27: true, 28: true, 29: true, 30: true
    },
    'h-read': {
      1: true, 2: true, 3: true, 5: true, 8: true, 9: true, 10: true, 11: true, 12: true,
      14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true,
      23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true
    },
    'h-scare': {
      1: true, 2: true, 5: true, 9: true, 10: true, 11: true, 12: true,
      14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true,
      23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true
    },
    'h-home': {
      1: true, 5: true, 7: true, 8: true, 10: true, 12: true, 14: true, 15: true, 16: true,
      17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true,
      25: true, 27: true, 28: true, 29: true, 30: true
    },
    'h-cook': {
      1: true, 3: true, 6: true, 7: true, 10: true, 12: true,
      15: true, 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true,
      23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true
    },
    'h-plants': {
      1: true, 5: true, 8: true, 12: true, 15: true, 19: true, 22: true, 26: true, 29: true
    },
    'h-noshop': {
      5: true, 6: true, 7: true, 10: true, 11: true, 14: true, 15: true, 16: true,
      17: true, 20: true, 22: true, 24: true, 27: true, 28: true, 30: true
    },
    'h-social': {
      3: true, 5: true, 7: true, 14: true, 15: true, 18: true, 22: true, 29: true
    },
    'h-family': {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
      9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true,
      17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true,
      25: true, 26: true, 27: true, 28: true, 29: true, 30: true
    },
  };

  const metrics: Record<number, DayMetric> = {
    1: { mood: 6, stress: 7, sleep: 10 },
    2: { mood: 7, stress: 7, sleep: 7 },
    3: { mood: 9, stress: 6, sleep: 6.5 },
    4: { mood: 3, stress: 10, sleep: 9 },
    5: { mood: 4, stress: 9, sleep: 8.5 },
    6: { mood: 5, stress: 7, sleep: 8.5 },
    7: { mood: 6.5, stress: 4, sleep: 8.5 },
    8: { mood: 9, stress: 4, sleep: 9.5 },
    9: { mood: 8, stress: 4.5, sleep: 9 },
    10: { mood: 8, stress: 5, sleep: 8.5 },
    11: { mood: 7.5, stress: 5.5, sleep: 7 },
    12: { mood: 8, stress: 5.5, sleep: 8.5 },
    13: { mood: 7, stress: 5, sleep: 6 },
    14: { mood: 9, stress: 2, sleep: 9 },
    15: { mood: 9.5, stress: 1.5, sleep: 9.5 },
    16: { mood: 9, stress: 1.5, sleep: 8.5 },
    17: { mood: 8, stress: 2, sleep: 5.5 },
    18: { mood: 8, stress: 2, sleep: 6.5 },
    19: { mood: 7.5, stress: 3.5, sleep: 6.2 },
    20: { mood: 7.5, stress: 3.5, sleep: 8.2 },
    21: { mood: 8.5, stress: 4.5, sleep: 7 },
    22: { mood: 8, stress: 4.5, sleep: 8.5 },
    23: { mood: 7.5, stress: 4, sleep: 7.5 },
    24: { mood: 8, stress: 5, sleep: 7 },
    25: { mood: 7.5, stress: 4.5, sleep: 8 },
    26: { mood: 6, stress: 6.5, sleep: 5.5 },
    27: { mood: 8, stress: 4.5, sleep: 5.5 },
    28: { mood: 8, stress: 4.5, sleep: 9.5 },
    29: { mood: 7, stress: 5, sleep: 7.5 },
    30: { mood: 6.5, stress: 5.5, sleep: 8 },
  };

  const annotations: Record<number, string> = {
    5: 'heart', 7: 'heart', 14: 'heart', 19: 'heart', 21: 'heart', 26: 'heart', 30: 'heart',
  };

  return {
    monthKey,
    year: 2020,
    month: 10,
    habits: DEFAULT_HABITS,
    completions,
    metrics,
    annotations,
  };
}

/**
 * Creates the exact replica data for January Alpine Spiral Journal (Theme 2)
 */
export function getAlpinePhotoReplicaData(): MonthData {
  const monthKey = '2026-01';
  const completions: Record<string, Record<number, boolean>> = {
    'alp-workout': {
      1: true, 2: true, 5: true, 6: true, 7: true, 8: true, 11: true, 12: true, 13: true, 14: true,
      15: true, 18: true, 19: true, 20: true, 21: true, 22: true, 25: true, 26: true, 27: true, 28: true, 29: true
    },
    'alp-meditate': {
      1: true, 2: true, 3: true, 4: true, 5: true, 8: true, 9: true, 10: true, 12: true, 14: true,
      15: true, 16: true, 17: true, 19: true, 21: true, 22: true, 23: true, 24: true, 26: true, 28: true, 30: true, 31: true
    },
    'alp-reading': {
      1: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 10: true, 11: true, 12: true,
      13: true, 14: true, 15: true, 17: true, 18: true, 19: true, 20: true, 22: true, 24: true, 25: true, 27: true, 29: true, 31: true
    },
    'alp-water': {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true,
      11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true,
      21: true, 22: true, 23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true, 31: true
    },
    'alp-journal': {
      2: true, 4: true, 5: true, 7: true, 9: true, 11: true, 12: true, 14: true, 16: true, 18: true,
      19: true, 21: true, 23: true, 25: true, 26: true, 28: true, 30: true
    },
    'alp-sleep': {
      1: true, 2: true, 3: true, 6: true, 7: true, 8: true, 9: true, 10: true, 13: true, 14: true,
      15: true, 16: true, 17: true, 20: true, 21: true, 22: true, 23: true, 24: true, 27: true, 28: true, 29: true, 30: true
    },
    'alp-walk': {
      3: true, 4: true, 5: true, 6: true, 10: true, 11: true, 12: true, 13: true, 17: true, 18: true,
      19: true, 20: true, 24: true, 25: true, 26: true, 27: true, 31: true
    },
    'alp-nosugar': {
      1: true, 2: true, 3: true, 4: true, 7: true, 8: true, 9: true, 10: true, 11: true, 14: true,
      15: true, 16: true, 17: true, 18: true, 21: true, 22: true, 23: true, 24: true, 25: true, 28: true, 29: true, 30: true, 31: true
    },
    'alp-clean': {
      2: true, 5: true, 9: true, 12: true, 16: true, 19: true, 23: true, 26: true, 30: true
    }
  };

  // Top Section: Sleep Interval & Energy Graph from Photo 2
  // sleepStart = Bedtime hour (22, 23, 0, 1), sleepEnd = Wake hour (6, 7, 8, 9, 10), energy = score 1-10
  const metrics: Record<number, DayMetric> = {
    1: { sleepStart: 23, sleepEnd: 8, energy: 4.5 },
    2: { sleepStart: 23.5, sleepEnd: 7.5, energy: 5.5 },
    3: { sleepStart: 0, sleepEnd: 9.5, energy: 7 },
    4: { sleepStart: 0.5, sleepEnd: 8.5, energy: 7.5 },
    5: { sleepStart: 23, sleepEnd: 7, energy: 6 },
    6: { sleepStart: 23, sleepEnd: 7.5, energy: 7 },
    7: { sleepStart: 22.5, sleepEnd: 6.5, energy: 8.5 },
    8: { sleepStart: 23, sleepEnd: 7, energy: 8.8 },
    9: { sleepStart: 23.5, sleepEnd: 8, energy: 9 },
    10: { sleepStart: 23, sleepEnd: 7, energy: 8 },
    11: { sleepStart: 22.5, sleepEnd: 6.5, energy: 7.5 },
    12: { sleepStart: 23, sleepEnd: 7, energy: 8 },
    13: { sleepStart: 23, sleepEnd: 7.5, energy: 8.5 },
    14: { sleepStart: 0, sleepEnd: 8.5, energy: 7.8 },
    15: { sleepStart: 23.5, sleepEnd: 7, energy: 8.2 },
    16: { sleepStart: 23, sleepEnd: 6.5, energy: 9.2 },
    17: { sleepStart: 23.5, sleepEnd: 7.5, energy: 8.4 },
    18: { sleepStart: 0, sleepEnd: 9, energy: 7.5 },
    19: { sleepStart: 23, sleepEnd: 7, energy: 8.8 },
    20: { sleepStart: 23, sleepEnd: 6.5, energy: 9.4 },
    21: { sleepStart: 23.5, sleepEnd: 8, energy: 7.5 },
    22: { sleepStart: 0.5, sleepEnd: 9, energy: 9.6 },
    23: { sleepStart: 23, sleepEnd: 7, energy: 8.5 },
    24: { sleepStart: 22.5, sleepEnd: 6.5, energy: 9.2 },
    25: { sleepStart: 23, sleepEnd: 7.5, energy: 9.8 },
    26: { sleepStart: 23.5, sleepEnd: 8, energy: 9.2 },
    27: { sleepStart: 23, sleepEnd: 7, energy: 8.8 },
    28: { sleepStart: 22.5, sleepEnd: 6.5, energy: 9.5 },
    29: { sleepStart: 23, sleepEnd: 7, energy: 9 },
    30: { sleepStart: 23, sleepEnd: 7.5, energy: 8.5 },
    31: { sleepStart: 23.5, sleepEnd: 8, energy: 8.8 },
  };

  return {
    monthKey,
    year: 2026,
    month: 0, // January is index 0
    habits: DEFAULT_ALPINE_HABITS,
    completions,
    metrics,
    annotations: {},
  };
}

export function getInitialMonthData(year: number, month: number, theme: JournalTheme = 'classic'): MonthData {
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  if (monthKey === '2020-11' && theme === 'classic') {
    return getPhotoReplicaData();
  }
  if (monthKey === '2026-01' && theme === 'alpine') {
    return getAlpinePhotoReplicaData();
  }

  // Check if user has a saved habit list for this theme
  let initialHabits = theme === 'alpine' ? DEFAULT_ALPINE_HABITS : DEFAULT_HABITS;
  if (typeof window !== 'undefined') {
    const savedHabitsRaw = localStorage.getItem(`bullet_journal_habits_${theme}`);
    if (savedHabitsRaw) {
      try {
        const parsed = JSON.parse(savedHabitsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialHabits = parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved habits', e);
      }
    }
  }

  return {
    monthKey,
    year,
    month,
    habits: initialHabits,
    completions: {},
    metrics: {},
    annotations: {},
  };
}

const STORAGE_PREFIX = 'bullet_journal_';
const THEME_STORAGE_KEY = 'bullet_journal_current_theme';

export function loadSavedTheme(): JournalTheme {
  if (typeof window === 'undefined') return 'classic';
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return (saved === 'alpine' || saved === 'classic') ? saved : 'classic';
}

export function saveTheme(theme: JournalTheme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function loadJournalMonth(year: number, month: number, theme: JournalTheme = 'classic'): MonthData {
  if (typeof window === 'undefined') {
    return getInitialMonthData(year, month, theme);
  }
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const raw = localStorage.getItem(STORAGE_PREFIX + monthKey);
  if (!raw) {
    const initial = getInitialMonthData(year, month, theme);
    saveJournalMonth(initial);
    return initial;
  }
  try {
    const data = JSON.parse(raw);
    return data;
  } catch (e) {
    console.error('Failed to parse journal data', e);
    return getInitialMonthData(year, month, theme);
  }
}

export function saveJournalMonth(data: MonthData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_PREFIX + data.monthKey, JSON.stringify(data));
  // Also save active habit template
  if (data.habits && data.habits.length > 0) {
    const isAlpine = data.habits.some(h => h.id.startsWith('alp-')) || data.habits[0]?.color;
    const themeKey = isAlpine ? 'alpine' : 'classic';
    localStorage.setItem(`bullet_journal_habits_${themeKey}`, JSON.stringify(data.habits));
  }
}

export function addHabitToYear(year: number, habit: Habit, theme: JournalTheme = 'classic') {
  if (typeof window === 'undefined') return;
  // Update year-wide template for this theme
  const themeKey = theme;
  const savedHabitsRaw = localStorage.getItem(`bullet_journal_habits_${themeKey}`);
  let habitsList: Habit[] = theme === 'alpine' ? [...DEFAULT_ALPINE_HABITS] : [...DEFAULT_HABITS];
  if (savedHabitsRaw) {
    try {
      habitsList = JSON.parse(savedHabitsRaw);
    } catch {}
  }
  if (!habitsList.some(h => h.name.toUpperCase() === habit.name.toUpperCase())) {
    habitsList.push(habit);
    localStorage.setItem(`bullet_journal_habits_${themeKey}`, JSON.stringify(habitsList));
  }

  // Update all stored months of this year in localStorage
  for (let m = 0; m < 12; m++) {
    const monthKey = `${year}-${String(m + 1).padStart(2, '0')}`;
    const raw = localStorage.getItem(STORAGE_PREFIX + monthKey);
    if (raw) {
      try {
        const mData: MonthData = JSON.parse(raw);
        if (!mData.habits.some(h => h.name.toUpperCase() === habit.name.toUpperCase())) {
          mData.habits.push(habit);
          localStorage.setItem(STORAGE_PREFIX + monthKey, JSON.stringify(mData));
        }
      } catch (e) {
        console.error('Failed to update month habits', e);
      }
    }
  }
}

