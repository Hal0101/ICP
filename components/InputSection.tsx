import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (description: string) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isAnalyzing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  const examples = [
    "A B2B SaaS tool that helps remote engineering teams automate their daily standups via Slack.",
    "An organic, high-protein meal replacement shake designed for busy parents.",
    "A freelance marketplace specifically for AI prompt engineers and specialized data labelers."
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfect Customer</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Describe your product, and our AI will generate detailed Ideal Customer Profiles (ICPs), 
          marketing strategies, and let you simulate conversations with them.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-slate-800 rounded-xl p-2 flex flex-col md:flex-row items-start gap-2 shadow-2xl border border-slate-700">
          <textarea
            className="w-full bg-transparent text-white p-4 text-lg placeholder-slate-500 focus:outline-none resize-none min-h-[120px]"
            placeholder="Describe your product or service in detail..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAnalyzing}
          />
          <div className="p-2 self-end md:self-center">
            <button
              type="submit"
              disabled={!input.trim() || isAnalyzing}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-white transition-all duration-300
                ${!input.trim() || isAnalyzing 
                  ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/30 active:scale-95'
                }`}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate ICPs
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-12 grid gap-4 w-full">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center mb-2">Try an example</p>
        <div className="grid md:grid-cols-3 gap-4">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="text-left text-sm p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50 text-slate-300 transition-colors"
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};