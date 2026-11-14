import React, { useState, useRef } from 'react';
import { ImageUp, UploadCloud, Sparkles, AlertCircle, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, Copy, Check, Trash2 } from 'lucide-react';
import { ScanResult } from '../types';

interface ScreenshotScannerProps {
  onScanComplete: (result: ScanResult) => void;
}

export const ScreenshotScanner: React.FC<ScreenshotScannerProps> = ({ onScanComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [imageName, setImageName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setImageName(file.name);
    setImageMimeType(file.type);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCurrentResult(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    setImageName(file.name);
    setImageMimeType(file.type);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCurrentResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!selectedImage) {
      setError('Please select or upload a screenshot first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage, mimeType: imageMimeType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze screenshot.');
      }

      const newScan: ScanResult = {
        id: 'scan_' + Date.now(),
        timestamp: Date.now(),
        inputType: 'image',
        inputSnippet: `Screenshot: ${imageName || 'Uploaded Image'}`,
        riskScore: data.riskScore ?? 50,
        riskLevel: data.riskLevel ?? 'MEDIUM',
        scamCategory: data.scamCategory ?? 'General Suspicious',
        summary: data.summary ?? '',
        warningSigns: data.warningSigns ?? [],
        suspiciousWords: data.suspiciousWords ?? [],
        recommendedActions: data.recommendedActions ?? [],
        extractedText: data.extractedText || imageName,
      };

      setCurrentResult(newScan);
      onScanComplete(newScan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during screenshot analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
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
            <ImageUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Screenshot Scanner</h1>
            <p className="text-sm text-slate-400">Upload suspicious WhatsApp chats, SMS screenshots, or payment scam images.</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950/90 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative max-h-64 overflow-hidden rounded-xl inline-block border border-slate-700 shadow-md">
                  <img src={selectedImage} alt="Uploaded screenshot preview" className="max-h-60 mx-auto object-contain" />
                </div>
                <p className="text-xs text-cyan-400 font-medium">{imageName} (Click or drop to replace)</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Click to upload screenshot or drag & drop</p>
                  <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {selectedImage && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setImageName('');
                  setCurrentResult(null);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Image</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleScan}
                className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <ImageUp className="w-5 h-5 animate-bounce" />
                    <span>Extracting & Analyzing Screenshot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Scan Screenshot</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
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
                onClick={handleCopyReport}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
              </button>
            </div>
          </div>

          {/* Extracted Text Box */}
          {currentResult.extractedText && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Extracted Text from Screenshot</h4>
              <p className="text-slate-300 text-sm font-mono bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                {currentResult.extractedText}
              </p>
            </div>
          )}

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
