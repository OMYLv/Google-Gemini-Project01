import { AlertTriangle, CheckCircle, Info, X, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function ResultsPanel({ results, error, isProcessing, onClear }) {
  if (isProcessing) {
    return (
      <div className="card border-2 border-purple-500/30">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin" strokeWidth={3} />
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 rounded-full animate-ping"></div>
          </div>
          <p className="text-white font-bold text-xl mt-6">Processing your input...</p>
          <p className="text-purple-300 mt-2">AI is analyzing and generating insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-white">Error</h3>
          </div>
          <button onClick={onClear} className="text-red-300 hover:text-white transition-colors">
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-red-200 font-medium">{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="card border-2 border-white/20 bg-gradient-to-br from-white/5 to-white/10">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-lg border-2 border-purple-500/30 animate-float">
            <Info className="w-12 h-12 text-purple-400 animate-pulse" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Awaiting Input
          </h3>
          <p className="text-purple-300 max-w-xs">
            Submit your input to see AI-powered analysis and actionable recommendations
          </p>
        </div>
      </div>
    );
  }

  const urgencyColors = {
    low: 'from-green-500 to-green-600',
    medium: 'from-yellow-500 to-yellow-600',
    high: 'from-orange-500 to-orange-600',
    critical: 'from-red-500 to-red-600'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card border-2 border-purple-500/30">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 w-1.5 h-8 rounded-full animate-pulse"></span>
              Analysis Results
            </h2>
            <p className="text-purple-300 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Generated at {new Date().toLocaleTimeString()}
            </p>
          </div>
          <button onClick={onClear} className="text-purple-300 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Urgency Badge */}
        <div className={clsx(
          'inline-flex items-center space-x-3 px-6 py-3 rounded-2xl text-white font-black mb-6 shadow-lg animate-pulse-slow',
          `bg-gradient-to-r ${urgencyColors[results.urgencyLevel] || urgencyColors.medium}`
        )}>
          <AlertTriangle className="w-5 h-5 animate-bounce" strokeWidth={2.5} />
          <span className="uppercase text-sm tracking-wider">{results.urgencyLevel} Priority</span>
        </div>

        {/* Confidence */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-300 font-semibold">Confidence Level</span>
            <span className="font-black text-white text-lg">
              {((results.confidence || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-lg border border-white/20">
            <div
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/50"
              style={{ width: `${(results.confidence || 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        {results.extractedData?.summary && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-lg group hover:border-purple-500/50 transition-all duration-300">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              Summary
            </h3>
            <p className="text-purple-100 leading-relaxed">{results.extractedData.summary}</p>
          </div>
        )}
      </div>

      {/* Key Points */}
      {results.extractedData?.keyPoints && results.extractedData.keyPoints.length > 0 && (
        <div className="card border-2 border-white/20">
          <h3 className="font-black text-xl text-white mb-5 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 w-1.5 h-6 rounded-full animate-pulse"></span>
            Key Points
          </h3>
          <ul className="space-y-3">
            {results.extractedData.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-3 group">
                <div className="mt-1">
                  <CheckCircle className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110" strokeWidth={2.5} />
                </div>
                <span className="text-purple-100 leading-relaxed flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      {results.recommendedActions && results.recommendedActions.length > 0 && (
        <div className="card border-2 border-white/20">
          <h3 className="font-black text-xl text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 w-1.5 h-6 rounded-full animate-pulse"></span>
            Recommended Actions
          </h3>
          <div className="space-y-4">
            {results.recommendedActions.map((action, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/20 backdrop-blur-lg hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-white text-lg flex-1 pr-4">{action.action}</h4>
                    <span className={clsx(
                      'px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider',
                      action.priority === 'critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' :
                      action.priority === 'high' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50' :
                      action.priority === 'medium' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' :
                      'bg-green-500 text-white shadow-lg shadow-green-500/50'
                    )}>
                      {action.priority}
                    </span>
                  </div>
                  <div className="text-sm text-purple-200 space-y-2 font-medium">
                    <p><strong className="text-purple-300">Responsible:</strong> {action.responsible}</p>
                    <p><strong className="text-purple-300">Timeframe:</strong> {action.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {results.alerts && results.alerts.length > 0 && (
        <div className="card border-2 border-yellow-500/30">
          <h3 className="font-black text-xl text-white mb-5 flex items-center gap-3">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 w-1.5 h-6 rounded-full animate-pulse"></span>
            Alerts
          </h3>
          <div className="space-y-3">
            {results.alerts.map((alert, index) => (
              <div
                key={index}
                className={clsx(
                  'p-5 rounded-2xl flex items-start space-x-3 border-2 backdrop-blur-lg transition-all duration-300 hover:scale-102 group',
                  alert.type === 'critical' ? 'bg-red-500/20 border-red-500/50' :
                  alert.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50' :
                  'bg-blue-500/20 border-blue-500/50'
                )}
              >
                <AlertTriangle className={clsx(
                  'w-6 h-6 flex-shrink-0 mt-0.5 group-hover:animate-bounce',
                  alert.type === 'critical' ? 'text-red-400' :
                  alert.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                )} strokeWidth={2.5} />
                <span className={clsx(
                  'text-sm font-medium leading-relaxed',
                  alert.type === 'critical' ? 'text-red-100' :
                  alert.type === 'warning' ? 'text-yellow-100' :
                  'text-blue-100'
                )}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <span className="text-purple-300 font-semibold">Input Type</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="font-black text-white capitalize text-lg">
                {results.inputType}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-purple-300 font-semibold">Verification</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="font-black text-white capitalize text-lg">
                {results.verificationStatus?.replace(/-/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
