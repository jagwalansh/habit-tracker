import { MonthData } from './types';

export const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface DayInfo {
  dayNumber: number;
  dayOfWeekLetter: string;
  dayOfWeekIndex: number; // 0 for Sunday, 6 for Saturday
  dateStr: string;
  isWeekend: boolean;
  isToday: boolean;
}

export function getDaysInMonth(year: number, month: number): DayInfo[] {
  // month is 0-indexed
  const numDays = new Date(year, month + 1, 0).getDate();
  const days: DayInfo[] = [];
  const today = new Date();
  const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  for (let d = 1; d <= numDays; d++) {
    const date = new Date(year, month, d);
    const dayOfWeekIndex = date.getDay();
    days.push({
      dayNumber: d,
      dayOfWeekLetter: DAY_LETTERS[dayOfWeekIndex],
      dayOfWeekIndex,
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isWeekend: dayOfWeekIndex === 0 || dayOfWeekIndex === 6,
      isToday: isCurrentYearMonth && d === todayDate,
    });
  }

  return days;
}

/**
 * Web Audio API synthesizer for paper-and-pen tactile click/tick
 */
export function playPenSound(type: 'click' | 'scribble' | 'dot' | 'pageflip' = 'dot') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'dot') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'scribble') {
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(ctx.currentTime);
    } else if (type === 'pageflip') {
      // Paper page flip sound: fast whoosh noise + subtle thump
      const duration = 0.35;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for papery whoosh
      const bpFilter = ctx.createBiquadFilter();
      bpFilter.type = 'bandpass';
      bpFilter.frequency.setValueAtTime(600, ctx.currentTime);
      bpFilter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.08);
      bpFilter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);
      bpFilter.Q.value = 1.5;

      // Volume envelope: quick swell then fade
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.04);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(bpFilter);
      bpFilter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);

      // Subtle low thump for the page landing
      const thump = ctx.createOscillator();
      const thumpGain = ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(120, ctx.currentTime + 0.15);
      thump.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.28);
      thumpGain.gain.setValueAtTime(0.0, ctx.currentTime);
      thumpGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.16);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      thump.connect(thumpGain);
      thumpGain.connect(ctx.destination);
      thump.start(ctx.currentTime + 0.14);
      thump.stop(ctx.currentTime + 0.32);
    }
  } catch {
    // Audio contexts might be restricted before interaction
  }
}

/**
 * Calculates analytics for habit tracker
 */
export function calculateJournalStats(data: MonthData) {
  const daysInMonth = new Date(data.year, data.month + 1, 0).getDate();
  const habits = data.habits || [];
  
  let totalOpportunities = habits.length * daysInMonth;
  let totalCompletions = 0;

  const habitStats = habits.map(habit => {
    const habitCompletions = data.completions[habit.id] || {};
    let count = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      if (habitCompletions[d]) {
        count++;
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Check today streak
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === data.year && now.getMonth() === data.month;
    const checkDay = isCurrentMonth ? now.getDate() : daysInMonth;
    for (let d = checkDay; d >= 1; d--) {
      if (habitCompletions[d]) {
        currentStreak++;
      } else {
        break;
      }
    }

    totalCompletions += count;

    return {
      id: habit.id,
      name: habit.name,
      completedDays: count,
      completionRate: Math.round((count / daysInMonth) * 100),
      currentStreak,
      maxStreak,
    };
  });

  const overallRate = totalOpportunities > 0 ? Math.round((totalCompletions / totalOpportunities) * 100) : 0;

  // Metric averages
  const metrics = data.metrics || {};
  let moodSum = 0, moodCount = 0;
  let stressSum = 0, stressCount = 0;
  let sleepSum = 0, sleepCount = 0;

  Object.values(metrics).forEach(m => {
    if (m.mood != null) { moodSum += m.mood; moodCount++; }
    if (m.stress != null) { stressSum += m.stress; stressCount++; }
    if (m.sleep != null) { sleepSum += m.sleep; sleepCount++; }
  });

  return {
    overallRate,
    totalCompletions,
    totalOpportunities,
    habitStats,
    averages: {
      mood: moodCount ? (moodSum / moodCount).toFixed(1) : '-',
      stress: stressCount ? (stressSum / stressCount).toFixed(1) : '-',
      sleep: sleepCount ? (sleepSum / sleepCount).toFixed(1) : '-',
    }
  };
}
