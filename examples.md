# Branch Thinking Examples

Below are some examples of prompts that can be used with the branch-thinking MCP tool. You should prepend instructions for Claude to explicitly use branch-thinking if your system prompt or Claude profile settings do not do so already. See the README.

## Adversarial Thinking / Red Teaming

Analyze security from multiple perspectives, tracking attack vectors and defenses:

```javascript
// Main branch - system description
{
  "content": "Proposed system: Users can reset passwords via email link plus answering two security questions.",
  "type": "system_design",
  "keyPoints": ["email verification", "security questions", "password reset"]
}

// Attack branch - examining vulnerabilities
{
  "content": "Examining potential social engineering vectors targeting the security question system.",
  "type": "threat_analysis",
  "branchId": "attack-vectors",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "analyzes",
    "reason": "Identifying vulnerabilities in security questions",
    "strength": 0.9
  }],
  "keyPoints": ["social media mining", "phishing risks", "question predictability"]
}

// Defense branch - countermeasures
{
  "content": "Implement ML-based anomaly detection for suspicious reset patterns.",
  "type": "mitigation",
  "branchId": "defense-ml",
  "crossRefs": [{
    "toBranch": "attack-vectors",
    "type": "counters",
    "reason": "Detects automated social engineering attempts",
    "strength": 0.85
  }]
}
```

## Scientific Method Application

Apply scientific method to problem investigation:

```javascript
// Main observation
{
  "content": "System exhibits 2-3 second delays during peak hours despite hardware upgrades.",
  "type": "observation",
  "keyPoints": ["peak hours", "latency", "hardware sufficient"]
}

// First hypothesis
{
  "content": "Network congestion at the load balancer level is causing request queuing.",
  "type": "hypothesis",
  "branchId": "network-hypothesis",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "explains",
    "reason": "Network bottleneck could explain timing correlation",
    "strength": 0.75
  }]
}

// Experiment design
{
  "content": "Deploy network monitoring at load balancer with packet analysis during peak hours.",
  "type": "experiment",
  "branchId": "network-test",
  "crossRefs": [{
    "toBranch": "network-hypothesis",
    "type": "tests",
    "reason": "Will verify network congestion theory",
    "strength": 0.9
  }]
}
```

## Design Pattern Exploration

Compare and combine different design patterns:

```javascript
// Main requirement
{
  "content": "Need to design a plugin system that allows third-party developers to extend application functionality.",
  "type": "requirement",
  "keyPoints": ["extensibility", "third-party", "plugin interface"]
}

// Strategy Pattern approach
{
  "content": "Implement using Strategy pattern: define plugin interface, allow runtime loading of implementations.",
  "type": "pattern_analysis",
  "branchId": "strategy-pattern",
  "keyPoints": ["interface definition", "runtime loading", "loose coupling"]
}

// Observer Pattern combination
{
  "content": "Use Observer pattern for plugins to react to application events without tight coupling.",
  "type": "pattern_analysis",
  "branchId": "observer-pattern",
  "crossRefs": [{
    "toBranch": "strategy-pattern",
    "type": "complements",
    "reason": "Can combine with Strategy for event-driven plugins",
    "strength": 0.85
  }]
}
```

## Debate Mapping

Map out complex debates and positions:

```javascript
// Central claim
{
  "content": "AI monitoring systems should be mandatory in all production code deployments.",
  "type": "claim",
  "keyPoints": ["AI monitoring", "mandatory implementation", "production code"]
}

// Supporting argument
{
  "content": "AI systems can detect anomalies and potential failures faster than human monitoring.",
  "type": "argument_pro",
  "branchId": "pro-detection",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "supports",
    "reason": "Demonstrates clear technical advantage",
    "strength": 0.9
  }]
}

// Counter argument
{
  "content": "False positives from AI systems could lead to unnecessary downtime and team fatigue.",
  "type": "argument_con",
  "branchId": "con-reliability",
  "crossRefs": [{
    "toBranch": "pro-detection",
    "type": "challenges",
    "reason": "Questions reliability assumption",
    "strength": 0.8
  }]
}
```

## Strategy Development

Develop strategic plans with scenarios and responses:

