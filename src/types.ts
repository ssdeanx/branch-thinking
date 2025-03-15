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

// Complete type definitions to fix all type-related linter errors
export interface SemanticVector {
  vector: number[];
  magnitude: number;
}

export interface ThoughtNode {
  id: string;
  type: 'thought' | 'insight';
  label: string;
  status: 'active' | 'completed' | 'rejected' | 'pending';
  confidence: number;
  gutFeelingConfidence: number;
  tags: string[];
  perspective?: string;
  evidence: string[];
  contradictionScore: number;
  evolutionState: 'emerging' | 'stable' | 'contradictory' | 'outdated';
  emotionScores: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  progress: number;
  thoughtType: ThoughtType;
  createdAt: Date;
  updatedAt: Date;
  embedding?: SemanticVector;
  temporalScore: number;
  semanticLinks: Array<{
    targetId: string;
    similarity: number;
    relationship: string;
  }>;
  branchId: string;
}

export interface EnhancedBranch extends ThoughtBranch {
  name: string;
  strategy?: string;
  nodes: ThoughtNode[];
  visualizationData?: {
    layout: 'force' | 'hierarchical' | 'radial' | 'temporal';
    positions: Map<string, { x: number; y: number }>;
  };
  reinforcementData?: {
    learningRate: number;
    rewardHistory: Array<{ timestamp: Date; reward: number }>;
    modelParameters: Map<string, number>;
  };
}

// Ensure all enum-like types are properly defined
export type ThoughtType = 
  | 'Analytical' | 'Creative' | 'Evaluative' | 'Strategic'
  | 'Comparative' | 'Causal' | 'Hypothetical' | 'Definitional'
  | 'Summarizing' | 'Inquisitive' | 'Reflective' | 'Procedural'
  | 'Diagnostic' | 'Predictive' | 'Explanatory' | 'Argumentative'
  | 'Counterfactual' | 'Metacognitive';

export interface SemanticNode extends ThoughtNode {
  embedding?: SemanticVector;
  temporalScore: number;
  semanticLinks: Array<{
    targetId: string;
    similarity: number;
    relationship: string;
  }>;
}

export interface TemporalEvolution {
  nodeId: string;
  timestamps: Date[];
  confidenceHistory: number[];
  stateTransitions: Array<{
    from: string;
    to: string;
    timestamp: Date;
    reason: string;
  }>;
}

export interface MultiHopReasoning {
  path: string[];
  confidence: number;
  evidence: string[];
  intermediateSteps: Array<{
    from: string;
    to: string;
    reasoning: string;
    confidence: number;
  }>;
}

// Add missing BiasAnalysis interface
export interface BiasAnalysis {
  biasType: 'confirmation' | 'anchoring' | 'availability' | 'groupthink' | 'overconfidence';
  severity: number;
  evidence: string[];
  mitigation: readonly string[];
  affectedNodes: string[];
}

// Add missing AnalyticsData interface
export interface AnalyticsData {
  branchMetrics: {
    totalThoughts: number;
    avgConfidence: number;
    insightDensity: number;
    crossRefDensity: number;
    temporalStability: number;
    biasScore: number;
  };
  temporalMetrics: {
    thoughtsPerDay: number;
    confidenceTrend: number[];
    stateTransitions: number;
  };
  semanticMetrics: {
    clusterDensity: number;
    semanticCoverage: number;
    conceptDrift: number;
  };
}

// Add missing VisualizationConfig interface
export interface VisualizationConfig {
  layout: 'force' | 'hierarchical' | 'radial' | 'temporal';
  style: {
    nodeSize: number;
    edgeWidth: number;
    colorScheme: string[];
    highlightColor: string;
  };
  filters: {
    minConfidence?: number;
    thoughtTypes?: ThoughtType[];
    timeRange?: [Date, Date];
  };
  interactions: {
    zoom: boolean;
    drag: boolean;
    highlight: boolean;
    details: boolean;
  };
}