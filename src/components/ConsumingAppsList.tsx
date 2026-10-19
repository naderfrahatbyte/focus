import React from 'react';
import { useFocus } from '../context/FocusContext';
import { ConsumingApp } from '../types';
import {
  Lock,
  Unlock,
  Play,
  Square,
  MessageCircle,
  Camera,
  Video,
  PlaySquare,
  Gamepad2,
  AlertTriangle,
  Plus,
  Clock,
  Flame,
} from 'lucide-react';

interface ConsumingAppsListProps {
  onOpenAddModal: () => void;
}

export const ConsumingAppsList: React.FC<ConsumingAppsListProps> = ({ onOpenAddModal }) => {
  const { state, startConsumingSession, stopConsumingSession } = useFocus();

  const getAppIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-rose-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-purple-400" />;
      case 'PlaySquare':
        return <PlaySquare className="w-5 h-5 text-red-500" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-amber-400" />;
      default:
        return <Flame className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              التطبيقات المستهلكة (المقيدة)
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40">
                {state.consumingApps.length} تطبيقات
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              تستهلك من الرصيد المشترك، وتُقفل تلقائياً بالكامل عند نفاد الرصيد (الرصيد لا يصبح سالباً)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 text-purple-200 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تقييد تطبيق جديد</span>
        </button>
      </div>

      {/* Warning banner if credits are low */}
      {state.credits <= 5 && (
        <div className="mb-3 p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            تنبيه: رصيدك منخفض جداً ({state.credits.toFixed(1)} رصيد). عند وصول الرصيد إلى 0 سيتم حظر التطبيقات المستهلكة فوراً حتى تنجز عادات جديدة.
          </span>
        </div>
      )}

      {/* Consuming Apps List */}
      <div className="space-y-2.5">
        {state.consumingApps.map((app) => {
          const isTrackingThis = app.isTracking;
          const isAffordable = state.credits > 0;
          const allowedMinutes = isAffordable
            ? (state.credits / app.costPerMinute).toFixed(1)
            : '0';

          return (
            <div
              key={app.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isTrackingThis
                  ? 'bg-gradient-to-r from-rose-950/70 to-purple-950/70 border-rose-500/60 shadow-lg shadow-rose-950/40'
                  : !isAffordable
                  ? 'bg-[#150d26]/40 border-purple-950/40 opacity-75'
                  : 'bg-[#18102e]/60 hover:bg-[#18102e] border-purple-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                    !isAffordable
                      ? 'bg-rose-950/40 border-rose-800/40 text-rose-400'
                      : 'bg-[#21163e] border-purple-800/40'
                  }`}
                >
                  {getAppIcon(app.icon)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{app.name}</span>
                    {isTrackingThis ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                        يستهلك الآن
                      </span>
                    ) : !isAffordable ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900/40 text-rose-300 border border-rose-700/40 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        محظور (رصيد 0)
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
                    <span className="text-rose-400 font-semibold">
                      -{app.costPerMinute} رصيد / دقيقة
                    </span>
                    <span>•</span>
                    <span className="text-amber-300/90 font-medium">
                      رصيدك يكفي لـ: <span className="font-bold underline">{allowedMinutes} دقيقة</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      استُهلك: {app.totalMinutesUsed.toFixed(0)} دقيقة
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full sm:w-auto flex items-center justify-end gap-2">
                {isTrackingThis ? (
                  <button
                    onClick={() => stopConsumingSession(app.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>
                      إيقاف الاستهلاك ({Math.floor(app.activeSeconds / 60)}:
                      {(app.activeSeconds % 60).toString().padStart(2, '0')})
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => startConsumingSession(app.id)}
                    disabled={!isAffordable}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${
                      isAffordable
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white border border-purple-500/30'
                        : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                    }`}
                  >
                    {isAffordable ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-amber-300" />
                        <span>فتح التطبيق بالرصيد</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>محظور (اكسب رصيداً لفتحه)</span>
                      </>
                    )}
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
