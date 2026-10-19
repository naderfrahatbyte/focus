import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { X, Layers, Lock, Sparkles } from 'lucide-react';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'productive' | 'consuming';
}

export const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose, defaultType = 'productive' }) => {
  const { addProductiveApp, addConsumingApp } = useFocus();

  const [type, setType] = useState<'productive' | 'consuming'>(defaultType);
  const [name, setName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [rate, setRate] = useState(type === 'productive' ? 1.0 : 2.0);
  const [icon, setIcon] = useState(type === 'productive' ? 'Layers' : 'MessageCircle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (type === 'productive') {
      addProductiveApp({
        name: name.trim(),
        packageName: packageName.trim() || `com.example.${Date.now()}`,
        icon: icon || 'Layers',
        creditPerMinute: Number(rate),
      });
    } else {
      addConsumingApp({
        name: name.trim(),
        packageName: packageName.trim() || `com.example.${Date.now()}`,
        icon: icon || 'Flame',
        costPerMinute: Number(rate),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#140c26] rounded-3xl border border-purple-800/60 p-6 shadow-2xl text-right">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {type === 'productive' ? (
              <Sparkles className="w-5 h-5 text-emerald-400" />
            ) : (
              <Lock className="w-5 h-5 text-rose-400" />
            )}
            <span>{type === 'productive' ? 'إضافة تطبيق منتج (كسب)' : 'تقييد تطبيق مستهلك (تكلفة)'}</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* App Type Switch */}
          <div className="grid grid-cols-2 gap-2 bg-[#1b1133] p-1 rounded-xl border border-purple-900/40 text-xs">
            <button
              type="button"
              onClick={() => {
                setType('productive');
                setRate(1.0);
              }}
              className={`py-2 rounded-lg font-bold transition-colors ${
                type === 'productive'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تطبيق منتج (يكسب رصيد)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('consuming');
                setRate(2.0);
              }}
              className={`py-2 rounded-lg font-bold transition-colors ${
                type === 'consuming'
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تطبيق مقيد (يستهلك رصيد)
            </button>
          </div>

          {/* App Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم التطبيق
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'productive' ? 'مثال: Anki, Notion, القرآن الكريم...' : 'مثال: سناب شات، ريديت، تيك توك...'}
              className="w-full bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Rate per minute */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {type === 'productive' ? 'كم رصيد تكسبه لكل دقيقة؟' : 'كم رصيد تستهلكه لكل دقيقة تصفح؟'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="20"
                required
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 1)}
                className="w-32 bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
              <span className="text-xs text-slate-400">
                {type === 'productive' ? 'رصيد مكتسب / دقيقة' : 'رصيد مخصوم / دقيقة'}
              </span>
            </div>
          </div>

          {/* Package Name (For Android Matching) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم حزمة أندرويد (Package Name - اختياري للربط بالنظام)
            </label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="مثال: com.snapchat.android"
              className="w-full bg-[#1b1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-left"
              dir="ltr"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              يُستخدم في كود أندرويد الأصلي لمعرفة التطبيق المفتوح وحظره عند نفاد الرصيد.
            </p>
          </div>

          {/* Submit */}
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
              className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-lg transition-transform active:scale-95 ${
                type === 'productive'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              حفظ وإضافة التطبيق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
