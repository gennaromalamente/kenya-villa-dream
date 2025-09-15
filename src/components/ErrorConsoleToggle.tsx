import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, AlertCircle } from 'lucide-react';
import { useErrorConsole } from '@/contexts/ErrorConsoleContext';

const ErrorConsoleToggle: React.FC = () => {
  const { logs, isVisible, toggleConsole } = useErrorConsole();
  
  const errorCount = logs.filter(log => log.type === 'error').length;
  const hasErrors = errorCount > 0;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        variant={hasErrors ? "destructive" : "outline"}
        size="sm"
        onClick={toggleConsole}
        className={`
          flex items-center gap-2 shadow-lg
          ${isVisible ? 'bg-primary text-primary-foreground' : ''}
          ${hasErrors ? 'animate-pulse' : ''}
        `}
      >
        {hasErrors ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Bug className="w-4 h-4" />
        )}
        
        <span className="hidden sm:inline">
          Console
        </span>
        
        {logs.length > 0 && (
          <Badge 
            variant={hasErrors ? "secondary" : "outline"}
            className="ml-1 text-xs"
          >
            {logs.length}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default ErrorConsoleToggle;