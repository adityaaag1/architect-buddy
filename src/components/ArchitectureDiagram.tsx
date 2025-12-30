import { Architecture, ArchitectureComponent, Connection } from '@/types/architecture';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ArchitectureDiagramProps {
  architecture: Architecture | null;
  isLoading?: boolean;
}

const componentIcons: Record<ArchitectureComponent['type'], string> = {
  'service': '⚙️',
  'database': '🗄️',
  'cache': '⚡',
  'queue': '📬',
  'gateway': '🚪',
  'storage': '📦',
  'cdn': '🌐',
  'load-balancer': '⚖️',
};

const componentColors: Record<ArchitectureComponent['type'], string> = {
  'service': 'border-primary/50 bg-primary/10',
  'database': 'border-success/50 bg-success/10',
  'cache': 'border-warning/50 bg-warning/10',
  'queue': 'border-accent/50 bg-accent/10',
  'gateway': 'border-primary/50 bg-primary/10',
  'storage': 'border-muted-foreground/50 bg-muted/50',
  'cdn': 'border-success/50 bg-success/10',
  'load-balancer': 'border-warning/50 bg-warning/10',
};

export function ArchitectureDiagram({ architecture, isLoading }: ArchitectureDiagramProps) {
  if (isLoading) {
    return (
      <Card variant="glow" className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">🏗️</span>
            Architecture Design
          </CardTitle>
          <CardDescription>Generating your system architecture...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/30 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!architecture) {
    return (
      <Card variant="elevated" className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">🏗️</span>
            Architecture Design
          </CardTitle>
          <CardDescription>Add requirements and generate to see your architecture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Enter your system requirements above, then click "Generate Architecture" to see your system design.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glow" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">🏗️</span>
          {architecture.name}
        </CardTitle>
        <CardDescription>{architecture.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {architecture.components.map((component, index) => (
            <div
              key={component.id}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 animate-scale-in",
                componentColors[component.type]
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{componentIcons[component.type]}</span>
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {component.type}
                </span>
              </div>
              <h4 className="font-semibold text-foreground text-sm">{component.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {component.description}
              </p>
              {component.suggestedService && (
                <div className="mt-2 px-2 py-1 bg-secondary rounded text-xs font-mono text-primary">
                  {component.suggestedService}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Connections Legend */}
        {architecture.connections.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h5 className="text-sm font-semibold text-foreground mb-3">Connections</h5>
            <div className="flex flex-wrap gap-2">
              {architecture.connections.map((conn, index) => {
                const fromComp = architecture.components.find(c => c.id === conn.from);
                const toComp = architecture.components.find(c => c.id === conn.to);
                return (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-secondary/50 rounded-full text-xs flex items-center gap-2"
                  >
                    <span className="text-foreground">{fromComp?.name}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-mono",
                      conn.type === 'sync' ? "bg-primary/20 text-primary" :
                      conn.type === 'async' ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    )}>
                      {conn.type}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground">{toComp?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
