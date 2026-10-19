import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { FocusState, HabitReward, ProductiveApp, ConsumingApp, CreditTransaction, FocusSettings } from '../types';
import { INITIAL_FOCUS_STATE } from '../data/initialData';

const STORAGE_KEY = 'ahdafi_focus_state_v2';

interface FocusContextType {
  state: FocusState;
  activeConsumingApp: ConsumingApp | null;
  activeProductiveApp: ProductiveApp | null;
  isBlockedModalOpen: boolean;
  blockedAppName: string;
  closeBlockedModal: () => void;
  // App Tracking
  startProductiveSession: (appId: string) => void;
  stopProductiveSession: (appId: string) => void;
  startConsumingSession: (appId: string) => void;
  stopConsumingSession: (appId: string) => void;
  // Habits Claiming
  claimManualHabit: (habitId: string) => { success: boolean; message: string };
  logDurationHabit: (habitId: string, minutes: number) => { success: boolean; message: string };
  claimFixedHabit: (habitId: string) => { success: boolean; message: string };
  // CRUD Habits
  addHabit: (habit: Omit<HabitReward, 'id' | 'timesCompletedToday'>) => void;
  updateHabit: (habit: HabitReward) => void;
  deleteHabit: (habitId: string) => void;
  // CRUD Apps
  updateAppRate: (appId: string, isProductive: boolean, newRate: number) => void;
  addProductiveApp: (app: Omit<ProductiveApp, 'id' | 'totalMinutesUsed' | 'totalCreditsEarned' | 'isTracking' | 'activeSeconds'>) => void;
  addConsumingApp: (app: Omit<ConsumingApp, 'id' | 'totalMinutesUsed' | 'totalCreditsConsumed' | 'isTracking' | 'activeSeconds' | 'isBlocked'>) => void;
  deleteApp: (appId: string, isProductive: boolean) => void;
  // Goals
  toggleGoal: (goalId: string) => void;
  // Settings & Utilities
  updateSettings: (newSettings: Partial<FocusSettings>) => void;
  addManualCredits: (amount: number, reason: string) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const FocusContext = createContext<FocusContextType | null>(null);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FocusState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all active trackings are reset on initial load
        return {
          ...parsed,
          productiveApps: (parsed.productiveApps || INITIAL_FOCUS_STATE.productiveApps).map((a: ProductiveApp) => ({
            ...a,
            isTracking: false,
            activeSeconds: 0,
          })),
          consumingApps: (parsed.consumingApps || INITIAL_FOCUS_STATE.consumingApps).map((a: ConsumingApp) => ({
            ...a,
            isTracking: false,
            activeSeconds: 0,
          })),
        };
      }
    } catch (e) {
      console.error('Failed to load focus state from localStorage', e);
    }
    return INITIAL_FOCUS_STATE;
  });

  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockedAppName, setBlockedAppName] = useState('');
  const timerRef = useRef<number | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save focus state to localStorage', e);
    }
  }, [state]);

  const activeConsumingApp = state.consumingApps.find((a) => a.isTracking) || null;
  const activeProductiveApp = state.productiveApps.find((a) => a.isTracking) || null;

  // Window visibility & blur protection (prevent counting time in background)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.settings.preventBackgroundCounting) {
        // Automatically stop active sessions to prevent unearned background credits or accidental burn
        setState((prev) => {
          const hadActiveProd = prev.productiveApps.some((a) => a.isTracking);
          const hadActiveCons = prev.consumingApps.some((a) => a.isTracking);
          if (!hadActiveProd && !hadActiveCons) return prev;

          return {
            ...prev,
            productiveApps: prev.productiveApps.map((a) => ({ ...a, isTracking: false })),
            consumingApps: prev.consumingApps.map((a) => ({ ...a, isTracking: false })),
          };
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.settings.preventBackgroundCounting]);

  // Main 1-second interval ticker for active sessions
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setState((prev) => {
        let newCredits = prev.credits;
        let triggeredBlock = false;
        let blockedName = '';

        // Check consuming apps first
        const updatedConsuming = prev.consumingApps.map((app) => {
          if (!app.isTracking) return app;

          // Cost per second = costPerMinute / 60
          const costPerSec = app.costPerMinute / 60;

          if (newCredits <= 0.001) {
            // Balance exhausted! Halt consuming app immediately
            triggeredBlock = true;
            blockedName = app.name;
            return {
              ...app,
              isTracking: false,
              isBlocked: true,
            };
          }

          const deducted = Math.min(newCredits, costPerSec);
          newCredits = Math.max(0, Number((newCredits - deducted).toFixed(3)));

          const newActiveSecs = app.activeSeconds + 1;
          const newTotalMins = Number((app.totalMinutesUsed + 1 / 60).toFixed(2));
          const newTotalCreditsConsumed = Number((app.totalCreditsConsumed + deducted).toFixed(2));

          return {
            ...app,
            activeSeconds: newActiveSecs,
            totalMinutesUsed: newTotalMins,
            totalCreditsConsumed: newTotalCreditsConsumed,
          };
        });

        // Check productive apps
        const updatedProductive = prev.productiveApps.map((app) => {
          if (!app.isTracking) return app;

          // Earn per second = creditPerMinute / 60
          const earnPerSec = app.creditPerMinute / 60;
          newCredits = Number((newCredits + earnPerSec).toFixed(3));

          const newActiveSecs = app.activeSeconds + 1;
          const newTotalMins = Number((app.totalMinutesUsed + 1 / 60).toFixed(2));
          const newTotalCreditsEarned = Number((app.totalCreditsEarned + earnPerSec).toFixed(2));

          return {
            ...app,
            activeSeconds: newActiveSecs,
            totalMinutesUsed: newTotalMins,
            totalCreditsEarned: newTotalCreditsEarned,
          };
        });

        if (triggeredBlock) {
          setIsBlockedModalOpen(true);
          setBlockedAppName(blockedName);
        }

        return {
          ...prev,
          credits: newCredits,
          consumingApps: updatedConsuming,
          productiveApps: updatedProductive,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const closeBlockedModal = () => setIsBlockedModalOpen(false);

  // App Session Handlers
  const startProductiveSession = (appId: string) => {
    setState((prev) => ({
      ...prev,
      // Stop any other active app to ensure 1 app tracked at a time (prevent double counting)
      productiveApps: prev.productiveApps.map((a) => ({
        ...a,
        isTracking: a.id === appId,
      })),
      consumingApps: prev.consumingApps.map((a) => ({
        ...a,
        isTracking: false,
      })),
    }));
  };

  const stopProductiveSession = (appId: string) => {
    setState((prev) => {
      const app = prev.productiveApps.find((a) => a.id === appId);
      if (!app || !app.isTracking) return prev;

      const sessionMins = Math.max(0.1, Number((app.activeSeconds / 60).toFixed(1)));
      const earned = Number((sessionMins * app.creditPerMinute).toFixed(1));

      const newTx: CreditTransaction = {
        id: 'tx_' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'earn_app',
        sourceId: app.id,
        sourceName: app.name,
        amount: earned,
        durationMinutes: sessionMins,
        details: `جلسة استخدام لتطبيق منتج (${sessionMins} دقيقة × ${app.creditPerMinute} رصيد)`,
      };

      return {
        ...prev,
        productiveApps: prev.productiveApps.map((a) =>
          a.id === appId ? { ...a, isTracking: false, activeSeconds: 0 } : a
        ),
        transactions: [newTx, ...prev.transactions].slice(0, 100),
      };
    });
  };

  const startConsumingSession = (appId: string) => {
    if (state.credits <= 0) {
      const targetApp = state.consumingApps.find((a) => a.id === appId);
      setBlockedAppName(targetApp?.name || 'التطبيق');
      setIsBlockedModalOpen(true);
      return;
    }

    setState((prev) => ({
      ...prev,
      consumingApps: prev.consumingApps.map((a) => ({
        ...a,
        isTracking: a.id === appId,
      })),
      productiveApps: prev.productiveApps.map((a) => ({
        ...a,
        isTracking: false,
      })),
    }));
  };

  const stopConsumingSession = (appId: string) => {
    setState((prev) => {
      const app = prev.consumingApps.find((a) => a.id === appId);
      if (!app || !app.isTracking) return prev;

      const sessionMins = Math.max(0.1, Number((app.activeSeconds / 60).toFixed(1)));
      const consumed = Number((sessionMins * app.costPerMinute).toFixed(1));

      const newTx: CreditTransaction = {
        id: 'tx_' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'consume_app',
        sourceId: app.id,
        sourceName: app.name,
        amount: -consumed,
        durationMinutes: sessionMins,
        details: `جلسة استخدام لتطبيق مقيد (${sessionMins} دقيقة × ${app.costPerMinute} تكلفة)`,
      };

      return {
        ...prev,
        consumingApps: prev.consumingApps.map((a) =>
          a.id === appId ? { ...a, isTracking: false, activeSeconds: 0 } : a
        ),
        transactions: [newTx, ...prev.transactions].slice(0, 100),
      };
    });
  };

  // Habits Claiming
  const claimManualHabit = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const habit = state.habits.find((h) => h.id === habitId);

    if (!habit) return { success: false, message: 'العادة غير موجودة' };

    if (habit.maxPerDay && habit.timesCompletedToday >= habit.maxPerDay && habit.lastCompletedDate === todayStr) {
      return { success: false, message: `وصلت للحد الأقصى اليومي لهذه العادة (${habit.maxPerDay} مرات). أحسنت!` };
    }

    const rewardAmount = habit.manualReward || 5.0;

    const newTx: CreditTransaction = {
      id: 'tx_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'earn_habit',
      sourceId: habit.id,
      sourceName: habit.name,
      amount: rewardAmount,
      details: `تسجيل إنجاز يدوي للعادة (+${rewardAmount} رصيد)`,
    };

    setState((prev) => ({
      ...prev,
      credits: Number((prev.credits + rewardAmount).toFixed(1)),
      habits: prev.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              timesCompletedToday: (h.lastCompletedDate === todayStr ? h.timesCompletedToday : 0) + 1,
              lastCompletedDate: todayStr,
            }
          : h
      ),
      transactions: [newTx, ...prev.transactions].slice(0, 100),
    }));

    return { success: true, message: `تم تسجيل الإنجاز وكسب +${rewardAmount} رصيد!` };
  };

  const logDurationHabit = (habitId: string, minutes: number) => {
    if (minutes <= 0) return { success: false, message: 'يرجى إدخال مدة صحيحة بالدقائق' };

    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return { success: false, message: 'العادة غير موجودة' };

    const rate = habit.ratePerMinute || 1.0;
    const rewardAmount = Number((minutes * rate).toFixed(1));
    const todayStr = new Date().toISOString().split('T')[0];

    const newTx: CreditTransaction = {
      id: 'tx_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'earn_habit',
      sourceId: habit.id,
      sourceName: habit.name,
      amount: rewardAmount,
      durationMinutes: minutes,
      details: `إنجاز عادة بمدة ${minutes} دقيقة × ${rate} رصيد/دقيقة (+${rewardAmount} رصيد)`,
    };

    setState((prev) => ({
      ...prev,
      credits: Number((prev.credits + rewardAmount).toFixed(1)),
      habits: prev.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              timesCompletedToday: (h.lastCompletedDate === todayStr ? h.timesCompletedToday : 0) + 1,
              lastCompletedDate: todayStr,
            }
          : h
      ),
      transactions: [newTx, ...prev.transactions].slice(0, 100),
    }));

    return { success: true, message: `تم احتساب ${minutes} دقيقة وكسب +${rewardAmount} رصيد بنجاح!` };
  };

  const claimFixedHabit = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return { success: false, message: 'العادة غير موجودة' };

    if (habit.maxPerDay && habit.timesCompletedToday >= habit.maxPerDay && habit.lastCompletedDate === todayStr) {
      return { success: false, message: `أكملت الحد الأقصى لهذه العادة اليومية بنجاح!` };
    }

    const rewardAmount = habit.fixedReward || 10.0;

    const newTx: CreditTransaction = {
      id: 'tx_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'earn_habit',
      sourceId: habit.id,
      sourceName: habit.name,
      amount: rewardAmount,
      details: `مكافأة ثابتة لإتمام العادة كاملة (+${rewardAmount} رصيد)`,
    };

    setState((prev) => ({
      ...prev,
      credits: Number((prev.credits + rewardAmount).toFixed(1)),
      habits: prev.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              timesCompletedToday: (h.lastCompletedDate === todayStr ? h.timesCompletedToday : 0) + 1,
              lastCompletedDate: todayStr,
            }
          : h
      ),
      transactions: [newTx, ...prev.transactions].slice(0, 100),
    }));

    return { success: true, message: `مبروك! تم إتمام العادة وكسب مكافأة +${rewardAmount} رصيد!` };
  };

  // CRUD Habits
  const addHabit = (habitData: Omit<HabitReward, 'id' | 'timesCompletedToday'>) => {
    const newHabit: HabitReward = {
      ...habitData,
      id: 'habit_' + Date.now(),
      timesCompletedToday: 0,
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      habits: [newHabit, ...prev.habits],
    }));
  };

  const updateHabit = (updatedHabit: HabitReward) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    }));
  };

  const deleteHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
  };

  // CRUD Apps
  const updateAppRate = (appId: string, isProductive: boolean, newRate: number) => {
    const rate = Math.max(0.1, Number(newRate.toFixed(1)));
    setState((prev) => ({
      ...prev,
      productiveApps: isProductive
        ? prev.productiveApps.map((a) => (a.id === appId ? { ...a, creditPerMinute: rate } : a))
        : prev.productiveApps,
      consumingApps: !isProductive
        ? prev.consumingApps.map((a) => (a.id === appId ? { ...a, costPerMinute: rate } : a))
        : prev.consumingApps,
    }));
  };

  const addProductiveApp = (appData: Omit<ProductiveApp, 'id' | 'totalMinutesUsed' | 'totalCreditsEarned' | 'isTracking' | 'activeSeconds'>) => {
    const newApp: ProductiveApp = {
      ...appData,
      id: 'app_prod_' + Date.now(),
      totalMinutesUsed: 0,
      totalCreditsEarned: 0,
      isTracking: false,
      activeSeconds: 0,
    };
    setState((prev) => ({
      ...prev,
      productiveApps: [...prev.productiveApps, newApp],
    }));
  };

  const addConsumingApp = (appData: Omit<ConsumingApp, 'id' | 'totalMinutesUsed' | 'totalCreditsConsumed' | 'isTracking' | 'activeSeconds' | 'isBlocked'>) => {
    const newApp: ConsumingApp = {
      ...appData,
      id: 'app_cons_' + Date.now(),
      totalMinutesUsed: 0,
      totalCreditsConsumed: 0,
      isTracking: false,
      activeSeconds: 0,
      isBlocked: false,
    };
    setState((prev) => ({
      ...prev,
      consumingApps: [...prev.consumingApps, newApp],
    }));
  };

  const deleteApp = (appId: string, isProductive: boolean) => {
    setState((prev) => ({
      ...prev,
      productiveApps: isProductive ? prev.productiveApps.filter((a) => a.id !== appId) : prev.productiveApps,
      consumingApps: !isProductive ? prev.consumingApps.filter((a) => a.id !== appId) : prev.consumingApps,
    }));
  };

  // Goals
  const toggleGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id === goalId) {
          const newCompleted = !g.completed;
          return {
            ...g,
            completed: newCompleted,
            streak: newCompleted ? g.streak + 1 : Math.max(0, g.streak - 1),
          };
        }
        return g;
      }),
    }));
  };

  const updateSettings = (newSettings: Partial<FocusSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const addManualCredits = (amount: number, reason: string) => {
    const newTx: CreditTransaction = {
      id: 'tx_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'manual_adjust',
      sourceId: 'manual',
      sourceName: 'تعديل يدوي',
      amount: amount,
      details: reason || 'تعديل رصيد يدوي بواسطة المستخدم',
    };

    setState((prev) => ({
      ...prev,
      credits: Math.max(0, Number((prev.credits + amount).toFixed(1))),
      transactions: [newTx, ...prev.transactions].slice(0, 100),
    }));
  };

  const resetToDefaults = () => {
    setState(INITIAL_FOCUS_STATE);
  };

  const exportDataJson = () => {
    return JSON.stringify(state, null, 2);
  };

  const importDataJson = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed.credits === 'number' && Array.isArray(parsed.habits)) {
        setState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON', e);
    }
    return false;
  };

  return (
    <FocusContext.Provider
      value={{
        state,
        activeConsumingApp,
        activeProductiveApp,
        isBlockedModalOpen,
        blockedAppName,
        closeBlockedModal,
        startProductiveSession,
        stopProductiveSession,
        startConsumingSession,
        stopConsumingSession,
        claimManualHabit,
        logDurationHabit,
        claimFixedHabit,
        addHabit,
        updateHabit,
        deleteHabit,
        updateAppRate,
        addProductiveApp,
        addConsumingApp,
        deleteApp,
        toggleGoal,
        updateSettings,
        addManualCredits,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};
