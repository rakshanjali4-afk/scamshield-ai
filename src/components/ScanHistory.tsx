import React, { useState } from 'react';
import { History, Trash2, Search, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Calendar, Filter } from 'lucide-react';
import { ScanResult } from '../types';

interface ScanHistoryProps {
  scanHistory: ScanResult[];
  onViewReport: (result: ScanResult) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  scanHistory,
  onViewReport,
  onDeleteScan,
  onClearHistory,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHistory = scanHistory.filter((item) => {
    const matchesFilter = filterLevel === 'ALL' || item.riskLevel === filterLevel;
    const matchesSearch =
      item.inputSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scamCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Scan History</h1>
              <p className="text-sm text-slate-400">Review your past scam checks and fraud risk assessments.</p>
            </div>
          </div>

          {scanHistory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all scan history?')) {
                  onClearHistory();
                }
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 hover:bg-rose-900/50 text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous scans by content or category..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterLevel === level
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {level === 'ALL' ? 'All Risks' : `${level}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No Scans Found</h3>
          <p className="text-sm text-slate-400">
            {scanHistory.length === 0 ? 'You have not scanned any messages or screenshots yet.' : 'No scans match your current search or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((scan) => {
            const isHigh = scan.riskLevel === 'HIGH';
            const isMed = scan.riskLevel === 'MEDIUM';
            return (
              <div
                key={scan.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isHigh
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        : isMed
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    {isHigh ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : isMed ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isHigh
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : isMed
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {scan.riskLevel} RISK ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {scan.scamCategory}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(scan.timestamp).toLocaleDateString()} {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium truncate max-w-xl">
                      {scan.inputSnippet}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {scan.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => onViewReport(scan)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600 hover:text-white text-xs font-semibold transition-all"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteScan(scan.id)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
