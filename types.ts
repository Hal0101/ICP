export interface Persona {
  id: string;
  role: string;
  industry: string;
  companySize: string;
  incomeLevel: string;
  painPoints: string[];
  motivations: string[];
  preferredChannels: string[];
  marketingHook: string;
  compatibilityScore: number; // 0-100
  bio: string;
}

export interface AnalysisResult {
  personas: Persona[];
  marketOverview: string;
  suggestedStrategy: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  DASHBOARD = 'DASHBOARD',
}
