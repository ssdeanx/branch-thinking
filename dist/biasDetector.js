export class BiasDetector {
    constructor() {
        this.biasPatterns = new Map([
            ['confirmation', [
                    /always|never|definitely|certainly/i,
                    /proves|confirms|validates/i
                ]],
            ['anchoring', [
                    /initially|first|original|starting/i,
                    /based on.*earlier/i
                ]],
            ['availability', [
                    /recently|lately|commonly|typically/i,
                    /everyone knows|obvious/i
                ]],
            ['groupthink', [
                    /consensus|agreement|everyone|nobody disagrees/i,
                    /team|group|all of us/i
                ]],
            ['overconfidence', [
                    /absolutely|guaranteed|surely|without doubt/i,
                    /impossible|cannot fail|perfect/i
                ]]
        ]);
        this.biasThresholds = Object.freeze({
            confirmation: 0.7,
            anchoring: 0.6,
            availability: 0.65,
            groupthink: 0.75,
            overconfidence: 0.8
        });
    }
    async detectBias(nodes) {
        const analyses = [];
        for (const [biasType, patterns] of this.biasPatterns.entries()) {
            const affectedNodes = [];
            const evidence = [];
            for (const node of nodes) {
                const matchedPatterns = patterns.filter(pattern => pattern.test(node.label));
                if (matchedPatterns.length > 0) {
                    affectedNodes.push(node.id);
                    evidence.push(`Node ${node.id} shows ${biasType} bias: "${node.label}"`);
                }
            }
            if (affectedNodes.length > 0) {
                const severity = this.calculateBiasSeverity(affectedNodes.length, nodes.length, biasType);
                analyses.push({
                    biasType: biasType,
                    severity,
                    evidence,
                    mitigation: this.generateMitigationStrategies(biasType),
                    affectedNodes
                });
            }
        }
        return Object.freeze(analyses);
    }
    calculateBiasSeverity(affectedCount, totalCount, biasType) {
        if (totalCount === 0)
            return 0;
        const ratio = affectedCount / totalCount;
        const threshold = this.biasThresholds[biasType];
        return Math.min(1, ratio / threshold);
    }
    generateMitigationStrategies(biasType) {
        const strategies = {
            confirmation: [
                "Actively seek contradicting evidence",
                "Consider alternative hypotheses",
                "Review opposing viewpoints"
            ],
            anchoring: [
                "Reset analysis without initial reference",
                "Consider multiple starting points",
                "Evaluate each piece independently"
            ],
            availability: [
                "Gather systematic data",
                "Consider less obvious examples",
                "Look for historical patterns"
            ],
            groupthink: [
                "Encourage independent thinking",
                "Assign devil's advocate role",
                "Seek external perspectives"
            ],
            overconfidence: [
                "Document uncertainty factors",
                "Consider failure scenarios",
                "Perform sensitivity analysis"
            ]
        };
        return Object.freeze(strategies[biasType]);
    }
}
