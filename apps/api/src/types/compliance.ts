export type Industry = 'real_estate' | 'finance' | 'generic';

export interface ComplianceCheckInput {
  text: string;
  industry: Industry;
  jurisdiction?: string; // e.g. "MD"
  channel?: 'email' | 'sms' | 'phone_script' | 'chat' | 'other';
  agentId?: string;
  orgId?: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ComplianceIssue {
  code: string; // e.g. "FAIR_HOUSING_STEERING"
  description: string;
  severity: RiskLevel;
  suggestion?: string;
  category?: string; // e.g. "fair_housing" | "advertising" | "privacy"
}

export interface ComplianceCheckResult {
  riskLevel: RiskLevel;
  issues: ComplianceIssue[];
  suggestedText: string;
  requiredDisclosures: string[];
  modelExplanation?: string;
}
