import React from 'react';
import { useFocus } from '../context/FocusContext';
import { Coins, Flame, ArrowUpRight, ArrowDownRight, Square, Play, ShieldAlert, Award, Timer } from 'lucide-react';

export const FocusOverview: React.FC = () => {
  const { state, activeProductiveApp, activeConsumingApp, stopProductiveSession, stopConsumingSession } = useFocus();

  // Calculate totals
  const totalProductiveMinutes = state.productiveApps.reduce((acc, a) => acc + a.totalMinutesUsed, 0);
  const totalConsumingMinutes = state.consumingApps.reduce((acc, a) => acc + a.totalMinutesUsed, 0);
  const totalHabitsCompletedToday = state.habits.reduce((acc, h) => acc + (h.timesCompletedToday || 0), 0);

  const activeApp = activeProductiveApp || activeConsumingApp;
  const isProductive = !!activeProductiveApp;

  return (
    <div className="space-y-4">
      {/* Live Active Session Banner */}
      {activeApp && (
        <div
          className={`p-4 rounded-2xl border transition-all animate-pulse-slow shadow-xl ${
            isProductive
              ? 'bg-gradient-to-r from-emerald-950/80 via-purple-950/70 to-indigo-950/80 border-emerald-500/50 shadow-emerald-950/50'
              : 'bg-gradient-to-r from-rose-950/90 via-purple-950/80 to-amber-950/70 border-rose-500/50 shadow-rose-950/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${
                  isProductive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                }`}
              >
                <Timer className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isProductive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {isProductive ? 'جلسة إنتاج جارية (كسب رصيد)' : 'جلسة مقيدة جارية (استهلاك رصيد)'}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {Math.floor(activeApp.activeSeconds / 60)}:
                    {(activeApp.activeSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{activeApp.name}</h3>
                <p className="text-xs text-slate-300">
                  {isProductive
                    ? `تكسب +${(activeApp as any).creditPerMinute} رصيد لكل دقيقة نشطة`
                    : `تستهلك -${(activeApp as any).costPerMinute} رصيد لكل دقيقة (ينتهي الرصيد بعد ${
                        state.credits > 0 ? (state.credits / (activeApp as any).costPerMinute).toFixed(1) : 0
                      } دقيقة)`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isProductive) stopProductiveSession(activeApp.id);
                else stopConsumingSession(activeApp.id);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>إنهاء الجلسة وحفظ الوقت</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Shared Balance Hero Card */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-[#1b1038] via-[#150d2c] to-[#0d081d] border border-amber-400/40 relative overflow-hidden shadow-xl purple-gold-glow">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-300/90 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                رصيد التركيز المشترك المتاح
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight flex items-baseline gap-2">
                <span className="gold-gradient-text">{state.credits.toFixed(1)}</span>
                <span className="text-sm font-medium text-slate-400">رصيد</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400/30 text-amber-400" />
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            الرصيد مشترك بين جميع المصادر (العادات + التطبيقات المنتجة) ويُخصم تلقائياً عند فتح التطبيقات المقيدة.
            لا يمكن للرصيد أن يصبح سالباً أبداً.
          </p>

          <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-400">الحد اليومي المستهدف:</span>
            <span className="font-bold text-amber-300">
              {state.credits.toFixed(0)} / {state.settings.dailyGoalCredits} رصيد
            </span>
          </div>
        </div>

        {/* Productive Usage Summary */}
        <div className="p-4 rounded-2xl bg-[#140e28] border border-emerald-500/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              وقت الإنتاج اليومي
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalProductiveMinutes.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">دقيقة</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            من Anki وتطبيقات التعلم والمصاحف
          </p>
          <div className="mt-3 pt-2 border-t border-purple-950/60 text-[11px] text-emerald-300 font-medium">
            +{(state.productiveApps.reduce((acc, a) => acc + a.totalCreditsEarned, 0)).toFixed(1)} رصيد مكتسب
          </div>
        </div>

        {/* Consuming Usage Summary */}
        <div className="p-4 rounded-2xl bg-[#140e28] border border-rose-500/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-400 flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" />
              وقت الترفيه اليومي
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalConsumingMinutes.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">دقيقة</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            في التواصل الاجتماعي والألعاب
          </p>
          <div className="mt-3 pt-2 border-t border-purple-950/60 text-[11px] text-rose-300 font-medium">
            -{(state.consumingApps.reduce((acc, a) => acc + a.totalCreditsConsumed, 0)).toFixed(1)} رصيد مستهلك
          </div>
        </div>
      </div>
    </div>
  );
};
