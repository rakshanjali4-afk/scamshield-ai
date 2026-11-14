import React from 'react';
import { ShieldAlert, ShieldCheck, MessageSquareText, ImageUp, ArrowRight, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Shield, Lock } from 'lucide-react';
import { ScanResult, ActiveTab } from '../types';
import { SAMPLE_SCAMS, SampleScam } from '../data/sampleScams';

interface DashboardProps {
  scanHistory: ScanResult[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSample: (sampleText: string) => void;
  onViewReport: (result: ScanResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  scanHistory,
  setActiveTab,
  onSelectSample,
  onViewReport,
}) => {
  const totalScans = scanHistory.length;
  const highRiskCount = scanHistory.filter((s) => s.riskLevel === 'HIGH').length;
  const mediumRiskCount = scanHistory.filter((s) => s.riskLevel === 'MEDIUM').length;
  const safeCount = scanHistory.filter((s) => s.riskLevel === 'LOW').length;

  const handleTestSample = (sample: SampleScam) => {
    onSelectSample(sample.text);
    setActiveTab('message-scanner');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Powered by Gemini AI Fraud Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Protect Yourself from Digital Frauds & Scams
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            Instantly analyze suspicious SMS messages, WhatsApp chats, phishing emails, payment links, and fraudulent screenshots using advanced AI cybersecurity analysis.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('message-scanner')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquareText className="w-5 h-5" />
              <span>Scan Suspicious Message</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => setActiveTab('screenshot-scanner')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700/80 transition-all hover:text-white"
            >
              <ImageUp className="w-5 h-5 text-cyan-400" />
              <span>Scan Screenshot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-medium text-slate-400 mb-1">Total Scans</p>
            <h3 className="text-3xl font-extrabold text-white">{totalScans}</h3>
            <p className="text-xs text-slate-500 mt-1">Saved locally on device</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-medium text-slate-400 mb-1">High-Risk Threats</p>
            <h3 className="text-3xl font-extrabold text-rose-400">{highRiskCount}</h3>
            <p className="text-xs text-rose-500/80 mt-1">Potential scam alerts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-medium text-slate-400 mb-1">Medium Risk</p>
            <h3 className="text-3xl font-extrabold text-amber-400">{mediumRiskCount}</h3>
            <p className="text-xs text-amber-500/80 mt-1">Proceed with caution</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-medium text-slate-400 mb-1">Safe Messages</p>
            <h3 className="text-3xl font-extrabold text-emerald-400">{safeCount}</h3>
            <p className="text-xs text-emerald-500/80 mt-1">Verified legitimate</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Scans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Recent Scan History</span>
              </h2>
              {scanHistory.length > 0 && (
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View All ({scanHistory.length}) &rarr;
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-1">No Scans Recorded Yet</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Paste a suspicious text message or upload a screenshot to run your first AI scam analysis.
                </p>
                <button
                  onClick={() => setActiveTab('message-scanner')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-colors"
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>Start First Scan</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {scanHistory.slice(0, 4).map((scan) => {
                  const isHigh = scan.riskLevel === 'HIGH';
                  const isMed = scan.riskLevel === 'MEDIUM';
                  return (
                    <div
                      key={scan.id}
                      onClick={() => onViewReport(scan)}
                      className="group flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start space-x-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isHigh
                              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                              : isMed
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isHigh ? (
                            <ShieldAlert className="w-5 h-5" />
                          ) : isMed ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : (
                            <ShieldCheck className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                isHigh
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : isMed
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {scan.riskLevel} RISK ({scan.riskScore}/100)
                            </span>
                            <span className="text-xs text-slate-400">
                              {scan.scamCategory}
                            </span>
                          </div>
                          <p className="text-sm text-slate-200 truncate max-w-md">
                            {scan.inputSnippet}
                          </p>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            {new Date(scan.timestamp).toLocaleString()} • {scan.inputType.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-3" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Test Sample Scams */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>Quick Test Samples</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Click any common scam template below to instantly load and analyze it in the Message Scanner.
            </p>

            <div className="space-y-3">
              {SAMPLE_SCAMS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleTestSample(sample)}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                      {sample.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    "{sample.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
