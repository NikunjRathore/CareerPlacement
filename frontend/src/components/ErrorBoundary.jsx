import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-red-400 text-3xl mb-4">⚠️</div>
            <h1 className="text-white text-xl font-bold mb-4">Something went wrong</h1>
            <p className="text-slate-300 mb-6 text-sm break-words">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
