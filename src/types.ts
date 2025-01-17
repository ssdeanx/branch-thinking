export type BranchState = 'active' | 'suspended' | 'completed' | 'dead_end';
export type InsightType = 'behavioral_pattern' | 'feature_integration' | 'observation' | 'connection';
export type CrossRefType = 'complementary' | 'contradictory' | 'builds_upon' | 'alternative';

export interface ThoughtData {
  id: string;
  content: string;
  branchId: string;
  timestamp: Date;
  metadata: {
    type: string;
    confidence: number;
    keyPoints: string[];
  };
}

export interface Insight {
  id: string;
  type: InsightType;
  content: string;
  context: string[];
  parentInsights?: string[];
  applicabilityScore: number;
  supportingEvidence: {
    crossRefs?: string[];
    pattern?: string;
    data?: string[];
  };
}

export interface CrossReference {
  id: string;
  fromBranch: string;
  toBranch: string;
  type: CrossRefType;
  reason: string;
  strength: number;
  touchpoints: Array<{
    fromThought: string;
    toThought: string;
    connection: string;
  }>;
  relatedInsights?: string[];
}

export interface ThoughtBranch {
  id: string;
  parentBranchId?: string;
  state: BranchState;
  priority: number;
  confidence: number;
  thoughts: ThoughtData[];
  insights: Insight[];
  crossRefs: CrossReference[];
}

export interface BranchingThoughtInput {
  content: string;
  branchId?: string;
  parentBranchId?: string;
  type: string;
  confidence?: number;
  keyPoints?: string[];
  relatedInsights?: string[];
  crossRefs?: Array<{
    toBranch: string;
    type: CrossRefType;
    reason: string;
    strength: number;
  }>;
}