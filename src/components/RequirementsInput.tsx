import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Requirement } from '@/types/architecture';
import { cn } from '@/lib/utils';

interface RequirementsInputProps {
  requirements: Requirement[];
  onRequirementsChange: (requirements: Requirement[]) => void;
}

export function RequirementsInput({ requirements, onRequirementsChange }: RequirementsInputProps) {
  const [newRequirement, setNewRequirement] = useState('');
  const [newType, setNewType] = useState<'functional' | 'non-functional'>('functional');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    
    const requirement: Requirement = {
      id: Date.now().toString(),
      type: newType,
      text: newRequirement.trim(),
      priority: newPriority,
    };
    
    onRequirementsChange([...requirements, requirement]);
    setNewRequirement('');
  };

  const removeRequirement = (id: string) => {
    onRequirementsChange(requirements.filter(r => r.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addRequirement();
    }
  };

  const priorityColors = {
    high: 'bg-destructive/20 text-destructive border-destructive/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    low: 'bg-success/20 text-success border-success/30',
  };

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">⚡</span>
          Requirements
        </CardTitle>
        <CardDescription>
          Add functional and non-functional requirements for your system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setNewType('functional')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                newType === 'functional' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              Functional
            </button>
            <button
              onClick={() => setNewType('non-functional')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                newType === 'non-functional' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              Non-Functional
            </button>
          </div>
          
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as const).map(p => (
              <button
                key={p}
                onClick={() => setNewPriority(p)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium border transition-all capitalize",
                  newPriority === p 
                    ? priorityColors[p]
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., System must handle 10,000 concurrent users"
              className="flex-1 bg-input border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={addRequirement} size="icon" variant="glow">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {requirements.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No requirements added yet. Start by adding your first requirement above.
            </p>
          ) : (
            requirements.map((req, index) => (
              <div
                key={req.id}
                className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg border border-border animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded font-mono",
                      req.type === 'functional' ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                    )}>
                      {req.type === 'functional' ? 'FR' : 'NFR'}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded border capitalize",
                      priorityColors[req.priority]
                    )}>
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{req.text}</p>
                </div>
                <button
                  onClick={() => removeRequirement(req.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
