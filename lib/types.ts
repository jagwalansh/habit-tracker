export type JournalTheme = 'classic' | 'alpine';

export interface Habit {
  id: string;
  name: string;
  category?: string;
  color?: string; // pastel underline color e.g. '#fed7aa', '#bbf7d0', '#fbcfe8'
  createdMonth?: string;
}

export interface DayMetric {
  mood?: number;          // 1 - 10
  stress?: number;        // 1 - 10
  sleep?: number;         // 1 - 10 (hours or score)
  sleepStart?: number;    // Bedtime hour (e.g. 23 = 11 PM, 0 = midnight, 1 = 1 AM)
  sleepEnd?: number;      // Wake time hour (e.g. 7 = 7 AM, 8.5 = 8:30 AM)
  energy?: number;        // Energy / Productivity score (1 - 10)
  notes?: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'other';

export interface Expense {
  id: string;
  dayNumber: number;      // 1-31
  amount: number;
  category: ExpenseCategory;
  note?: string;
  createdAt: string;      // ISO timestamp
}

export interface MonthData {
  monthKey: string; // "YYYY-MM"
  year: number;
  month: number;    // 0-11
  habits: Habit[];
  completions: Record<string, Record<number, boolean>>;
  metrics: Record<number, DayMetric>;
  annotations: Record<number, string>;
  expenses: Expense[];
}

export type ViewTab = 'TRACKER' | 'STATS' | 'SETTINGS' | 'PRESETS';
