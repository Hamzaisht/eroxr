import { useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface ErrorReport {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
}

// Global error tracking
const errorTracker = {
  errors: [] as ErrorReport[],
  maxErrors: 50,
  
  addError(report: ErrorReport) {
    this.errors.unshift(report);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  },
  
  getRecentErrors(count = 10) {
    return this.errors.slice(0, count);
  },
  
  clearErrors() {
    this.errors = [];
  }
};

export const useErrorBoundaryOptimization = () => {
  const errorCount = useRef(0);
  const lastErrorTime = useRef(0);

  const handleError = useCallback((error: Error, errorInfo: ErrorInfo) => {
    const now = Date.now();
    
    // Rate limiting: prevent error spam
    if (now - lastErrorTime.current < 1000) {
      errorCount.current++;
      if (errorCount.current > 5) {
        console.warn('Error boundary: Too many errors, suppressing further reports');
        return;
      }
    } else {
      errorCount.current = 1;
    }
    
    lastErrorTime.current = now;

    // Create error report
    const report: ErrorReport = {
      error,
      errorInfo,
      timestamp: now,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Add to error tracker
    errorTracker.addError(report);

    // Log error for debugging
    console.error('🚨 Error Boundary Caught:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      count: errorCount.current
    });

    // Show user-friendly toast
    toast({
      title: "Something went wrong",
      description: "We've detected an issue and are working to fix it. The page will reload shortly.",
      variant: "destructive",
      duration: 5000,
    });

    // Auto-recovery for certain error types
    if (shouldAutoRecover(error)) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, []);

  const getErrorStats = useCallback(() => {
    return {
      recentErrors: errorTracker.getRecentErrors(),
      totalErrors: errorTracker.errors.length,
      errorRate: errorCount.current,
    };
  }, []);

  const clearErrorHistory = useCallback(() => {
    errorTracker.clearErrors();
    errorCount.current = 0;
  }, []);

  return {
    handleError,
    getErrorStats,
    clearErrorHistory,
  };
};

// Helper function to determine if we should auto-recover
function shouldAutoRecover(error: Error): boolean {
  const recoverable = [
    'ChunkLoadError',
    'Loading chunk',
    'Loading CSS chunk',
    'Failed to fetch',
    'NetworkError',
  ];
  
  return recoverable.some(pattern => 
    error.message.includes(pattern) || 
    error.name.includes(pattern)
  );
}