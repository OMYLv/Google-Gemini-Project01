import { Sparkles, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header 
      className="glass-effect border-b border-white/30 sticky top-0 z-50 backdrop-blur-2xl"
      role="banner"
      aria-label="Main header"
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative" role="img" aria-label="Universal Bridge AI logo">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-4 rounded-2xl shadow-2xl">
                <Sparkles 
                  className="w-8 h-8 text-white animate-spin-slow" 
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                Universal Bridge AI
              </h1>
              <p className="text-sm text-purple-300 font-medium mt-1 flex items-center gap-2">
                <Zap 
                  className="w-4 h-4 text-yellow-400 animate-pulse" 
                  aria-hidden="true"
                />
                <span>Connecting Intent with Action</span>
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <div 
              className="flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg px-6 py-3 rounded-full border border-green-400/30 shadow-lg shadow-green-500/20"
              role="status"
              aria-live="polite"
              aria-label="System status indicator"
            >
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" aria-hidden="true"></div>
              </div>
              <span className="text-sm font-bold text-green-300">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
