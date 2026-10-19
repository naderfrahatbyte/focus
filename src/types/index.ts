export type HabitRewardType = 'manual' | 'duration' | 'fixed';

export interface HabitReward {
  id: string;
  name: string;
  category: string;
  icon: string;
  rewardType: HabitRewardType;
  ratePerMinute?: number;     // For 'duration': e.g. 1.0 credit per minute
  fixedReward?: number;       // For 'fixed': e.g. 15 credits upon completion
  manualReward?: number;      // For 'manual': e.g. 5 credits upon check-in
  lastCompletedDate?: string; // YYYY-MM-DD
  timesCompletedToday: number;
  maxPerDay?: number;
  notes?: string;
  isCustom?: boolean;
}

export interface ProductiveApp {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  creditPerMinute: number;
  totalMinutesUsed: number;
  totalCreditsEarned: number;
  isTracking: boolean;
  activeSeconds: number;
}

export interface ConsumingApp {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  costPerMinute: number;
  totalMinutesUsed: number;
  totalCreditsConsumed: number;
  isTracking: boolean;
  activeSeconds: number;
  isBlocked: boolean;
}

export interface CreditTransaction {
  id: string;
  timestamp: string; // ISO string
  type: 'earn_app' | 'earn_habit' | 'consume_app' | 'manual_adjust';
  sourceId: string;
  sourceName: string;
  amount: number; // Positive for earned, negative for consumed
  durationMinutes?: number;
  details?: string;
}

export interface DailyFocusSummary {
  date: string; // YYYY-MM-DD
  totalEarnedCredits: number;
  totalSpentCredits: number;
  totalProductiveMinutes: number;
  totalConsumingMinutes: number;
  habitsCompleted: number;
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'daily' | 'habits' | 'deep_work' | 'quran' | 'fitness';
  targetMinutes?: number;
  completed: boolean;
  streak: number;
  dueDate?: string;
  linkedFocusId?: string; // Links to a habit or app
}

export interface FocusSettings {
  soundEnabled: boolean;
  preventBackgroundCounting: boolean;
  strictBlockingMode: boolean; // Simulates immediate lock overlay
  dailyGoalCredits: number;
  allowEmergencyMinutes: boolean;
  emergencyMinutesRemaining: number;
}

export interface FocusState {
  credits: number;
  productiveApps: ProductiveApp[];
  habits: HabitReward[];
  consumingApps: ConsumingApp[];
  transactions: CreditTransaction[];
  settings: FocusSettings;
  goals: GoalItem[];
}
