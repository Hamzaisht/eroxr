import React, { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PlatformErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Platform Error Boundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-luxury-gradient p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-luxury-darker/95 backdrop-blur-xl rounded-2xl p-8 text-center border border-luxury-primary/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
            >
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </motion.div>

            <h2 className="text-xl font-bold text-white mb-4">
              Something went wrong
            </h2>
            
            <p className="text-luxury-muted mb-6">
              We encountered an unexpected error. This has been logged and our team will investigate.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <code className="text-sm text-red-300 break-words">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="border-luxury-primary/30 text-luxury-neutral hover:bg-luxury-primary/20"
              >
                Try Again
              </Button>
              
              <Button
                onClick={this.handleRefresh}
                className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/80 hover:to-luxury-accent/80"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}