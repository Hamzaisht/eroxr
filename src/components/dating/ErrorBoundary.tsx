import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DatingErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dating page error:', error, errorInfo);
    
    // Log to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics.track('dating_page_error', { error: error.message, stack: error.stack });
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen dating-gradient-bg flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="dating-glass-panel rounded-2xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="dating-title text-2xl font-bold mb-2">
                Oops! Something went wrong
              </h2>
              <p className="dating-subtitle text-sm">
                We encountered an error while loading the dating experience. Don't worry, we're on it!
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full dating-glass-panel border-white/20 hover:border-white/40 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </motion.div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-left"
              >
                <summary className="cursor-pointer text-sm text-white/60 hover:text-white/80">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-300 bg-red-900/20 p-3 rounded-lg overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional error boundary hook for specific components
export function useDatingErrorHandler() {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Dating component error:', error);
    
    // Show user-friendly toast or notification
    // toast.error('Something went wrong. Please try again.');
    
    // Log to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics.track('dating_component_error', { error: error.message, context: errorInfo });
    }
  };

  return { handleError };
}