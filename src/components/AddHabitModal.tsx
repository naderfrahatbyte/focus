import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { HabitReward, HabitRewardType } from '../types';
import { X, Award, Sparkles, BookOpen, Dumbbell, Footprints, BookMarked, Check } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: HabitReward | null;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, habitToEdit }) => {
  const { addHabit, updateHabit } = useFocus();

  const [name, setName] = useState(habitToEdit?.name || '');
  const [category, setCategory] = useState(habitToEdit?.category || 'صحة ورياضة');
  const [icon, setIcon] = useState(habitToEdit?.icon || 'Dumbbell');
  const [rewardType, setRewardType] = useState<HabitRewardType>(habitToEdit?.rewardType || 'duration');
  const [ratePerMinute, setRatePerMinute] = useState(habitToEdit?.ratePerMinute || 1.0);
  const [fixedReward, setFixedReward] = useState(habitToEdit?.fixedReward || 15.0);
  const [manualReward, setManualReward] = useState(habitToEdit?.manualReward || 5.0);
  const [notes, setNotes] = useState(habitToEdit?.notes || '');
  const [maxPerDay, setMaxPerDay] = useState(habitToEdit?.maxPerDay || 2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (habitToEdit) {
      updateHabit({
        ...habitToEdit,
        name: name.trim(),
        category,
        icon,
        rewardType,
        ratePerMinute: rewardType === 'duration' ? Number(ratePerMinute) : undefined,
        fixedReward: rewardType === 'fixed' ? Number(fixedReward) : undefined,
        manualReward: rewardType === 'manual' ? Number(manualReward) : undefined,
        notes: notes.trim(),
        maxPerDay: Number(maxPerDay),
      });
    } else {
      addHabit({
        name: name.trim(),
        category,
        icon,
        rewardType,
        ratePerMinute: rewardType === 'duration' ? Number(ratePerMinute) : undefined,
        fixedReward: rewardType === 'fixed' ? Number(fixedReward) : undefined,
        manualReward: rewardType === 'manual' ? Number(manualReward) : undefined,
        notes: notes.trim(),
        maxPerDay: Number(maxPerDay),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#140c26] rounded-3xl border border-purple-800/60 p-6 shadow-2xl text-right">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{habitToEdit ? 'تعديل العادة المنتجة' : 'إضافة عادة منتجة جديدة'}</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم العادة
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: قراءة القرآن، المشي، التأمل، تمرين رياضي..."
              className="w-full bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category & Icon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="صحة ورياضة">صحة ورياضة</option>
                <option value="عبادات">عبادات وقرآن</option>
                <option value="تطوير ذات">تطوير ذات</option>
                <option value="صحة نفسية">صحة نفسية وتأمل</option>
                <option value="دراسة وتعلم">دراسة وتعلم</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الأيقونة
              </label>
              <div className="flex items-center gap-1.5 bg-[#1b1133] p-1 rounded-xl border border-purple-800/40">
                {[
                  { id: 'Dumbbell', icon: <Dumbbell className="w-4 h-4 text-purple-400" /> },
                  { id: 'BookMarked', icon: <BookMarked className="w-4 h-4 text-amber-400" /> },
                  { id: 'Footprints', icon: <Footprints className="w-4 h-4 text-emerald-400" /> },
                  { id: 'Sparkles', icon: <Sparkles className="w-4 h-4 text-amber-300" /> },
                  { id: 'BookOpen', icon: <BookOpen className="w-4 h-4 text-blue-400" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`flex-1 p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                      icon === item.id ? 'bg-purple-700/80 border border-amber-400/40' : 'hover:bg-purple-900/40'
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reward Method (The core requirement) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              طريقة احتساب المكافأة (اختر أحد الخيارات الـ 3)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRewardType('duration')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  rewardType === 'duration'
                    ? 'bg-purple-900/70 border-amber-400 text-white font-bold shadow-md'
                    : 'bg-[#1a1130] border-purple-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">بالدقائق</div>
                <div className="text-[10px] text-slate-400 mt-0.5">رصيد لكل دقيقة</div>
              </button>

              <button
                type="button"
                onClick={() => setRewardType('fixed')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  rewardType === 'fixed'
                    ? 'bg-purple-900/70 border-amber-400 text-white font-bold shadow-md'
                    : 'bg-[#1a1130] border-purple-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">مكافأة ثابتة</div>
                <div className="text-[10px] text-slate-400 mt-0.5">عند إتمام العادة</div>
              </button>

              <button
                type="button"
                onClick={() => setRewardType('manual')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  rewardType === 'manual'
                    ? 'bg-purple-900/70 border-amber-400 text-white font-bold shadow-md'
                    : 'bg-[#1a1130] border-purple-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">تسجيل يدوي</div>
                <div className="text-[10px] text-slate-400 mt-0.5">رصيد عند الضغط</div>
              </button>
            </div>
          </div>

          {/* Value Inputs Based on Reward Type */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
            {rewardType === 'duration' && (
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  كم رصيد تكسبه لكل دقيقة تمرين أو مشي أو قراءة؟
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={ratePerMinute}
                    onChange={(e) => setRatePerMinute(parseFloat(e.target.value) || 1)}
                    className="w-32 bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <span className="text-xs text-slate-300">
                    رصيد / دقيقة (مثال: 30 دقيقة = {Number((30 * ratePerMinute).toFixed(1))} رصيد)
                  </span>
                </div>
              </div>
            )}

            {rewardType === 'fixed' && (
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  المكافأة الثابتة عند إتمام العادة بالكامل
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    value={fixedReward}
                    onChange={(e) => setFixedReward(parseFloat(e.target.value) || 10)}
                    className="w-32 bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <span className="text-xs text-slate-300">
                    رصيد يُضاف فوراً للمحفظة المشتركة
                  </span>
                </div>
              </div>
            )}

            {rewardType === 'manual' && (
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  مكافأة التسجيل اليدوي عند النقر
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="50"
                    value={manualReward}
                    onChange={(e) => setManualReward(parseFloat(e.target.value) || 5)}
                    className="w-32 bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <span className="text-xs text-slate-300">
                    رصيد لكل تسجيل إنجاز
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Daily Limit & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الحد الأقصى لمرات الإنجاز يومياً
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxPerDay}
                onChange={(e) => setMaxPerDay(parseInt(e.target.value) || 1)}
                className="w-full bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ملاحظات أو وصف إرشادي
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تفاصيل العادة..."
                className="w-full bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95"
            >
              {habitToEdit ? 'حفظ التعديلات' : 'إضافة العادة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
