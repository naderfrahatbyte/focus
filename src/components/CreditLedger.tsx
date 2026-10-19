import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { CreditTransaction } from '../types';
import { Clock, ArrowUpRight, ArrowDownRight, Filter, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export const CreditLedger: React.FC = () => {
  const { state } = useFocus();
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent'>('all');

  const filteredTransactions = state.transactions.filter((tx) => {
    if (filterType === 'earned') return tx.amount > 0;
    if (filterType === 'spent') return tx.amount < 0;
    return true;
  });

  const totalEarned = state.transactions
    .filter((tx) => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalSpent = Math.abs(
    state.transactions
      .filter((tx) => tx.amount < 0)
      .reduce((acc, tx) => acc + tx.amount, 0)
  );

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#140e28] border border-purple-900/30">
          <span className="text-xs text-slate-400">إجمالي الرصيد المكتسب بالسجل</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            +{totalEarned.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">رصيد</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140e28] border border-purple-900/30">
          <span className="text-xs text-slate-400">إجمالي الرصيد المصروف بالسجل</span>
          <div className="text-xl font-black text-rose-400 mt-1">
            -{totalSpent.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">رصيد</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140e28] border border-amber-500/30">
          <span className="text-xs text-amber-300/80">صافي التدفق اليومي</span>
          <div className="text-xl font-black text-white mt-1">
            {(totalEarned - totalSpent >= 0 ? '+' : '') + (totalEarned - totalSpent).toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">رصيد</span>
          </div>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              سجل المعاملات والأرصدة (Credit Ledger)
            </h2>
            <span className="text-xs text-slate-400">
              ({filteredTransactions.length} عملية مسجلة)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#1a1233] p-1 rounded-xl border border-purple-900/40 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-purple-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType('earned')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                filterType === 'earned'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              المكتسب
            </button>
            <button
              onClick={() => setFilterType('spent')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                filterType === 'spent'
                  ? 'bg-rose-700 text-white font-bold'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              <ArrowDownRight className="w-3 h-3" />
              المصروف
            </button>
          </div>
        </div>

        {/* Transactions Table / List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد معاملات مسجلة في هذا القسم بعد.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((tx) => {
              const isEarned = tx.amount > 0;

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#160f2e]/70 hover:bg-[#160f2e] border border-purple-900/20 flex items-center justify-between gap-3 transition-colors text-right"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        isEarned
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isEarned ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{tx.sourceName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(tx.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tx.details || (isEarned ? 'كسب رصيد' : 'استهلاك رصيد')}
                      </p>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span
                      className={`text-base font-black ${
                        isEarned ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isEarned ? `+${tx.amount.toFixed(1)}` : `${tx.amount.toFixed(1)}`}
                    </span>
                    <span className="text-[10px] block text-slate-400">رصيد</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
