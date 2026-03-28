import { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import UseCaseSelector from './components/UseCaseSelector';
import StatsBar from './components/StatsBar';
import { aiService } from './services/api';

function App() {
  const [selectedUseCase, setSelectedUseCase] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    criticalAlerts: 0,
    avgConfidence: 0
  });

  const handleProcess = async (inputData) => {
    setIsProcessing(true);
    setError(null);

    try {
      let response;

      if (inputData.type === 'text') {
        response = await aiService.processText(
          inputData.text,
          inputData.context,
          inputData.priority
        );
      } else if (inputData.type === 'multimodal') {
        response = await aiService.processMultiModal({
          text: inputData.text,
          imageData: inputData.imageData,
          useCase: selectedUseCase,
        });
      } else if (inputData.type === 'voice') {
        response = await aiService.processVoice(
          inputData.transcribedText,
          inputData.context
        );
      }

      setResults(response.data);
      
      // Update stats
      setStats(prev => ({
        totalProcessed: prev.totalProcessed + 1,
        criticalAlerts: prev.criticalAlerts + (response.data.urgencyLevel === 'critical' ? 1 : 0),
        avgConfidence: ((prev.avgConfidence * prev.totalProcessed) + (response.data.confidence || 0)) / (prev.totalProcessed + 1)
      }));

    } catch (err) {
      setError(err.message);
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearResults = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-6 py-12 max-w-7xl">
          <StatsBar stats={stats} />
          
          <div className="mb-10">
            <UseCaseSelector 
              selected={selectedUseCase} 
              onSelect={setSelectedUseCase} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InputPanel
                useCase={selectedUseCase}
                onProcess={handleProcess}
                isProcessing={isProcessing}
              />
            </div>

            <div>
              <ResultsPanel
                results={results}
                error={error}
                isProcessing={isProcessing}
                onClear={handleClearResults}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 hover:border-blue-500/50 transform hover:scale-105 transition-all duration-300 group">
              <div className="text-5xl mb-4 animate-bounce-slow">🎯</div>
              <h3 className="font-black text-xl text-white mb-3">Multi-Modal Processing</h3>
              <p className="text-blue-100 leading-relaxed">
                Process text, images, voice, and structured data seamlessly with AI-powered understanding.
              </p>
            </div>
            
            <div className="card bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 hover:border-purple-500/50 transform hover:scale-105 transition-all duration-300 group">
              <div className="text-5xl mb-4 animate-pulse">⚡</div>
              <h3 className="font-black text-xl text-white mb-3">Real-Time Analysis</h3>
              <p className="text-purple-100 leading-relaxed">
                Get instant, actionable insights with structured recommendations and priority assessment.
              </p>
            </div>
            
            <div className="card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 hover:border-green-500/50 transform hover:scale-105 transition-all duration-300 group">
              <div className="text-5xl mb-4 animate-wiggle">🛡️</div>
              <h3 className="font-black text-xl text-white mb-3">Secure & Reliable</h3>
              <p className="text-green-100 leading-relaxed">
                Enterprise-grade security with rate limiting, validation, and zero-vulnerability architecture.
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-20 py-8 border-t border-white/10 bg-black/20 backdrop-blur-lg">
          <div className="container mx-auto px-6 text-center">
            <p className="text-purple-200 font-medium">
              Built with <span className="text-red-400">❤️</span> for societal benefit | Powered by Google Gemini AI
            </p>
            <p className="text-purple-300/70 text-sm mt-2">
              Universal Bridge AI - Connecting Human Intent with Complex Systems
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
