import React from 'react';
import { BookOpen, ShieldCheck, Lock, AlertTriangle, PhoneCall, Globe, CheckCircle2 } from 'lucide-react';

export const SafetyTips: React.FC = () => {
  const tips = [
    {
      title: 'Never Share OTP, UPI PIN, or Passwords',
      description: 'Banks, government officials, and delivery agents will NEVER ask for your One-Time Password (OTP), UPI PIN, ATM PIN, or internet banking passwords over phone calls or SMS.',
      icon: Lock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Verify Links Before Clicking',
      description: 'Scammers use lookalike domains (e.g., hdfc-verify-kyc.com instead of hdfcbank.com). Always check the exact website URL in the address bar before entering credentials or payment details.',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Verify Through Official Channels',
      description: 'If you receive an urgent alert regarding your bank account, electricity bill, or KYC, do not call the number provided in the SMS. Instead, log in directly via the official bank app or customer care number.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Beware of "Too Good to Be True" Offers',
      description: 'Lotteries, KBC lucky draws, instant part-time jobs requiring registration fees, and guaranteed high-return crypto/investment schemes are almost always fraudulent traps.',
      icon: BookOpen,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Cybersecurity & Fraud Prevention Guide</h1>
            <p className="text-sm text-slate-400">Practical rules and best practices to keep your digital life secure.</p>
          </div>
        </div>
      </div>

      {/* Grid of Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl border ${tip.bg} flex items-center justify-center ${tip.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{tip.title}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{tip.description}</p>
            </div>
          );
        })}
      </div>

      {/* Reporting Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Faced a Cyber Fraud? Report Immediately</h2>
            <p className="text-xs text-cyan-300">Quick action within the "Golden Hour" increases recovery chances.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">National Cyber Crime Helpline</span>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-extrabold text-white tracking-wider">1930</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">24x7 Active</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Call immediately if you have fallen victim to financial fraud or unauthorized online transactions.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Official Reporting Portal</span>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-white hover:text-cyan-400 transition-colors underline"
              >
                cybercrime.gov.in
              </a>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              File formal online cybercrime complaints, track status, and report suspicious phishing links or scam profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
