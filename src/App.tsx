/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FocusProvider } from './context/FocusContext';
import { Header } from './components/Header';
import { FocusOverview } from './components/FocusOverview';
import { ProductiveAppsList } from './components/ProductiveAppsList';
import { HabitsRewardList } from './components/HabitsRewardList';
import { ConsumingAppsList } from './components/ConsumingAppsList';
import { GoalsSection } from './components/GoalsSection';
import { CreditLedger } from './components/CreditLedger';
import { SettingsTab } from './components/SettingsTab';
import { AndroidNativeGuide } from './components/AndroidNativeGuide';
import { BlockedModal } from './components/BlockedModal';
import { AddHabitModal } from './components/AddHabitModal';
import { AddAppModal } from './components/AddAppModal';
import { HabitReward } from './types';
import { Zap, ShieldAlert, Sparkles, BookOpen, Layers } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'focus' | 'goals' | 'ledger' | 'settings' | 'android'>('focus');
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<HabitReward | null>(null);
  const [isAddAppOpen, setIsAddAppOpen] = useState(false);
  const [addAppType, setAddAppType] = useState<'productive' | 'consuming'>('productive');

  const handleOpenAddHabit = () => {
    setHabitToEdit(null);
    setIsAddHabitOpen(true);
  };

  const handleEditHabit = (habit: HabitReward) => {
    setHabitToEdit(habit);
    setIsAddHabitOpen(true);
  };

  const handleOpenAddApp = (type: 'productive' | 'consuming') => {
    setAddAppType(type);
    setIsAddAppOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0717] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Top Header with navigation & real-time balance badge */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Tab 1: FOCUS System (التركيز واقتصاد الهاتف) */}
        {activeTab === 'focus' && (
          <div className="space-y-6 animate-fade-in">
            {/* Overview & Live Session Ticker */}
            <FocusOverview />

            {/* Sources of Earning: Productive Apps & Habits */}
            <div className="space-y-6">
              {/* Productive Apps */}
              <ProductiveAppsList onOpenAddModal={() => handleOpenAddApp('productive')} />

              {/* Habits Rewards */}
              <HabitsRewardList
                onOpenAddModal={handleOpenAddHabit}
                onEditHabit={handleEditHabit}
              />
            </div>

            {/* Consuming Apps (Restricted) */}
            <ConsumingAppsList onOpenAddModal={() => handleOpenAddApp('consuming')} />
          </div>
        )}

        {/* Tab 2: GOALS (أهدافي اليومية والعادات) */}
        {activeTab === 'goals' && (
          <div className="animate-fade-in">
            <GoalsSection />
          </div>
        )}

        {/* Tab 3: LEDGER (سجل المعاملات والملخص) */}
        {activeTab === 'ledger' && (
          <div className="animate-fade-in">
            <CreditLedger />
          </div>
        )}

        {/* Tab 4: SETTINGS (الأسعار والإعدادات وحفظ البيانات) */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <SettingsTab />
          </div>
        )}

        {/* Tab 5: ANDROID NATIVE GUIDE (تقرير الحظر الفعلي وكود أندرويد) */}
        {activeTab === 'android' && (
          <div className="animate-fade-in">
            <AndroidNativeGuide />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <BlockedModal />

      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        habitToEdit={habitToEdit}
      />

      <AddAppModal
        isOpen={isAddAppOpen}
        onClose={() => setIsAddAppOpen(false)}
        defaultType={addAppType}
      />

      {/* Bottom Footer */}
      <footer className="mt-auto border-t border-purple-950/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>تطبيق «أهدافي» مع قسم Focus • نظام اقتصادي متكامل لرصيد الهاتف</span>
          <span className="text-amber-400/80 font-medium">
            حفظ محلي مستمر • حماية من احتساب وقت الخلفية • رصيد غير قابل للسالب
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <FocusProvider>
      <MainApp />
    </FocusProvider>
  );
}