```javascript
// Main strategy
{
  "content": "Propose migrating our on-premise systems to cloud infrastructure over 18 months.",
  "type": "strategy",
  "keyPoints": ["cloud migration", "18-month timeline", "on-premise transition"]
}

// Risk scenario
{
  "content": "What if we experience data sovereignty issues in key markets?",
  "type": "scenario",
  "branchId": "sovereignty-risk",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "risk_analysis",
    "reason": "Critical regulatory consideration",
    "strength": 0.9
  }]
}

// Response plan
{
  "content": "Hybrid cloud approach using local data centers for affected regions.",
  "type": "response",
  "branchId": "hybrid-solution",
  "crossRefs": [{
    "toBranch": "sovereignty-risk",
    "type": "addresses",
    "reason": "Provides regulatory compliance solution",
    "strength": 0.95
  }]
}
```

## Complex Debugging

Navigate complex debugging scenarios:

```javascript
// Bug description
{
  "content": "Users report random session terminations during file uploads larger than 100MB.",
  "type": "bug_report",
  "keyPoints": ["session termination", "large uploads", "intermittent"]
}

// First hypothesis
{
  "content": "Timeout settings in load balancer might be too aggressive for large uploads.",
  "type": "hypothesis",
  "branchId": "timeout-theory",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "explains",
    "reason": "Would account for size correlation",
    "strength": 0.8
  }]
}

// Test plan
{
  "content": "Monitor timeout events in load balancer logs during large file uploads.",
  "type": "test",
  "branchId": "timeout-test",
  "crossRefs": [{
    "toBranch": "timeout-theory",
    "type": "validates",
    "reason": "Will confirm timeout hypothesis",
    "strength": 0.9
  }]
}
```

## Requirements Analysis

Break down complex requirements:

```javascript
// Main requirements
{
  "content": "Need secure but user-friendly authentication for mobile banking app.",
  "type": "requirement",
  "keyPoints": ["security", "user experience", "mobile context"]
}

// User needs branch
{
  "content": "Users want quick access without remembering complex passwords.",
  "type": "user_requirement",
  "branchId": "user-needs",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "stakeholder_input",
    "reason": "Primary user concern",
    "strength": 0.9
  }]
}

// Security requirements
{
  "content": "Must meet FFIEC authentication guidelines and protect against common mobile attack vectors.",
  "type": "security_requirement",
  "branchId": "security-needs",
  "crossRefs": [{
    "toBranch": "user-needs",
    "type": "constrains",
    "reason": "May limit some quick-access options",
    "strength": 0.7
  }]
}
```

## Trade-off Analysis

Analyze complex trade-offs between different approaches:

```javascript
// Main context
{
  "content": "Need to choose a state management approach for a large-scale React application with real-time updates.",
  "type": "context",
  "keyPoints": ["large scale", "real-time", "React", "state management"]
}

// Redux analysis
{
  "content": "Using Redux with middleware for real-time updates. Provides centralized store and clear data flow.",
  "type": "solution",
  "branchId": "redux-approach",
  "keyPoints": ["centralized", "middleware", "predictable"],
  "confidence": 0.85
}

// Context+Hooks alternative
{
  "content": "Using React Context with custom hooks for local state. More flexible but potential prop drilling issues.",
  "type": "solution",
  "branchId": "context-approach",
  "crossRefs": [{
    "toBranch": "redux-approach",
    "type": "alternative",
    "reason": "Lighter weight solution with different trade-offs",
    "strength": 0.8
  }]
}
```

## System Evolution Planning

Plan system evolution over time:

```javascript
// Current state
{
  "content": "Current logging system uses ELK stack with custom parsers, serving 100GB/day.",
  "type": "analysis",
  "keyPoints": ["ELK stack", "custom parsers", "100GB daily"]
}

// Short-term improvements
{
  "content": "Optimize Elasticsearch indices and implement log rotation policies.",
  "type": "plan",
  "branchId": "short-term",
  "crossRefs": [{
    "toBranch": "main-[timestamp]",
    "type": "enhances",
    "reason": "Immediate optimizations for current system",
    "strength": 0.9
  }]
}

// Long-term vision
{
  "content": "Transition to cloud-native observability platform with OpenTelemetry.",
  "type": "vision",
  "branchId": "long-term",
  "crossRefs": [{
    "toBranch": "short-term",
    "type": "builds_upon",
    "reason": "Evolution of logging architecture",
    "strength": 0.7
  }]
}
```

## Feature Decomposition

