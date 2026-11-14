import React, { useState } from 'react';
import { MessageSquareText, ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Sparkles, AlertCircle, CheckCircle, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';
import { ScanResult } from '../types';
import { SAMPLE_SCAMS } from '../data/sampleScams';

interface MessageScannerProps {
  initialText?: string;
  onScanComplete: (result: ScanResult) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({ initialText = '', onScanComplete }) => {
  const [textInput, setTextInput] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync if initialText prop changes (e.g. from sample selection on dashboard)
  React.useEffect(() => {
    if (initialText) {
      setTextInput(initialText);
    }
  }, [initialText]);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) {
      setError('Please enter a message or paste text to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze message.');
      }

      const newScan: ScanResult = {
        id: 'scan_' + Date.now(),
        timestamp: Date.now(),
        inputType: 'text',
        inputSnippet: textInput.length > 80 ? textInput.substring(0, 80) + '...' : textInput,
        riskScore: data.riskScore ?? 50,
        riskLevel: data.riskLevel ?? 'MEDIUM',
        scamCategory: data.scamCategory ?? 'General Suspicious',
        summary: data.summary ?? '',
        warningSigns: data.warningSigns ?? [],
        suspiciousWords: data.suspiciousWords ?? [],
        recommendedActions: data.recommendedActions ?? [],
        extractedText: textInput,
      };

      setCurrentResult(newScan);
      onScanComplete(newScan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHigh = currentResult?.riskLevel === 'HIGH';
  const isMed = currentResult?.riskLevel === 'MEDIUM';

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Message Scanner</h1>
            <p className="text-sm text-slate-400">Paste SMS, WhatsApp texts, emails, or links to detect fraud instantly.</p>
          </div>
        </div>

        <form onSubmit={handleScan} className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="messageInput" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Suspicious Message Content
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">{textInput.length} characters</span>
                {textInput && (
                  <button
                    type="button"
                    onClick={() => setTextInput('')}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <textarea
              id="messageInput"
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste suspicious text here... (e.g. 'Dear customer, your bank account is blocked. Click http://bit.ly/fake-bank to verify your PAN card immediately.')"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm leading-relaxed transition-all"
            />
          </div>

          {/* Quick Samples Bar */}
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-2">Or load a sample scam:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SCAMS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTextInput(sample.text)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all truncate max-w-[200px]"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !textInput.trim()}
              className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Scan Message Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {currentResult && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
          {/* Top Result Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  isHigh
                    ? 'bg-rose-500/10 border-2 border-rose-500/40 text-rose-400'
                    : isMed
                    ? 'bg-amber-500/10 border-2 border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {isHigh ? (
                  <ShieldAlert className="w-9 h-9" />
                ) : isMed ? (
                  <AlertTriangle className="w-9 h-9" />
                ) : (
                  <ShieldCheck className="w-9 h-9" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-extrabold tracking-wider ${
                      isHigh
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isMed
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {currentResult.riskLevel} RISK
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {currentResult.scamCategory}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Risk Score: <span className={isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}>{currentResult.riskScore}/100</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyText}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
              </button>
            </div>
          </div>

          {/* Beginner Summary */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Beginner-Friendly Summary</h4>
            <p className="text-slate-200 text-base leading-relaxed">{currentResult.summary}</p>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Warning Signs */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Warning Signs Detected</span>
              </h4>
              <ul className="space-y-2">
                {currentResult.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suspicious Words */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Suspicious Keywords & Phrases</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentResult.suspiciousWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-900/60 text-amber-300 text-xs font-medium"
                  >
                    "{word}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Recommended Safety Actions</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentResult.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200 leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              * Note: ScamShield AI analysis is an automated AI risk assessment and pattern evaluation tool, not absolute proof of fraud. Exercise independent caution and verify official communications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
