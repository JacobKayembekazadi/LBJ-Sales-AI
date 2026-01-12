
export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface FileData {
  inlineData: {
    data: string;
    mimeType: string;
  };
  fileName: string;
}

export interface ActionDocument {
  title: string;
  preparedFor: string;
  date: string;
  executiveSummary: string;
  keyInsights: string;
  recommendedActions: string;
  plan30Day: string;
  plan60Day: string;
  plan90Day: string;
  ownershipAndRoles: string;
  successMetrics: string;
  pdfUsageInstructions: {
    whoShouldReceive: string;
    meetingUsage: string;
    decisionSupport: string;
    immediateAction: string;
  };
}

export interface SalesBrief {
  clientName: string;
  projectType: string;
  location: string;
  budgetRange: string;
  timeline: string;
  designStyleSignals: string;
  keyGoals: string;
  potentialChallenges: string;
  urgencyLevel: UrgencyLevel;
  recommendedNextStep: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  fileName?: string;
}

export interface GeminiResponse {
  clientFriendlyResponse: string;
  salesBrief: SalesBrief;
  actionDocument?: ActionDocument;
}