Break down complex features:

```javascript
// Feature request
{
  "content": "Implement 'collaborative document editing' with real-time updates and conflict resolution.",
  "type": "feature",
  "keyPoints": ["collaboration", "real-time", "conflict resolution"]
}

// UI/UX component
{
  "content": "Design user interface for concurrent editing and conflict visualization.",
  "type": "ui_design",
  "branchId": "ui-layer",
  "keyPoints": ["cursor tracking", "change highlighting", "conflict indicators"]
}

// Data model
{
  "content": "Implement CRDT data structure for text with vector clocks.",
  "type": "technical",
  "branchId": "data-layer",
  "crossRefs": [{
    "toBranch": "ui-layer",
    "type": "supports",
    "reason": "Provides data structure for real-time updates",
    "strength": 0.9
  }]
}
```

## Risk Assessment/Mitigation

Analyze and mitigate risks:

```javascript
// Risk overview
{
  "content": "Identify and assess risks in transitioning from monolith to microservices.",
  "type": "assessment",
  "keyPoints": ["architectural change", "service boundaries", "operational complexity"]
}

// Technical risks
{
  "content": "Inter-service communication reliability, data consistency across services, deployment complexity.",
  "type": "risk_category",
  "branchId": "technical-risks",
  "keyPoints": ["network reliability", "data consistency", "deployment"]
}

// Mitigation strategies
{
  "content": "Implement circuit breakers, saga pattern for transactions, automated deployment pipeline.",
  "type": "mitigation",
  "branchId": "technical-mitigations",
  "crossRefs": [{
    "toBranch": "technical-risks",
    "type": "addresses",
    "reason": "Direct mitigation of identified risks",
    "strength": 0.9
  }]
}
```

## Competitive Analysis

Analyze competitive positioning:

```javascript
// Market overview
{
  "content": "Developer productivity tools market analysis, focusing on CI/CD space.",
  "type": "market_analysis",
  "keyPoints": ["CI/CD", "developer tools", "market segments"]
}

// Competitor analysis
{
  "content": "Market leader focuses on enterprise, strong integration ecosystem but complex pricing.",
  "type": "competitor_analysis",
  "branchId": "competitor-a",
  "keyPoints": ["enterprise focus", "integrations", "complex pricing"]
}

// Differentiation strategy
{
  "content": "Focus on developer experience with AI-assisted workflow optimization.",
  "type": "strategy",
  "branchId": "differentiation",
  "crossRefs": [{
    "toBranch": "competitor-a",
    "type": "differentiates",
    "reason": "Targets pain points in competitor offering",
    "strength": 0.9
  }]
}
```

## API Design Evolution

Plan API versioning and evolution:

```javascript
// Current API
{
  "content": "RESTful API serving mobile and web clients, considering breaking changes needed.",
  "type": "context",
  "keyPoints": ["REST", "multiple clients", "breaking changes"]
}

// URI versioning approach
{
  "content": "Version in URI path (/v2/resources). Simple but leads to code duplication.",
  "type": "approach",
  "branchId": "uri-version",
  "keyPoints": ["path versioning", "code duplication", "client simplicity"]
}

// Header versioning alternative
{
  "content": "Version in Accept header. Cleaner URLs but more complex client handling.",
  "type": "approach",
  "branchId": "header-version",
  "crossRefs": [{
    "toBranch": "uri-version",
    "type": "alternative",
    "reason": "Different trade-offs in complexity vs. cleanliness",
    "strength": 0.85
  }]
}
```

## Technology Stack Migration

Plan technology migrations:

```javascript
// Migration scope
{
  "content": "Large Angular 8 application with 200+ components needs migration to React 18.",
  "type": "context",
  "keyPoints": ["Angular 8", "React 18", "large application"]
}

// Parallel approach
{
  "content": "Run both frameworks simultaneously, migrate feature by feature.",
  "type": "strategy",
  "branchId": "parallel-migration",
  "keyPoints": ["dual frameworks", "feature migration", "gradual transition"]
}

// State management bridge
{
  "content": "Implement framework-agnostic state management using Redux.",
  "type": "technical",
  "branchId": "state-bridge",
  "crossRefs": [{
    "toBranch": "parallel-migration",
    "type": "enables",
    "reason": "Allows data sharing between frameworks",
    "strength": 0.9
  }]
}
```