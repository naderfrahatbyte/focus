import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import {
  Settings,
  Coins,
  ShieldAlert,
  Save,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  Sliders,
  Trash2,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    state,
    updateAppRate,
    deleteApp,
    updateSettings,
    addManualCredits,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useFocus();

  const [manualAmount, setManualAmount] = useState<number>(10);
  const [manualReason, setManualReason] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportArea, setShowImportArea] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleExport = () => {
    const data = exportDataJson();
    navigator.clipboard.writeText(data);
    notify('تم نسخ كود النسخ الاحتياطي (JSON) إلى الحافظة بنجاح!');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJson(importJsonText);
    if (ok) {
      notify('تمت استعادة البيانات بنجاح!');
      setShowImportArea(false);
      setImportJsonText('');
    } else {
      notify('خطأ: صيغة JSON غير صالحة');
    }
  };

  return (
    <div className="space-y-5">
      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-purple-900 border border-amber-400 text-white text-xs font-bold shadow-2xl animate-fade-in">
          {feedback}
        </div>
      )}

      {/* Hero Banner */}
      <div className="p-4 rounded-2xl bg-[#140e28] border border-purple-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">إعدادات أسعار الرصيد واقتصاد الهاتف</h2>
            <p className="text-xs text-slate-400">
              تحكم في معدلات الكسب والاستهلاك، والتخزين المحلي، وحماية الوقت
            </p>
          </div>
        </div>
      </div>

      {/* Rates Customization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Productive Apps Rates */}
        <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              تعديل أسعار التطبيقات المنتجة (كسب)
            </h3>
            <span className="text-[11px] text-slate-400">رصيد لكل دقيقة</span>
          </div>

          <div className="space-y-2">
            {state.productiveApps.map((app) => (
              <div
                key={app.id}
                className="p-2.5 rounded-xl bg-[#18102e] border border-purple-900/20 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-medium text-white truncate max-w-[150px]">
                  {app.name}
                </span>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={app.creditPerMinute}
                    onChange={(e) =>
                      updateAppRate(app.id, true, parseFloat(e.target.value) || 1)
                    }
                    className="w-16 bg-[#120a22] border border-purple-800/40 rounded-lg px-2 py-1 text-xs text-center text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400">ر/د</span>
                  <button
                    onClick={() => deleteApp(app.id, true)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consuming Apps Costs */}
        <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
            <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              تعديل تكلفة التطبيقات المقيدة (استهلاك)
            </h3>
            <span className="text-[11px] text-slate-400">رصيد لكل دقيقة</span>
          </div>

          <div className="space-y-2">
            {state.consumingApps.map((app) => (
              <div
                key={app.id}
                className="p-2.5 rounded-xl bg-[#18102e] border border-purple-900/20 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-medium text-white truncate max-w-[150px]">
                  {app.name}
                </span>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={app.costPerMinute}
                    onChange={(e) =>
                      updateAppRate(app.id, false, parseFloat(e.target.value) || 1)
                    }
                    className="w-16 bg-[#120a22] border border-purple-800/40 rounded-lg px-2 py-1 text-xs text-center text-rose-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400">ر/د</span>
                  <button
                    onClick={() => deleteApp(app.id, false)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prevention & System Controls */}
      <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 sm:p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          ضوابط الدقة ومنع احتساب الوقت غير الفعلي
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Background Prevention Switch */}
          <div className="p-3.5 rounded-xl bg-[#160e2e] border border-purple-900/30 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">منع احتساب الوقت في الخلفية</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                إيقاف مؤقت الجلسات تلقائياً عند تصغير التطبيق أو مغادرة الشاشة
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  preventBackgroundCounting: !state.settings.preventBackgroundCounting,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                state.settings.preventBackgroundCounting ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  state.settings.preventBackgroundCounting ? 'left-1' : 'right-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Strict Blocking Mode */}
          <div className="p-3.5 rounded-xl bg-[#160e2e] border border-purple-900/30 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">نمط الحظر الصارم اللحظي</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                إظهار شاشة القفل فوراً عند ملامسة الرصيد للصفر وإيقاف التطبيق المقيد
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  strictBlockingMode: !state.settings.strictBlockingMode,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                state.settings.strictBlockingMode ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  state.settings.strictBlockingMode ? 'left-1' : 'right-1'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Manual Adjustments */}
        <div className="pt-3 border-t border-purple-900/30">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            تعديل الرصيد يدوياً (مكافأة استثنائية أو تسوية)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={manualReason}
              onChange={(e) => setManualReason(e.target.value)}
              placeholder="سبب التعديل، مثلاً: جلسة قراءة بدون هاتف"
              className="flex-1 bg-[#1a1133] border border-purple-800/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-auto"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(parseFloat(e.target.value) || 0)}
                className="w-20 bg-[#1a1133] border border-purple-800/40 rounded-xl px-2 py-2 text-xs text-center text-white focus:outline-none focus:border-amber-400 font-bold"
              />
              <button
                onClick={() => {
                  addManualCredits(manualAmount, manualReason);
                  setManualReason('');
                  notify(`تمت إضافة +${manualAmount} رصيد للمحفظة`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
              <button
                onClick={() => {
                  addManualCredits(-manualAmount, manualReason || 'خصم رصيد يدوي');
                  setManualReason('');
                  notify(`تم خصم -${manualAmount} رصيد من المحفظة`);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>خصم</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup and Storage Section */}
      <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 sm:p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          حفظ البيانات والنسخ الاحتياطي (LocalStorage)
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          يتم حفظ رصيدك وسجلاتك وجميع العادات تلقائياً في التخزين الدائم للجهاز، بحيث لا تضيع عند إغلاق التطبيق أو إعادة تشغيل الهاتف.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-700/50 text-purple-200 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>نسخ ملف احتياطي (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-indigo-200 text-xs font-semibold"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد نسخة احتياطية</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من إعادة تعيين التطبيق للإعدادات الأولية؟')) {
                resetToDefaults();
                notify('تمت إعادة تعيين البيانات للافتراضي');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>
        </div>

        {showImportArea && (
          <div className="p-3 rounded-xl bg-[#160e2e] border border-purple-800/40 space-y-2 mt-2">
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="ألصق كود الـ JSON هنا..."
              className="w-full bg-[#120a24] border border-purple-900/50 rounded-xl p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
              dir="ltr"
            />
            <button
              onClick={handleImport}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              تأكيد الاستيراد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
