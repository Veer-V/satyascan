
export enum ScanStatus {
  AUTHENTIC = 'AUTHENTIC',
  SUSPICIOUS = 'SUSPICIOUS',
  FAKE = 'FAKE',
  UNKNOWN = 'UNKNOWN'
}

export interface AnalysisResult {
  productName: string;
  brand: string;
  status: ScanStatus;
  confidenceScore: number;
  reasoning: string[];
  manufacturingDate?: string;
  batchCode?: string;
  officialWebsite?: string;
  reportingUrl?: string;
  extractedText?: string[];
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  thumbnail: string;
  result: AnalysisResult;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewState = 'HOME' | 'SCAN' | 'DASHBOARD' | 'RESULTS' | 'HISTORY';
