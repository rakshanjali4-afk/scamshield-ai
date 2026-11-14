import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle, Copy, Check, Calendar } from 'lucide-react';
import { ScanResult } from '../types';

interface ResultModalProps {
  result: ScanResult | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const isHigh = result.riskLevel === 'HIGH';
  const isMed = result.riskLevel === 'MEDIUM';

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4 pr-12">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isHigh
                ? 'bg-rose-500/10 border-2 border-rose-500/40 text-rose-400'
                : isMed
                ? 'bg-amber-500/10 border-2 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400'
            }`}
          >
            {isHigh ? (
              <ShieldAlert className="w-8 h-8" />
            ) : isMed ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <ShieldCheck className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span
                className={`text-xs px-3 py-0.5 rounded-full font-extrabold tracking-wider ${
                  isHigh
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : isMed
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {result.riskLevel} RISK ({result.riskScore}/100)
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {result.scamCategory}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(result.timestamp).toLocaleString()} • {result.inputType.toUpperCase()} scan</span>
            </p>
          </div>
        </div>

        {/* Input Snippet / Extracted Text */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">Analyzed Content</h4>
          <p className="text-xs text-slate-300 font-mono line-clamp-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {result.extractedText || result.inputSnippet}
          </p>
        </div>

        {/* Beginner Summary */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">Beginner-Friendly Summary</h4>
          <p className="text-sm text-slate-200 leading-relaxed">{result.summary}</p>
        </div>

        {/* Warning Signs & Suspicious Words */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Warning Signs</span>
            </h4>
            <ul className="space-y-1.5">
              {result.warningSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Suspicious Keywords</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {result.suspiciousWords.map((word, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 text-amber-300 text-[11px]">
                  "{word}"
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Recommended Safety Actions</span>
          </h4>
          <ul className="space-y-2">
            {result.recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Report JSON'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
