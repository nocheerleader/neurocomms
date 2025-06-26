import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './organisms/ErrorDisplay';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Here you could send the error to a logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          onReset={this.handleReset}
          type="boundary"
        />
      );
    }

    return this.props.children;
  }
}