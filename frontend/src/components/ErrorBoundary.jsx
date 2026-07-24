import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-slate-900/80 p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-400">
              The app hit a render error. Refreshing should recover the UI.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-6 rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
