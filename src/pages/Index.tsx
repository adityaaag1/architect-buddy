import { useState } from 'react';
import { Requirement, Architecture, ArchitectureComponent, Connection, TradeOff, FailurePoint } from '@/types/architecture';
import { exampleScenarios } from '@/data/exampleScenarios';
import { RequirementsInput } from '@/components/RequirementsInput';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { TradeOffsAnalysis } from '@/components/TradeOffsAnalysis';
import { Button } from '@/components/ui/button';
import { Cpu, Zap, RefreshCw } from 'lucide-react';

// Architecture generator based on requirements analysis
function generateArchitecture(requirements: Requirement[]): Architecture {
  const hasFunctionalReq = requirements.some(r => r.type === 'functional');
  const hasHighScale = requirements.some(r => 
    r.text.toLowerCase().includes('million') || 
    r.text.toLowerCase().includes('concurrent') ||
    r.text.toLowerCase().includes('scale')
  );
  const hasRealTime = requirements.some(r => 
    r.text.toLowerCase().includes('real-time') || 
    r.text.toLowerCase().includes('realtime') ||
    r.text.toLowerCase().includes('streaming')
  );
  const hasStorage = requirements.some(r =>
    r.text.toLowerCase().includes('store') ||
    r.text.toLowerCase().includes('data') ||
    r.text.toLowerCase().includes('history')
  );

  const components: ArchitectureComponent[] = [
    {
      id: 'lb',
      name: 'Load Balancer',
      type: 'load-balancer',
      description: 'Distributes traffic across service instances',
      cloudProvider: 'AWS',
      suggestedService: 'AWS ALB / CloudFront',
    },
    {
      id: 'gateway',
      name: 'API Gateway',
      type: 'gateway',
      description: 'Handles authentication, rate limiting, and routing',
      cloudProvider: 'AWS',
      suggestedService: 'AWS API Gateway',
    },
    {
      id: 'core-service',
      name: 'Core Service',
      type: 'service',
      description: 'Main business logic and request handling',
      cloudProvider: 'AWS',
      suggestedService: 'AWS ECS / Lambda',
    },
  ];

  if (hasHighScale) {
    components.push({
      id: 'cache',
      name: 'Distributed Cache',
      type: 'cache',
      description: 'In-memory caching for frequently accessed data',
      cloudProvider: 'AWS',
      suggestedService: 'ElastiCache (Redis)',
    });
  }

  if (hasRealTime) {
    components.push({
      id: 'queue',
      name: 'Message Queue',
      type: 'queue',
      description: 'Async event processing and decoupling',
      cloudProvider: 'AWS',
      suggestedService: 'AWS SQS / Kinesis',
    });
    components.push({
      id: 'ws-service',
      name: 'WebSocket Service',
      type: 'service',
      description: 'Real-time bidirectional communication',
      cloudProvider: 'AWS',
      suggestedService: 'AWS API Gateway WS',
    });
  }

  if (hasStorage) {
    components.push({
      id: 'db',
      name: 'Primary Database',
      type: 'database',
      description: 'Persistent data storage with ACID compliance',
      cloudProvider: 'AWS',
      suggestedService: 'Aurora PostgreSQL',
    });
    components.push({
      id: 'storage',
      name: 'Object Storage',
      type: 'storage',
      description: 'Binary and large file storage',
      cloudProvider: 'AWS',
      suggestedService: 'AWS S3',
    });
  }

  if (hasHighScale && hasStorage) {
    components.push({
      id: 'cdn',
      name: 'CDN',
      type: 'cdn',
      description: 'Global content delivery and edge caching',
      cloudProvider: 'AWS',
      suggestedService: 'CloudFront',
    });
  }

  const connections: Connection[] = [
    { from: 'lb', to: 'gateway', type: 'sync', protocol: 'HTTPS' },
    { from: 'gateway', to: 'core-service', type: 'sync', protocol: 'gRPC' },
  ];

  if (hasHighScale) {
    connections.push({ from: 'core-service', to: 'cache', type: 'sync', protocol: 'Redis Protocol' });
  }
  if (hasRealTime) {
    connections.push({ from: 'core-service', to: 'queue', type: 'async', protocol: 'AMQP' });
    connections.push({ from: 'gateway', to: 'ws-service', type: 'sync', protocol: 'WebSocket' });
  }
  if (hasStorage) {
    connections.push({ from: 'core-service', to: 'db', type: 'sync', protocol: 'SQL' });
    connections.push({ from: 'core-service', to: 'storage', type: 'async', protocol: 'S3 API' });
  }

  const tradeOffs: TradeOff[] = [
    {
      category: 'latency',
      description: hasHighScale 
        ? 'Adding cache reduces latency to <10ms for cached data, but introduces cache invalidation complexity'
        : 'Direct database access adds 50-100ms latency per request',
      impact: hasHighScale ? 'positive' : 'negative',
      severity: 'high',
    },
    {
      category: 'cost',
      description: hasHighScale
        ? 'Multi-AZ deployment and auto-scaling increases costs but ensures high availability'
        : 'Simple architecture minimizes infrastructure costs',
      impact: hasHighScale ? 'negative' : 'positive',
      severity: 'medium',
    },
    {
      category: 'scalability',
      description: hasRealTime
        ? 'Event-driven architecture scales horizontally with workload'
        : 'Stateless services can be scaled independently',
      impact: 'positive',
      severity: 'high',
    },
    {
      category: 'complexity',
      description: components.length > 5
        ? 'Distributed system requires sophisticated monitoring and debugging tools'
        : 'Simpler architecture reduces operational overhead',
      impact: components.length > 5 ? 'negative' : 'positive',
      severity: 'medium',
    },
  ];

  const failurePoints: FailurePoint[] = [
    {
      componentId: 'db',
      description: 'Database becomes single point of failure under high load',
      mitigation: 'Implement read replicas and connection pooling. Consider Aurora with automatic failover.',
      severity: 'critical',
    },
    {
      componentId: 'gateway',
      description: 'API Gateway rate limits can block legitimate traffic during spikes',
      mitigation: 'Configure adaptive rate limiting and implement request queuing for burst handling.',
      severity: 'high',
    },
  ];

  if (hasHighScale) {
    failurePoints.push({
      componentId: 'cache',
      description: 'Cache stampede during cache invalidation or cold start',
      mitigation: 'Implement cache warming, probabilistic early expiration, and request coalescing.',
      severity: 'medium',
    });
  }

  if (hasRealTime) {
    failurePoints.push({
      componentId: 'ws-service',
      description: 'WebSocket connections dropped during deployments',
      mitigation: 'Use connection draining and implement client-side reconnection with exponential backoff.',
      severity: 'high',
    });
  }

  return {
    id: Date.now().toString(),
    name: 'Generated Architecture',
    description: `A ${hasHighScale ? 'highly scalable ' : ''}${hasRealTime ? 'real-time ' : ''}system architecture designed for ${requirements.length} requirements`,
    components,
    connections,
    tradeOffs,
    failurePoints: failurePoints.filter(fp => components.some(c => c.id === fp.componentId)),
  };
}

