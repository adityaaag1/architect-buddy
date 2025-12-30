import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExampleScenario } from '@/types/architecture';
import { cn } from '@/lib/utils';

interface ScenarioSelectorProps {
  scenarios: ExampleScenario[];
  onSelect: (scenario: ExampleScenario) => void;
}

export function ScenarioSelector({ scenarios, onSelect }: ScenarioSelectorProps) {
  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">📋</span>
          Example Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={cn(
                "p-4 rounded-lg border border-border bg-secondary/30 text-left transition-all duration-200",
                "hover:border-primary/50 hover:bg-secondary/50 hover:shadow-lg hover:shadow-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{scenario.icon}</span>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  <p className="text-xs text-primary font-mono">
                    {scenario.requirements.length} requirements
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
