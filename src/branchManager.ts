import chalk from 'chalk';
import { 
  ThoughtBranch, 
  ThoughtData, 
  Insight, 
  CrossReference, 
  InsightType, 
  CrossRefType, 
  BranchingThoughtInput, 
  EnhancedBranch, 
  SemanticNode, 
  TemporalEvolution, 
  MultiHopReasoning,
  VisualizationConfig,
  AnalyticsData,
  BiasAnalysis
} from './types.js';
import { SemanticProcessor } from './semanticProcessor.js';
import { BiasDetector } from './biasDetector.js';
import { AnalyticsEngine } from './analytics.js';

export class BranchManager {
  private branches: Map<string, ThoughtBranch> = new Map();
  private insightCounter = 0;
  private thoughtCounter = 0;
  private crossRefCounter = 0;
  private activeBranchId: string | null = null;
  private semanticProcessor: SemanticProcessor;
  private temporalEvolutionMap: Map<string, TemporalEvolution>;
  private readonly analyticsEngine: AnalyticsEngine;
  private readonly biasDetector: BiasDetector;

  private reinforcementLearning: {
    learningRate: number;
    decayFactor: number;
    explorationRate: number;
  } = {
    learningRate: 0.1,
    decayFactor: 0.95,
    explorationRate: 0.2
  };

  constructor() {
    this.semanticProcessor = new SemanticProcessor();
    this.temporalEvolutionMap = new Map();
    this.analyticsEngine = new AnalyticsEngine();
    this.biasDetector = new BiasDetector();
  }

