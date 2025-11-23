import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { analyzeProduct } from './services/geminiService';
import { AppView, AnalysisResult } from './types';

function App() {
  const [view, setView] = useState<AppView>(AppView.INPUT);
  const [productDescription, setProductDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisStart = async (description: string) => {
    setProductDescription(description);
    setView(AppView.LOADING);
    setError(null);

    try {
      const result = await analyzeProduct(description);
      setAnalysisResult(result);
      setView(AppView.DASHBOARD);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze product. Please try again with a more detailed description.");
      setView(AppView.INPUT);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setProductDescription('');
    setView(AppView.INPUT);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30">
      <Header />
      
      <main>
        {view === AppView.INPUT && (
          <>
             {error && (
              <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-center">
                {error}
              </div>
            )}
            <InputSection 
              onSubmit={handleAnalysisStart} 
              isAnalyzing={false} 
            />
          </>
        )}

        {view === AppView.LOADING && (
           <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-b-cyan-500 rounded-full animate-spin-slow opacity-50"></div>
              </div>
              <h2 className="mt-8 text-2xl font-bold text-white">Analyzing Market Data</h2>
              <p className="text-slate-400 mt-2 text-center max-w-md animate-pulse">
                Identifying ideal segments, hallucinating personas, and formulating strategy...
              </p>
           </div>
        )}

        {view === AppView.DASHBOARD && analysisResult && (
          <Dashboard 
            result={analysisResult} 
            productContext={productDescription}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;