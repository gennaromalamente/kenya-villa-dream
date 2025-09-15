import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useErrorConsole, type ErrorLog } from '@/contexts/ErrorConsoleContext';
import { useState } from 'react';

const ErrorConsole: React.FC = () => {
  const { logs, clearLogs, isVisible, toggleConsole } = useErrorConsole();
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  if (!isVisible) return null;

  const getLogIcon = (type: ErrorLog['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info':
        return <Info className="w-4 h-4 text-info" />;
    }
  };

  const getLogBadgeVariant = (type: ErrorLog['type']) => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'secondary' as const;
      case 'info':
        return 'outline' as const;
    }
  };

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <Card className="shadow-2xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Error Console
              {logs.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {logs.length}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearLogs}
                className="h-6 w-6 p-0"
                disabled={logs.length === 0}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleConsole}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-80">
            {logs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No errors logged yet
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {logs.map((log) => {
                  const isExpanded = expandedLogs.has(log.id);
                  return (
                    <div
                      key={log.id}
                      className="border rounded-md p-2 bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggleExpanded(log.id)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                        
                        <div className="flex-shrink-0 mt-0.5">
                          {getLogIcon(log.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={getLogBadgeVariant(log.type)}
                              className="text-xs"
                            >
                              {log.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(log.timestamp)}
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {log.source}
                            </span>
                          </div>
                          
                          <div className="text-sm text-foreground break-words">
                            {log.message}
                          </div>
                          
                          {isExpanded && log.details && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-muted-foreground">Details:</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(JSON.stringify(log.details, null, 2))}
                                  className="h-4 w-4 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <pre className="whitespace-pre-wrap break-words text-xs">
                                {typeof log.details === 'string' 
                                  ? log.details 
                                  : JSON.stringify(log.details, null, 2)
                                }
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorConsole;