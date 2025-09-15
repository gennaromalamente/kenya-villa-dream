import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ErrorLog {
  id: string;
  timestamp: Date;
  type: 'error' | 'warning' | 'info';
  source: string;
  message: string;
  details?: any;
}

interface ErrorConsoleContextType {
  logs: ErrorLog[];
  addLog: (type: ErrorLog['type'], source: string, message: string, details?: any) => void;
  clearLogs: () => void;
  isVisible: boolean;
  toggleConsole: () => void;
}

const ErrorConsoleContext = createContext<ErrorConsoleContextType | undefined>(undefined);

export const useErrorConsole = () => {
  const context = useContext(ErrorConsoleContext);
  if (!context) {
    throw new Error('useErrorConsole must be used within an ErrorConsoleProvider');
  }
  return context;
};

export const ErrorConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addLog = useCallback((type: ErrorLog['type'], source: string, message: string, details?: any) => {
    const newLog: ErrorLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      source,
      message,
      details
    };
    
    setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
    
    // Also log to browser console for debugging
    const logMessage = `[${source}] ${message}`;
    if (type === 'error') {
      console.error(logMessage, details);
    } else if (type === 'warning') {
      console.warn(logMessage, details);
    } else {
      console.info(logMessage, details);
    }
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const toggleConsole = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return (
    <ErrorConsoleContext.Provider value={{
      logs,
      addLog,
      clearLogs,
      isVisible,
      toggleConsole
    }}>
      {children}
    </ErrorConsoleContext.Provider>
  );
};