const Index = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [architecture, setArchitecture] = useState<Architecture | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (requirements.length === 0) return;
    
    setIsGenerating(true);
    // Processing time for architecture generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generated = generateArchitecture(requirements);
    setArchitecture(generated);
    setIsGenerating(false);
  };

  const handleScenarioSelect = (scenario: typeof exampleScenarios[0]) => {
    setRequirements(scenario.requirements);
    setArchitecture(null);
  };

  const handleClear = () => {
    setRequirements([]);
    setArchitecture(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(199 89% 48% / 0.08) 0%, transparent 60%)' }} />

      {/* Header */}
      <header className="relative border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Cpu className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  System Architect
                </h1>
                <p className="text-xs text-muted-foreground font-mono">Design Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {requirements.length > 0 && (
                <Button variant="ghost" onClick={handleClear} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
              <Button 
                variant="hero" 
                onClick={handleGenerate}
                disabled={requirements.length === 0 || isGenerating}
                size="lg"
              >
                <Zap className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Architecture'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container py-8 space-y-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RequirementsInput 
            requirements={requirements}
            onRequirementsChange={setRequirements}
          />
          <ScenarioSelector 
            scenarios={exampleScenarios}
            onSelect={handleScenarioSelect}
          />
        </div>

        {/* Architecture Output */}
        <ArchitectureDiagram 
          architecture={architecture}
          isLoading={isGenerating}
        />

        {/* Analysis Section */}
        {architecture && (
          <TradeOffsAnalysis
            tradeOffs={architecture.tradeOffs}
            failurePoints={architecture.failurePoints}
            components={architecture.components}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border py-6 mt-12">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Built for system architects and developers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
