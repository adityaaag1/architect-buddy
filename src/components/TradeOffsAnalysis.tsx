import { TradeOff, FailurePoint, ArchitectureComponent } from '@/types/architecture';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';

interface TradeOffsAnalysisProps {
  tradeOffs: TradeOff[];
  failurePoints: FailurePoint[];
  components: ArchitectureComponent[];
}

const categoryIcons = {
  latency: '⚡',
  cost: '💰',
  scalability: '📈',
  reliability: '🛡️',
  complexity: '🧩',
};

const categoryColors = {
  latency: 'bg-warning/20 text-warning border-warning/30',
  cost: 'bg-success/20 text-success border-success/30',
  scalability: 'bg-primary/20 text-primary border-primary/30',
  reliability: 'bg-accent/20 text-accent border-accent/30',
  complexity: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

const severityColors = {
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-destructive/80 text-destructive-foreground',
  medium: 'bg-warning text-warning-foreground',
  low: 'bg-muted text-muted-foreground',
};

export function TradeOffsAnalysis({ tradeOffs, failurePoints, components }: TradeOffsAnalysisProps) {
  if (tradeOffs.length === 0 && failurePoints.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trade-offs Panel */}
      {tradeOffs.length > 0 && (
        <Card variant="elevated" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">⚖️</span>
              Trade-offs Analysis
            </CardTitle>
            <CardDescription>
              Key considerations for your architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tradeOffs.map((tradeOff, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border animate-slide-in-right",
                    categoryColors[tradeOff.category]
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{categoryIcons[tradeOff.category]}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold capitalize">{tradeOff.category}</span>
                        {tradeOff.impact === 'positive' && <TrendingUp className="h-4 w-4 text-success" />}
                        {tradeOff.impact === 'negative' && <TrendingDown className="h-4 w-4 text-destructive" />}
                        {tradeOff.impact === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full capitalize",
                          tradeOff.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                          tradeOff.severity === 'medium' ? 'bg-warning/20 text-warning' :
                          'bg-muted text-muted-foreground'
                        )}>
                          {tradeOff.severity}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{tradeOff.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failure Points Panel */}
      {failurePoints.length > 0 && (
        <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Failure Points
            </CardTitle>
            <CardDescription>
              Potential vulnerabilities and mitigations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failurePoints.map((point, index) => {
                const component = components.find(c => c.id === point.componentId);
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-secondary/30 animate-slide-in-right"
                    style={{ animationDelay: `${(index + tradeOffs.length) * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        severityColors[point.severity]
                      )} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {component?.name || 'Unknown'}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full capitalize",
                            severityColors[point.severity]
                          )}>
                            {point.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{point.description}</p>
                        <div className="flex items-start gap-2 p-2 bg-success/10 rounded border border-success/20">
                          <Shield className="h-4 w-4 text-success mt-0.5" />
                          <p className="text-xs text-success">{point.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
