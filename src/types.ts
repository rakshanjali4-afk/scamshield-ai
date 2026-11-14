export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ScanResult {
  id: string;
  timestamp: number;
  inputType: 'text' | 'image';
  inputSnippet: string; // Preview of message or image name
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  scamCategory: string;
  summary: string;
  warningSigns: string[];
  suspiciousWords: string[];
  recommendedActions: string[];
  extractedText?: string;
}

export type ActiveTab = 'dashboard' | 'message-scanner' | 'screenshot-scanner' | 'history' | 'safety-tips';
