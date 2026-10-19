import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { ProductiveApp } from '../types';
import { Play, Square, Layers, Globe, GraduationCap, BookOpen, Plus, Clock, Sparkles } from 'lucide-react';

interface ProductiveAppsListProps {
  onOpenAddModal: () => void;
}

export const ProductiveAppsList: React.FC<ProductiveAppsListProps> = ({ onOpenAddModal }) => {
  const { state, startProductiveSession, stopProductiveSession } = useFocus();

  const getAppIcon = (name: string, iconKey: string) => {
    switch (iconKey) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      default:
        return <Layers className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              التطبيقات المنتجة (كسب الرصيد)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                {state.productiveApps.length} تطبيقات
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              استخدام فعلي بالدقيقة يكسبك رصيداً فورياً في محفظتك المشتركة
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 text-purple-200 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة تطبيق</span>
        </button>
      </div>

      {/* List of Productive Apps */}
      <div className="space-y-2.5">
        {state.productiveApps.map((app) => {
          const isTrackingThis = app.isTracking;

          return (
            <div
              key={app.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isTrackingThis
                  ? 'bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                  : 'bg-[#18102e]/60 hover:bg-[#18102e] border-purple-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#21163e] border border-purple-800/40 flex items-center justify-center shadow-inner">
                  {getAppIcon(app.name, app.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{app.name}</span>
                    {isTrackingThis && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        جلسة جارية
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-semibold">
                      +{app.creditPerMinute} رصيد / دقيقة
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      إجمالي: {app.totalMinutesUsed.toFixed(0)} دقيقة
                    </span>
                    <span>•</span>
                    <span className="text-amber-300/80">
                      كسب: +{app.totalCreditsEarned.toFixed(0)} رصيد
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full sm:w-auto flex items-center justify-end gap-2">
                {isTrackingThis ? (
                  <button
                    onClick={() => stopProductiveSession(app.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>
                      إيقاف ({Math.floor(app.activeSeconds / 60)}:
                      {(app.activeSeconds % 60).toString().padStart(2, '0')})
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => startProductiveSession(app.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>بدء الاستخدام وكسب الرصيد</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
