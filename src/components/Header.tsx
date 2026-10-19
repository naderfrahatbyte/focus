import React from 'react';
import { useFocus } from '../context/FocusContext';
import { Sparkles, ShieldAlert, Target, Zap, Clock, Settings, Smartphone, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'focus' | 'goals' | 'ledger' | 'settings' | 'android';
  setActiveTab: (tab: 'focus' | 'goals' | 'ledger' | 'settings' | 'android') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { state, activeConsumingApp, activeProductiveApp } = useFocus();

  const isAnyActive = activeProductiveApp || activeConsumingApp;

  return (
    <header className="sticky top-0 z-40 bg-[#0d091e]/90 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-purple-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-900/40 border border-amber-300/30">
              <Zap className="w-5 h-5 text-amber-200 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  أهدافي <span className="text-amber-400 font-black">Focus</span>
                </h1>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/50">
                  اقتصاد الهاتف
                </span>
              </div>
              <p className="text-xs text-slate-400">
                اكسب الرصيد بالعادات والتطبيقات النافعة، واضبط وقتك
              </p>
            </div>
          </div>

          {/* Real-time Balance Chip */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {isAnyActive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-600/40 text-xs text-purple-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>
                  {activeProductiveApp ? `كسب رصيد: ${activeProductiveApp.name.split(' ')[0]}` : `استهلاك: ${activeConsumingApp?.name.split(' ')[0]}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/90 via-[#1e1238] to-purple-900/70 border border-amber-400/40 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <div className="text-right">
                <div className="text-[10px] text-amber-300/80 font-medium">الرصيد المشترك</div>
                <div className="text-lg font-black tracking-tight text-white flex items-baseline gap-1">
                  <span className="gold-gradient-text">{state.credits.toFixed(1)}</span>
                  <span className="text-xs font-normal text-slate-300">نقطة رصيد</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar border-t border-purple-950/60 pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'focus'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-md shadow-purple-900/50 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>نظام Focus والرصيد</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'goals'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-md shadow-purple-900/50 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Target className="w-4 h-4 text-purple-300" />
            <span>أهدافي اليومية ({state.goals.filter((g) => g.completed).length}/{state.goals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'ledger'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-md shadow-purple-900/50 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span>سجل المعاملات والملخص</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-md shadow-purple-900/50 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>تخصيص الأسعار والإعدادات</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md shadow-amber-900/40 border border-amber-400/40'
                : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/30'
            }`}
          >
            <Smartphone className="w-4 h-4 text-amber-300" />
            <span>الربط مع أندرويد & الحظر الفعلي</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
