import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-indigo-400">
          <BrainCircuit size={32} />
          <h1 className="text-2xl font-bold text-white tracking-tight">FounderIntel AI</h1>
        </div>
        <div className="text-sm text-slate-400 font-medium hidden sm:block">
          Powered by Gemini 2.5
        </div>
      </div>
    </header>
  );
};