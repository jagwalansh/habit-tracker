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

export function getInitialMonthData(year: number, month: number, theme: JournalTheme = 'classic'): MonthData {
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

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

