import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { HabitReward } from '../types';
import {
  Sparkles,
  BookMarked,
  Dumbbell,
  Footprints,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
} from 'lucide-react';

interface HabitsRewardListProps {
  onOpenAddModal: () => void;
  onEditHabit: (habit: HabitReward) => void;
}

export const HabitsRewardList: React.FC<HabitsRewardListProps> = ({ onOpenAddModal, onEditHabit }) => {
  const { state, claimManualHabit, logDurationHabit, claimFixedHabit, deleteHabit } = useFocus();

  // State for duration input on specific habit
  const [durationInputs, setDurationInputs] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookMarked':
        return <BookMarked className="w-5 h-5 text-amber-400" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-purple-400" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleManualClaim = (habit: HabitReward) => {
    const res = claimManualHabit(habit.id);
    showToast(res.message);
  };

  const handleFixedClaim = (habit: HabitReward) => {
    const res = claimFixedHabit(habit.id);
    showToast(res.message);
  };

  const handleDurationLog = (habit: HabitReward, minutes: number) => {
    const res = logDurationHabit(habit.id, minutes);
    showToast(res.message);
    setDurationInputs((prev) => ({ ...prev, [habit.id]: 0 }));
  };

  return (
    <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 sm:p-5 shadow-lg relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-amber-400/60 text-white text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              العادات المنتجة (طرق كسب الرصيد)
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40">
                {state.habits.length} عادات
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              تسجيل يدوي، احتساب بالدقائق، أو مكافأة ثابتة عند إتمام العادة
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة عادة جديدة</span>
        </button>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.habits.map((habit) => {
          const isDoneToday = habit.timesCompletedToday > 0;
          const currentDurationInput = durationInputs[habit.id] || 20;

          return (
            <div
              key={habit.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDoneToday
                  ? 'bg-gradient-to-br from-[#191133] to-[#140e29] border-purple-800/40'
                  : 'bg-[#160f2e]/80 hover:bg-[#160f2e] border-purple-900/20'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#231742] border border-purple-800/40 flex items-center justify-center shadow-inner">
                      {getHabitIcon(habit.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">{habit.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-purple-300/80 font-medium">
                          {habit.category}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] font-semibold text-amber-300">
                          {habit.rewardType === 'manual' && `تسجيل يدوي: +${habit.manualReward} رصيد`}
                          {habit.rewardType === 'duration' && `بالدقائق: +${habit.ratePerMinute} رصيد / دقيقة`}
                          {habit.rewardType === 'fixed' && `مكافأة ثابتة: +${habit.fixedReward} رصيد`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditHabit(habit)}
                      title="تعديل العادة"
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {habit.isCustom && (
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        title="حذف العادة"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {habit.notes && (
                  <p className="text-xs text-slate-400 mt-2 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-900/30">
                    {habit.notes}
                  </p>
                )}
              </div>

              {/* Action Area based on Reward Type */}
              <div className="mt-4 pt-3 border-t border-purple-950/80">
                {/* 1. Manual Check-in */}
                {habit.rewardType === 'manual' && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-400">
                      إنجاز اليوم: <span className="font-bold text-white">{habit.timesCompletedToday}</span>
                      {habit.maxPerDay ? ` / ${habit.maxPerDay}` : ''}
                    </div>

                    <button
                      onClick={() => handleManualClaim(habit)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-950/40 flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>تسجيل الإنجاز (+{habit.manualReward} رصيد)</span>
                    </button>
                  </div>
                )}

                {/* 2. Duration-based calculation */}
                {habit.rewardType === 'duration' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-slate-400 text-[11px] whitespace-nowrap">مدة سريعة:</span>
                      {[15, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => handleDurationLog(habit, mins)}
                          className="px-2 py-0.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[11px] font-semibold border border-purple-700/30 transition-colors"
                        >
                          +{mins}د (={Number((mins * (habit.ratePerMinute || 1)).toFixed(1))}ر)
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max="300"
                          value={currentDurationInput || ''}
                          onChange={(e) =>
                            setDurationInputs((prev) => ({
                              ...prev,
                              [habit.id]: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="المدة بالدقائق"
                          className="w-full bg-[#1e1338] border border-purple-800/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute left-2.5 top-1.5 text-[11px] text-slate-400">
                          دقيقة
                        </span>
                      </div>

                      <button
                        onClick={() => handleDurationLog(habit, currentDurationInput)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center gap-1 transition-transform active:scale-95 whitespace-nowrap"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>احتساب (+{Number((currentDurationInput * (habit.ratePerMinute || 1)).toFixed(1))} رصيد)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Fixed Reward upon Completion */}
                {habit.rewardType === 'fixed' && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-400">
                      مكافأة ثابتة كاملة:{' '}
                      <span className="font-bold text-amber-300">+{habit.fixedReward} رصيد</span>
                    </div>

                    <button
                      onClick={() => handleFixedClaim(habit)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-950/40 flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>إتمام العادة واستلام المكافأة</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