  generateId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  }

  createBranch(branchId: string, parentBranchId?: string): ThoughtBranch {
    const branch: ThoughtBranch = {
      id: branchId,
      parentBranchId,
      state: 'active',
      priority: 1.0,
      confidence: 1.0,
      thoughts: [],
      insights: [],
      crossRefs: []
    };
    this.branches.set(branchId, branch);
    // Set as active if it's the first branch
    if (!this.activeBranchId) {
      this.activeBranchId = branchId;
    }
    return branch;
  }

  private createInsight(
    type: InsightType,
    content: string,
    context: string[],
    parentInsights?: string[]
  ): Insight {
    return {
      id: `insight-${++this.insightCounter}`,
      type,
      content,
      context,
      parentInsights,
      applicabilityScore: 1.0,
      supportingEvidence: {}
    };
  }

  private createCrossReference(
    fromBranch: string,
    toBranch: string,
    type: CrossRefType,
    reason: string,
    strength: number
  ): CrossReference {
    return {
      id: `xref-${++this.crossRefCounter}`,
      fromBranch,
      toBranch,
      type,
      reason,
      strength,
      touchpoints: []
    };
  }

  addThought(input: BranchingThoughtInput): ThoughtData {
    // Use active branch if no branchId provided
    const branchId = input.branchId || this.activeBranchId || this.generateId('branch');
    let branch = this.branches.get(branchId);

    if (!branch) {
      branch = this.createBranch(branchId, input.parentBranchId);
    }

    const thought: ThoughtData = {
      id: `thought-${++this.thoughtCounter}`,
      content: input.content,
      branchId: branch.id,
      timestamp: new Date(),
      metadata: {
        type: input.type,
        confidence: input.confidence || 1.0,
        keyPoints: input.keyPoints || []
      }
    };

    branch.thoughts.push(thought);

    // Create insights if key points are provided
    if (input.keyPoints) {
      const insight = this.createInsight(
        'observation',
        `Identified key points: ${input.keyPoints.join(', ')}`,
        [input.type],
        input.relatedInsights
      );
      branch.insights.push(insight);
    }

    // Create cross references if specified
    if (input.crossRefs) {
      input.crossRefs.forEach(ref => {
        const crossRef = this.createCrossReference(
          branch!.id,
          ref.toBranch,
          ref.type,
          ref.reason,
          ref.strength
        );
        branch!.crossRefs.push(crossRef);
      });
    }

    this.updateBranchMetrics(branch);
    return thought;
  }

  private updateBranchMetrics(branch: ThoughtBranch): void {
    const avgConfidence = branch.thoughts.reduce((sum, t) => sum + t.metadata.confidence, 0) / branch.thoughts.length;
    const insightScore = branch.insights.length * 0.1;
    const crossRefScore = branch.crossRefs.reduce((sum, ref) => sum + ref.strength, 0) * 0.1;

    branch.priority = avgConfidence + insightScore + crossRefScore;
    branch.confidence = avgConfidence;
  }

  getBranch(branchId: string): ThoughtBranch | undefined {
    return this.branches.get(branchId);
  }

  getAllBranches(): ThoughtBranch[] {
    return Array.from(this.branches.values());
  }

  getActiveBranch(): ThoughtBranch | undefined {
    return this.activeBranchId ? this.branches.get(this.activeBranchId) : undefined;
  }

  setActiveBranch(branchId: string): void {
    if (!this.branches.has(branchId)) {
      throw new Error(`Branch ${branchId} not found`);
    }
    this.activeBranchId = branchId;
  }

  getBranchHistory(branchId: string): string {
    const branch = this.branches.get(branchId);
    if (!branch) {
      throw new Error(`Branch ${branchId} not found`);
    }

    const header = chalk.blue(`History for branch: ${branchId} (${branch.state})`);
    const timeline = branch.thoughts.map((t, i) => {
      const timestamp = t.timestamp.toLocaleTimeString();
      const number = chalk.gray(`${i + 1}.`);
      const content = t.content;
      const type = chalk.yellow(`[${t.metadata.type}]`);
      const points = t.metadata.keyPoints.length > 0 
        ? chalk.green(`\n   Key Points: ${t.metadata.keyPoints.join(', ')}`)
        : '';
      return `${number} ${timestamp} ${type}\n   ${content}${points}`;
    }).join('\n\n');

    const insights = branch.insights.map(i =>
      chalk.yellow(`→ ${i.content}`)
    ).join('\n');

    return `
┌─────────────────────────────────────────────
│ ${header}
├─────────────────────────────────────────────
${timeline}
${insights ? `
├─────────────────────────────────────────────
│ Insights:
${insights}` : ''}
└─────────────────────────────────────────────`;
  }

  formatBranchStatus(branch: ThoughtBranch): string {
    const isActive = branch.id === this.activeBranchId;
    const header = `${chalk.blue('Branch:')} ${branch.id} (${branch.state})${isActive ? chalk.green(' [ACTIVE]') : ''}`;
    const stats = `Priority: ${branch.priority.toFixed(2)} | Confidence: ${branch.confidence.toFixed(2)}`;
    const thoughts = branch.thoughts.map(t => 
      `  ${chalk.green('•')} ${t.content} (${t.metadata.type})`
    ).join('\n');
    const insights = branch.insights.map(i =>
      `  ${chalk.yellow('→')} ${i.content}`
    ).join('\n');
    const crossRefs = branch.crossRefs.map(r =>
      `  ${chalk.magenta('↔')} ${r.toBranch}: ${r.reason} (${r.strength.toFixed(2)})`
    ).join('\n');

    return `
┌─────────────────────────────────────────────
│ ${header}
│ ${stats}
├─────────────────────────────────────────────
│ Thoughts:
${thoughts}
│ Insights:
${insights}
│ Cross References:
${crossRefs}
└─────────────────────────────────────────────`;
  }

  async visualizeBranch(
    branchId: string, 
    config: Partial<VisualizationConfig> = {}
  ): Promise<void> {
    const branch = this.getBranch(branchId) as EnhancedBranch;
    if (!branch) throw new Error(`Branch ${branchId} not found`);

    const defaultConfig: VisualizationConfig = {
      layout: 'force',
      style: {
        nodeSize: 10,
        edgeWidth: 1,
        colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c'],
        highlightColor: '#d62728'
      },
      filters: {
        minConfidence: 0.5
      },
      interactions: {
        zoom: true,
        drag: true,
        highlight: true,
        details: true
      }
    };

    const finalConfig = { ...defaultConfig, ...config };
    branch.visualizationData = {
      layout: finalConfig.layout,
      positions: new Map()
    };

    // Calculate positions based on layout algorithm
    switch (finalConfig.layout) {
      case 'force':
        await this.calculateForceLayout(branch);
        break;
      case 'hierarchical':
        await this.calculateHierarchicalLayout(branch);
        break;
      case 'radial':
        await this.calculateRadialLayout(branch);
        break;
      case 'temporal':
        await this.calculateTemporalLayout(branch);
        break;
    }
  }

  private async calculateForceLayout(branch: EnhancedBranch): Promise<void> {
    // Implement force-directed layout algorithm
    // This would use something like d3-force in a real implementation
  }

  private async calculateHierarchicalLayout(branch: EnhancedBranch): Promise<void> {
    // Implement hierarchical layout algorithm
  }

  private async calculateRadialLayout(branch: EnhancedBranch): Promise<void> {
    // Implement radial layout algorithm
  }

  private async calculateTemporalLayout(branch: EnhancedBranch): Promise<void> {
    // Implement temporal layout algorithm
  }

  async detectContradictions(branchId: string): Promise<Array<{
    nodeId: string;
    contradictsWith: string[];
    score: number;
  }>> {
    const branch = this.getBranch(branchId) as EnhancedBranch;
    if (!branch) throw new Error(`Branch ${branchId} not found`);

    const contradictions: Array<{
      nodeId: string;
      contradictsWith: string[];
      score: number;
    }> = [];

    // Implement contradiction detection logic
    // This would analyze semantic relationships and logical consistency

    return contradictions;
  }

  async applyReinforcement(branchId: string, feedback: {
    nodeId: string;
    reward: number;
  }[]): Promise<void> {
    const branch = this.getBranch(branchId) as EnhancedBranch;
    if (!branch) throw new Error(`Branch ${branchId} not found`);

    if (!branch.reinforcementData) {
      branch.reinforcementData = {
        learningRate: this.reinforcementLearning.learningRate,
        rewardHistory: [],
        modelParameters: new Map()
      };
    }

    // Apply reinforcement learning updates
    for (const { nodeId, reward } of feedback) {
      const node = branch.nodes.find(n => n.id === nodeId);
      if (node) {
        // Update confidence based on reward
        node.confidence = this.updateConfidence(
          node.confidence,
          reward,
          branch.reinforcementData.learningRate
        );
        
        // Record reward history
        branch.reinforcementData.rewardHistory.push({
          timestamp: new Date(),
          reward
        });
      }
    }
  }

  private updateConfidence(currentConfidence: number, reward: number, learningRate: number): number {
    const newConfidence = currentConfidence + learningRate * (reward - currentConfidence);
    return Math.max(0, Math.min(1, newConfidence));
  }

  async semanticSearch(query: string, options: {
    threshold?: number;
    maxResults?: number;
    branchId?: string;
  } = {}): Promise<Array<{node: SemanticNode; similarity: number}>> {
    const threshold = options.threshold ?? 0.7;
    const maxResults = options.maxResults ?? 10;
    
    const queryEmbedding = await this.semanticProcessor.embedText(query);
    const results: Array<{node: SemanticNode; similarity: number}> = [];

    const branches = options.branchId ? 
      [this.getBranch(options.branchId)] : 
      this.getAllBranches();

    for (const branch of branches) {
      if (!branch) continue;

      for (const node of (branch as EnhancedBranch).nodes) {
        if (!node.embedding) {
          node.embedding = await this.semanticProcessor.embedText(node.label);
        }

        const similarity = this.semanticProcessor.calculateSimilarity(
          queryEmbedding,
          node.embedding
        );

        if (similarity >= threshold) {
          results.push({ node: node as SemanticNode, similarity });
        }
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  async findMultiHopPath(
    startNodeId: string,
    endNodeId: string,
    maxDepth: number = 5
  ): Promise<MultiHopReasoning[]> {
    const paths: MultiHopReasoning[] = [];
    const visited = new Set<string>();

    const dfs = async (
      currentId: string,
      path: string[],
      reasoning: Array<{from: string; to: string; reasoning: string; confidence: number}>,
      depth: number
    ) => {
      if (depth > maxDepth) return;
      if (currentId === endNodeId) {
        paths.push({
          path,
          confidence: reasoning.reduce((acc, step) => acc * step.confidence, 1),
          evidence: [],
          intermediateSteps: reasoning
        });
        return;
      }

      visited.add(currentId);

      const currentNode = this.findNodeById(currentId) as SemanticNode;
      if (!currentNode) return;

      for (const link of currentNode.semanticLinks) {
        if (!visited.has(link.targetId)) {
          const nextNode = this.findNodeById(link.targetId) as SemanticNode;
          if (!nextNode) continue;

          const stepReasoning = {
            from: currentId,
            to: link.targetId,
            reasoning: `Connected via ${link.relationship} relationship`,
            confidence: link.similarity
          };

          await dfs(
            link.targetId,
            [...path, link.targetId],
            [...reasoning, stepReasoning],
            depth + 1
          );
        }
      }

      visited.delete(currentId);
    };

    await dfs(startNodeId, [startNodeId], [], 0);
    return paths.sort((a, b) => b.confidence - a.confidence);
  }

  trackTemporalEvolution(nodeId: string): void {
    const node = this.findNodeById(nodeId) as SemanticNode;
    if (!node) throw new Error(`Node ${nodeId} not found`);

    let evolution = this.temporalEvolutionMap.get(nodeId);
    if (!evolution) {
      evolution = {
        nodeId,
        timestamps: [],
        confidenceHistory: [],
        stateTransitions: []
      };
      this.temporalEvolutionMap.set(nodeId, evolution);
    }

    // Record current state
    evolution.timestamps.push(new Date());
    evolution.confidenceHistory.push(node.confidence);

    // Check for state transitions
    const currentState = node.evolutionState;
    const lastTransition = evolution.stateTransitions[evolution.stateTransitions.length - 1];
    
    if (!lastTransition || lastTransition.to !== currentState) {
      evolution.stateTransitions.push({
        from: lastTransition?.to || 'initial',
        to: currentState,
        timestamp: new Date(),
        reason: this.determineTransitionReason(node)
      });
    }

    // Update temporal score based on evolution history
    node.temporalScore = this.calculateTemporalScore(evolution);
  }

  private findNodeById(nodeId: string): SemanticNode | undefined {
    for (const branch of this.getAllBranches()) {
      const enhancedBranch = branch as EnhancedBranch;
      const node = enhancedBranch.nodes.find(n => n.id === nodeId);
      if (node) return node as SemanticNode;
    }
    return undefined;
  }

  private determineTransitionReason(node: SemanticNode): string {
    // Implement logic to determine why a state transition occurred
    // This could be based on confidence changes, contradictions, etc.
    return "State transition based on updated evidence and confidence";
  }

  private calculateTemporalScore(evolution: TemporalEvolution): number {
    const recentConfidence = evolution.confidenceHistory.slice(-5);
    const trend = recentConfidence.reduce((acc, conf, i) => {
      return acc + conf * Math.exp(-0.2 * (recentConfidence.length - i - 1));
    }, 0) / recentConfidence.length;

    const stateStability = 1 - (evolution.stateTransitions.length / evolution.timestamps.length);
    
    return (trend * 0.7 + stateStability * 0.3);
  }

  async analyzeBranch(branchId: string): Promise<AnalyticsData> {
    const branch = this.getBranch(branchId);
    if (!branch) {
      throw new Error(`Branch ${branchId} not found`);
    }
    return this.analyticsEngine.generateBranchAnalytics(branch);
  }

  public async detectBranchBias(branchId: string): Promise<BiasAnalysis[]> {
    const branch = this.getBranch(branchId) as EnhancedBranch;
    if (!branch) throw new Error(`Branch ${branchId} not found`);
    return [...(await this.biasDetector.detectBias(branch.nodes))];
  }
}