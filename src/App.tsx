import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MessageScanner } from './components/MessageScanner';
import { ScreenshotScanner } from './components/ScreenshotScanner';
import { ScanHistory } from './components/ScanHistory';
import { SafetyTips } from './components/SafetyTips';
import { ResultModal } from './components/ResultModal';
import { ActiveTab, ScanResult } from './types';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [selectedSampleText, setSelectedSampleText] = useState<string>('');
  const [modalResult, setModalResult] = useState<ScanResult | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('scamshield_history');
      if (saved) {
        setScanHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load scan history:', e);
    }
  }, []);

  // Save history to localStorage on change
  const saveHistoryToStorage = (newHistory: ScanResult[]) => {
    setScanHistory(newHistory);
    try {
      localStorage.setItem('scamshield_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save scan history:', e);
    }
  };

  const handleNewScan = (result: ScanResult) => {
    const updated = [result, ...scanHistory];
    saveHistoryToStorage(updated);
  };

  const handleDeleteScan = (id: string) => {
    const updated = scanHistory.filter((s) => s.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearHistory = () => {
    saveHistoryToStorage([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} scanCount={scanHistory.length} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            scanHistory={scanHistory}
            setActiveTab={setActiveTab}
            onSelectSample={(text) => setSelectedSampleText(text)}
            onViewReport={(result) => setModalResult(result)}
          />
        )}

        {activeTab === 'message-scanner' && (
          <MessageScanner
            initialText={selectedSampleText}
            onScanComplete={handleNewScan}
          />
        )}

        {activeTab === 'screenshot-scanner' && (
          <ScreenshotScanner
            onScanComplete={handleNewScan}
          />
        )}

        {activeTab === 'history' && (
          <ScanHistory
            scanHistory={scanHistory}
            onViewReport={(result) => setModalResult(result)}
            onDeleteScan={handleDeleteScan}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'safety-tips' && (
          <SafetyTips />
        )}
      </main>

      {/* Full Report Modal */}
      <ResultModal
        result={modalResult}
        onClose={() => setModalResult(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">ScamShield AI</span>
            <span>— Smart Scam Message & Fraud Detector</span>
          </div>
          <p>© {new Date().getFullYear()} ScamShield AI. Powered by Google Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
