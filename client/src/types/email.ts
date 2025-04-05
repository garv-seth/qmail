export interface Email {
  id: number;
  userId: number;
  providerId: number;
  externalId: string;
  from: string;
  to: string;
  subject: string | null;
  body: string | null;
  receivedAt: Date | null;
  isRead: boolean;
  isFlagged: boolean;
  folder: string;
  aiAnalysis: EmailAnalysis | null;
  createdAt: Date;
}

export interface EmailAnalysis {
  isScam: boolean;
  scamProbability: number;
  reasons: string[];
  summary: string;
  category: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  sensitiveContent: boolean;
  unsubscribeRecommended: boolean;
  unsubscribeReason?: string;
}

export interface EmailProvider {
  id: number;
  userId: number;
  provider: string;
  credentials: any;
  active: boolean;
  createdAt: Date;
}

export interface FilterRule {
  id: number;
  userId: number;
  name: string;
  conditions: FilterCondition[];
  actions: FilterAction[];
  isActive: boolean;
  createdAt: Date;
}

export interface FilterCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
  value: string;
}

export interface FilterAction {
  type: 'move' | 'flag' | 'read';
  value: string;
}
