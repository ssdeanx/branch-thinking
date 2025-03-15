import { AnalyticsData, ThoughtBranch, SemanticNode } from './types.js';
import { BiasDetector } from './biasDetector.js';

export class AnalyticsEngine {
  private biasDetector: BiasDetector;
  private readonly SIMILARITY_THRESHOLD = 0.7;
  private readonly WINDOW_SIZE = 5;

  constructor() {
    this.biasDetector = new BiasDetector();
  }

  async generateBranchAnalytics(branch: ThoughtBranch): Promise<AnalyticsData> {
    const nodes = (branch as unknown as { nodes: SemanticNode[] }).nodes;
    if (!nodes?.length) {
      throw new Error('Branch contains no nodes');
    }

    return {
      branchMetrics: await this.calculateBranchMetrics(branch, nodes),
      temporalMetrics: this.calculateTemporalMetrics(nodes),
      semanticMetrics: await this.calculateSemanticMetrics(nodes)
    };
  }

  private async calculateBranchMetrics(
    branch: ThoughtBranch, 
    nodes: SemanticNode[]
  ): Promise<AnalyticsData['branchMetrics']> {
    const totalThoughts = nodes.length;
    const avgConfidence = this.calculateAverageConfidence(nodes);

    return {
      totalThoughts,
      avgConfidence,
      insightDensity: this.calculateInsightDensity(branch, totalThoughts),
      crossRefDensity: this.calculateCrossRefDensity(branch, totalThoughts),
      temporalStability: this.calculateTemporalStability(nodes),
      biasScore: await this.calculateBiasScore(nodes)
    };
  }

  private calculateTemporalMetrics(
    nodes: SemanticNode[]
  ): AnalyticsData['temporalMetrics'] {
    return {
      thoughtsPerDay: this.calculateThoughtsPerDay(nodes),
      confidenceTrend: this.calculateConfidenceTrend(nodes),
      stateTransitions: this.countStateTransitions(nodes)
    };
  }

  private async calculateSemanticMetrics(
    nodes: SemanticNode[]
  ): Promise<AnalyticsData['semanticMetrics']> {
    const clusters = await this.identifySemanticClusters(nodes);
    return {
      clusterDensity: clusters.length / nodes.length,
      semanticCoverage: this.calculateSemanticCoverage(clusters),
      conceptDrift: this.calculateConceptDrift(nodes)
    };
  }

  private async identifySemanticClusters(nodes: SemanticNode[]): Promise<SemanticNode[][]> {
    const clusters: SemanticNode[][] = [];
    const visited = new Set<string>();

    for (const node of nodes) {
      if (visited.has(node.id)) continue;

      const cluster = [node];
      visited.add(node.id);

      for (const link of node.semanticLinks) {
        if (link.similarity > this.SIMILARITY_THRESHOLD) {
          const linkedNode = nodes.find(n => n.id === link.targetId);
          if (linkedNode && !visited.has(linkedNode.id)) {
            cluster.push(linkedNode);
            visited.add(linkedNode.id);
          }
        }
      }

      if (cluster.length > 1) {
        clusters.push(cluster);
      }
    }

    return clusters;
  }

  private calculateConceptDrift(nodes: SemanticNode[]): number {
    const windowSize = Math.min(this.WINDOW_SIZE, Math.floor(nodes.length / 2));
    if (windowSize === 0) return 0;

    const early = nodes.slice(0, windowSize);
    const recent = nodes.slice(-windowSize);

    let driftScore = 0;
    let comparisons = 0;

    early.forEach(earlyNode => {
      recent.forEach(recentNode => {
        const similarity = earlyNode.semanticLinks.find(
          link => link.targetId === recentNode.id
        )?.similarity ?? 0;
        driftScore += 1 - similarity;
        comparisons++;
      });
    });

    return comparisons > 0 ? driftScore / comparisons : 0;
  }

  private calculateTemporalStability(nodes: SemanticNode[]): number {
    const stateChanges = nodes.reduce((changes, node) => {
      const transitions = (node as unknown as { stateTransitions: unknown[] }).stateTransitions;
      return changes + (transitions?.length ?? 0);
    }, 0);

    return Math.max(0, 1 - (stateChanges / (nodes.length * 2)));
  }

  private calculateAverageConfidence(nodes: SemanticNode[]): number {
    return nodes.reduce((sum, node) => sum + node.confidence, 0) / nodes.length;
  }

  private calculateInsightDensity(branch: ThoughtBranch, totalThoughts: number): number {
    return totalThoughts > 0 ? branch.insights.length / totalThoughts : 0;
  }

  private calculateCrossRefDensity(branch: ThoughtBranch, totalThoughts: number): number {
    return totalThoughts > 0 ? branch.crossRefs.length / totalThoughts : 0;
  }

  private async calculateBiasScore(nodes: SemanticNode[]): Promise<number> {
    const biasAnalyses = await this.biasDetector.detectBias(nodes);
    if (biasAnalyses.length === 0) return 1;
    
    return 1 - (biasAnalyses.reduce(
      (score, analysis) => score + analysis.severity, 0
    ) / biasAnalyses.length);
  }

  private calculateConfidenceTrend(nodes: SemanticNode[]): number[] {
    const trends: number[] = [];
    if (nodes.length < this.WINDOW_SIZE) return trends;

    for (let i = this.WINDOW_SIZE; i <= nodes.length; i++) {
      const window = nodes.slice(i - this.WINDOW_SIZE, i);
      const avg = this.calculateAverageConfidence(window);
      trends.push(avg);
    }

    return trends;
  }

  private calculateThoughtsPerDay(nodes: SemanticNode[]): number {
    if (nodes.length < 2) return nodes.length;

    const firstDate = new Date(nodes[0].createdAt);
    const lastDate = new Date(nodes[nodes.length - 1].createdAt);
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysDiff > 0 ? nodes.length / daysDiff : nodes.length;
  }

  private countStateTransitions(nodes: SemanticNode[]): number {
    return nodes.reduce((count, node) => {
      const transitions = (node as unknown as { stateTransitions: unknown[] }).stateTransitions;
      return count + (transitions?.length ?? 0);
    }, 0);
  }

  private calculateSemanticCoverage(clusters: SemanticNode[][]): number {
    const totalNodes = clusters.reduce((sum, cluster) => sum + cluster.length, 0);
    if (totalNodes === 0) return 0;

    const uniqueNodes = new Set(
      clusters.flatMap(cluster => cluster.map(node => node.id))
    ).size;

    return uniqueNodes / totalNodes;
  }
} 