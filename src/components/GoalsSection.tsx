import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { GoalItem } from '../types';
import {
  Target,
  CheckCircle2,
  Circle,
  Flame,
  Plus,
  Award,
  Zap,
  BookMarked,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const GoalsSection: React.FC = () => {
  const { state, toggleGoal } = useFocus();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'daily' | 'habits' | 'deep_work' | 'quran' | 'fitness'>('daily');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const completedCount = state.goals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedCount / (state.goals.length || 1)) * 100);

  const filteredGoals = state.goals.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  const handleToggle = (goalId: string, currentStatus: boolean) => {
    toggleGoal(goalId);
    if (!currentStatus) {
      // Trigger celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: GoalItem = {
      id: 'goal_' + Date.now(),
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      completed: false,
      streak: 0,
      targetMinutes: 25,
    };

    state.goals.unshift(newGoal);
    setNewGoalTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Celebration Confetti Banner */}
      {showCelebration && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border border-amber-400 text-center animate-bounce shadow-xl">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>ما شاء الله! أحسنت إنجاز الهدف وزيادة سلسلة الاستمرار! 🎉</span>
          </div>
        </div>
      )}

      {/* Hero Progress Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1d1238] via-[#160d2e] to-[#0f0920] border border-purple-800/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                لوحة «أهدافي» اليومية
              </span>
              <span className="text-xs text-slate-400">إنجاز المهام والعادات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              أنجزت {completedCount} من أصل {state.goals.length} أهداف اليوم
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              الاستمرار اليومي يبني العادات القوية ويزيد رصيد التركيز
            </p>
          </div>

          <div className="text-left shrink-0">
            <div className="text-3xl font-black text-amber-400">{progressPercent}%</div>
            <span className="text-xs text-slate-400">نسبة الإنجاز</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#0a0515] h-2.5 rounded-full overflow-hidden mt-4 border border-purple-900/40">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-amber-400 to-amber-300 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Goals Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#120c24] p-3 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'quran', label: 'القرآن والعبادات' },
            { id: 'deep_work', label: 'التركيز والتعلم' },
            { id: 'fitness', label: 'اللياقة والصحة' },
            { id: 'daily', label: 'عادات يومية' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-purple-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>هدف جديد</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <form onSubmit={handleAddGoal} className="p-4 rounded-2xl bg-[#181030] border border-purple-700/50 space-y-3">
          <h3 className="text-xs font-bold text-amber-300">إضافة هدف أو مهمة جديدة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="عنوان الهدف، مثلاً: قراءة 20 صفحة من كتاب"
              className="sm:col-span-2 bg-[#120a24] border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <select
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value as any)}
              className="bg-[#120a24] border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="daily">عادات يومية</option>
              <option value="quran">القرآن والعبادات</option>
              <option value="deep_work">التركيز والتعلم</option>
              <option value="fitness">اللياقة والصحة</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs"
            >
              حفظ الهدف
            </button>
          </div>
        </form>
      )}

      {/* Goals Checklist List */}
      <div className="space-y-2">
        {filteredGoals.map((goal) => {
          return (
            <div
              key={goal.id}
              onClick={() => handleToggle(goal.id, goal.completed)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                goal.completed
                  ? 'bg-[#140f26]/60 border-purple-900/30 opacity-80'
                  : 'bg-[#160f2e] hover:bg-[#1a1236] border-purple-800/30 shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    goal.completed
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'border-2 border-purple-600 hover:border-amber-400 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </button>

                <div>
                  <h3
                    className={`text-sm font-bold ${
                      goal.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {goal.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="text-purple-300">
                      {goal.category === 'quran' && 'قرآن وعبادات'}
                      {goal.category === 'deep_work' && 'تركيز ودراسة'}
                      {goal.category === 'fitness' && 'صحة ورياضة'}
                      {goal.category === 'daily' && 'عادة يومية'}
                    </span>
                    {goal.linkedFocusId && (
                      <span className="text-amber-400/90 font-medium flex items-center gap-0.5">
                        <Zap className="w-3 h-3 text-amber-400" />
                        مرتبط بنظام Focus
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Streak Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/70 border border-purple-800/40 text-xs font-bold text-amber-300 shrink-0">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{goal.streak} يوم</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
