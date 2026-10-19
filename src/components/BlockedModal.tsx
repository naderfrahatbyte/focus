import React from 'react';
import { useFocus } from '../context/FocusContext';
import { ShieldAlert, Lock, Sparkles, X, ArrowLeft, Layers, BookMarked, Dumbbell, AlertOctagon } from 'lucide-react';

export const BlockedModal: React.FC = () => {
  const { isBlockedModalOpen, blockedAppName, closeBlockedModal, state, startProductiveSession, claimFixedHabit, claimManualHabit } = useFocus();

  if (!isBlockedModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1b0d2a] via-[#140b22] to-[#0c0617] rounded-3xl border border-rose-500/60 p-6 sm:p-7 shadow-2xl shadow-rose-950/80 text-center text-white">
        {/* Close icon */}
        <button
          onClick={closeBlockedModal}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-900/50 animate-bounce">
          <Lock className="w-8 h-8" />
        </div>

        <span className="inline-block text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 border border-rose-700/50 mb-2 uppercase">
          شاشة الحظر الفوري (Focus Blocker)
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          توقف! نفد رصيد التركيز
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          تم حظر الوصول إلى <span className="text-rose-400 font-bold">{blockedAppName || 'التطبيق'}</span> لأن رصيدك المشترك أصبح <span className="font-bold text-amber-300">0.0 رصيد</span>.
        </p>

        <div className="mt-4 p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-xs text-slate-300 text-right leading-relaxed">
          <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            كيف أفتح التطبيق الآن؟
          </div>
          لا يمكنك فتح التطبيقات المقيدة إلا بعد كسب دقائق جديدة عن طريق الأنشطة المنتجة أو إتمام العادات أدناه:
        </div>

        {/* Quick Earn Shortcuts */}
        <div className="mt-4 space-y-2 text-right">
          <button
            onClick={() => {
              const anki = state.productiveApps.find((a) => a.id === 'app_anki');
              if (anki) startProductiveSession(anki.id);
              closeBlockedModal();
            }}
            className="w-full p-2.5 rounded-xl bg-[#231540] hover:bg-[#2c1b50] border border-purple-700/50 flex items-center justify-between text-xs font-bold text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>بدء جلسة استذكار في AnkiDroid</span>
            </div>
            <span className="text-emerald-400 font-bold">+1.0 رصيد/دقيقة</span>
          </button>

          <button
            onClick={() => {
              const quran = state.habits.find((h) => h.id === 'habit_quran');
              if (quran) claimFixedHabit(quran.id);
              closeBlockedModal();
            }}
            className="w-full p-2.5 rounded-xl bg-[#231540] hover:bg-[#2c1b50] border border-purple-700/50 flex items-center justify-between text-xs font-bold text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-purple-400" />
              <span>إتمام ورد القرآن الكريم</span>
            </div>
            <span className="text-amber-300 font-bold">+15.0 رصيد</span>
          </button>

          <button
            onClick={() => {
              const med = state.habits.find((h) => h.id === 'habit_meditation');
              if (med) claimManualHabit(med.id);
              closeBlockedModal();
            }}
            className="w-full p-2.5 rounded-xl bg-[#231540] hover:bg-[#2c1b50] border border-purple-700/50 flex items-center justify-between text-xs font-bold text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>جلسة تأمل وتنفس سريع</span>
            </div>
            <span className="text-blue-300 font-bold">+6.0 رصيد</span>
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={closeBlockedModal}
          className="w-full mt-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
        >
          فهمت ذلك، سأعود للإنتاج الآن
        </button>
      </div>
    </div>
  );
};
