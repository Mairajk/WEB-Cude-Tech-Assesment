import { Component } from "react";
import Button from "./Button";

/**
 * ErrorBoundary Component
 * Class component — only class components can be error boundaries in React
 * Catches any JavaScript errors in child component tree
 * Displays fallback UI instead of crashing the whole app
 * @param {ReactNode} children - Components to watch for errors
 * @param {ReactNode} fallback - Optional custom fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    /**
     * hasError — controls whether fallback UI is shown
     * error — stores the caught error for display
     */
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Static method called when a child throws an error
   * Updates state to trigger fallback UI render
   * @param {Error} error - The error that was thrown
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Called after an error is caught
   * Ideal place for logging errors to an external service
   * @param {Error} error - The error that was thrown
   * @param {object} errorInfo - Component stack trace info
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    /**
     * In production you would send this to a service like Sentry
     * console.error for development visibility
     */
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /**
   * Reset error state to retry rendering children
   * Allows user to recover without full page refresh
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      /** Render custom fallback if provided */
      if (this.props.fallback) {
        return this.props.fallback;
      }

      /** Default fallback UI */
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
            <span className="text-5xl mb-4 block">💥</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              An unexpected error occurred. Please try again or refresh the
              page.
            </p>

            {/** Show error details in development only */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
