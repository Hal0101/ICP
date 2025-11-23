import React, { useState } from 'react';
import { AnalysisResult, Persona } from '../types';
import { PersonaCard } from './PersonaCard';
import { InsightsChart } from './InsightsChart';
import { PersonaChat } from './PersonaChat';
import { LayoutDashboard, Lightbulb, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  result: AnalysisResult;
  productContext: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ result, productContext, onReset }) => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in pb-20">
      <button
        onClick={onReset}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Input
      </button>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Market Overview & Strategy */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <LayoutDashboard className="text-indigo-400" size={20} />
                    <h2 className="text-xl font-bold text-white">Market Overview</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">{result.marketOverview}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Lightbulb size={100} className="text-yellow-400"/>
                </div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Lightbulb className="text-yellow-400" size={20} />
                    <h2 className="text-xl font-bold text-white">Strategic Advice</h2>
                </div>
                 <p className="text-slate-300 leading-relaxed relative z-10">{result.suggestedStrategy}</p>
            </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-1">
            <InsightsChart personas={result.personas} />
        </div>
      </div>

      {/* Personas Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
           Identified ICPs <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-full ml-2">{result.personas.length} Profiles</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onChat={(p) => setSelectedPersona(p)}
            />
          ))}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedPersona && (
        <PersonaChat
          persona={selectedPersona}
          productContext={productContext}
          onClose={() => setSelectedPersona(null)}
        />
      )}
    </div>
  );
};