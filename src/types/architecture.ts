export interface Requirement {
  id: string;
  type: 'functional' | 'non-functional';
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'gateway' | 'storage' | 'cdn' | 'load-balancer';
  description: string;
  cloudProvider?: string;
  suggestedService?: string;
}

export interface Connection {
  from: string;
  to: string;
  type: 'sync' | 'async' | 'event';
  protocol?: string;
}

export interface TradeOff {
  category: 'latency' | 'cost' | 'scalability' | 'reliability' | 'complexity';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  severity: 'high' | 'medium' | 'low';
}

export interface FailurePoint {
  componentId: string;
  description: string;
  mitigation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface Architecture {
  id: string;
  name: string;
  description: string;
  components: ArchitectureComponent[];
  connections: Connection[];
  tradeOffs: TradeOff[];
  failurePoints: FailurePoint[];
}

export interface ExampleScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirements: Requirement[];
}
