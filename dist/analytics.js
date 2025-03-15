import { BiasDetector } from './biasDetector.js';
export class AnalyticsEngine {
    constructor() {
        this.SIMILARITY_THRESHOLD = 0.7;
        this.WINDOW_SIZE = 5;
        this.biasDetector = new BiasDetector();
    }
    async generateBranchAnalytics(branch) {
        const nodes = branch.nodes;
        if (!nodes?.length) {
            throw new Error('Branch contains no nodes');
        }
        return {
            branchMetrics: await this.calculateBranchMetrics(branch, nodes),
            temporalMetrics: this.calculateTemporalMetrics(nodes),
            semanticMetrics: await this.calculateSemanticMetrics(nodes)
        };
    }
    async calculateBranchMetrics(branch, nodes) {
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
    calculateTemporalMetrics(nodes) {
        return {
            thoughtsPerDay: this.calculateThoughtsPerDay(nodes),
            confidenceTrend: this.calculateConfidenceTrend(nodes),
            stateTransitions: this.countStateTransitions(nodes)
        };
    }
    async calculateSemanticMetrics(nodes) {
        const clusters = await this.identifySemanticClusters(nodes);
        return {
            clusterDensity: clusters.length / nodes.length,
            semanticCoverage: this.calculateSemanticCoverage(clusters),
            conceptDrift: this.calculateConceptDrift(nodes)
        };
    }
    async identifySemanticClusters(nodes) {
        const clusters = [];
        const visited = new Set();
        for (const node of nodes) {
            if (visited.has(node.id))
                continue;
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
    calculateConceptDrift(nodes) {
        const windowSize = Math.min(this.WINDOW_SIZE, Math.floor(nodes.length / 2));
        if (windowSize === 0)
            return 0;
        const early = nodes.slice(0, windowSize);
        const recent = nodes.slice(-windowSize);
        let driftScore = 0;
        let comparisons = 0;
        early.forEach(earlyNode => {
            recent.forEach(recentNode => {
                const similarity = earlyNode.semanticLinks.find(link => link.targetId === recentNode.id)?.similarity ?? 0;
                driftScore += 1 - similarity;
                comparisons++;
            });
        });
        return comparisons > 0 ? driftScore / comparisons : 0;
    }
    calculateTemporalStability(nodes) {
        const stateChanges = nodes.reduce((changes, node) => {
            const transitions = node.stateTransitions;
            return changes + (transitions?.length ?? 0);
        }, 0);
        return Math.max(0, 1 - (stateChanges / (nodes.length * 2)));
    }
    calculateAverageConfidence(nodes) {
        return nodes.reduce((sum, node) => sum + node.confidence, 0) / nodes.length;
    }
    calculateInsightDensity(branch, totalThoughts) {
        return totalThoughts > 0 ? branch.insights.length / totalThoughts : 0;
    }
    calculateCrossRefDensity(branch, totalThoughts) {
        return totalThoughts > 0 ? branch.crossRefs.length / totalThoughts : 0;
    }
    async calculateBiasScore(nodes) {
        const biasAnalyses = await this.biasDetector.detectBias(nodes);
        if (biasAnalyses.length === 0)
            return 1;
        return 1 - (biasAnalyses.reduce((score, analysis) => score + analysis.severity, 0) / biasAnalyses.length);
    }
    calculateConfidenceTrend(nodes) {
        const trends = [];
        if (nodes.length < this.WINDOW_SIZE)
            return trends;
        for (let i = this.WINDOW_SIZE; i <= nodes.length; i++) {
            const window = nodes.slice(i - this.WINDOW_SIZE, i);
            const avg = this.calculateAverageConfidence(window);
            trends.push(avg);
        }
        return trends;
    }
    calculateThoughtsPerDay(nodes) {
        if (nodes.length < 2)
            return nodes.length;
        const firstDate = new Date(nodes[0].createdAt);
        const lastDate = new Date(nodes[nodes.length - 1].createdAt);
        const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 0 ? nodes.length / daysDiff : nodes.length;
    }
    countStateTransitions(nodes) {
        return nodes.reduce((count, node) => {
            const transitions = node.stateTransitions;
            return count + (transitions?.length ?? 0);
        }, 0);
    }
    calculateSemanticCoverage(clusters) {
        const totalNodes = clusters.reduce((sum, cluster) => sum + cluster.length, 0);
        if (totalNodes === 0)
            return 0;
        const uniqueNodes = new Set(clusters.flatMap(cluster => cluster.map(node => node.id))).size;
        return uniqueNodes / totalNodes;
    }
}
