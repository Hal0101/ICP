import React from 'react';
import { Persona } from '../types';
import { MessageSquare, MapPin, Briefcase, Users, AlertCircle, Heart } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  onChat: (persona: Persona) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onChat }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full shadow-lg group">
      <div className="p-6 flex-grow flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{persona.role}</h3>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2 mt-1">
              <Briefcase size={14} className="text-indigo-500" />
              {persona.industry}
            </p>
          </div>
          <div className="flex flex-col items-end">
             <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                persona.compatibilityScore > 85 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                persona.compatibilityScore > 70 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-slate-600/10 text-slate-300 border-slate-600'
             }`}>
               {persona.compatibilityScore}% Fit
             </span>
             <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
               <Users size={12}/> {persona.companySize}
             </span>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-700/50 italic text-slate-400 text-sm relative">
           <span className="text-2xl text-slate-700 absolute top-0 left-2 -translate-y-2">"</span>
           {persona.bio}
        </div>

        {/* Pain Points - Highlighting this based on user request */}
        <div>
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle size={14} /> 
              Key Pain Points
            </h4>
            <ul className="space-y-2">
              {persona.painPoints.slice(0, 3).map((point, i) => (
                <li key={i} className="text-sm text-slate-200 flex items-start gap-2 bg-red-500/5 p-2 rounded border border-red-500/10">
                  <span className="text-red-500 mt-0.5 min-w-[6px]">•</span>
                  {point}
                </li>
              ))}
            </ul>
        </div>

        {/* Hangout Spots - Highlighting this based on user request */}
        <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
               <MapPin size={14} /> 
               Where They Hang Out
            </h4>
            <div className="flex flex-wrap gap-2">
              {persona.preferredChannels.map((channel, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-cyan-900/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors cursor-default">
                  {channel}
                </span>
              ))}
            </div>
        </div>

        {/* Motivations (Secondary) */}
        <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
               <Heart size={14} /> Motivations
            </h4>
            <div className="flex flex-wrap gap-2 text-sm text-slate-400">
               {persona.motivations.join(" • ")}
            </div>
        </div>
        
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800 mt-auto">
        <button
          onClick={() => onChat(persona)}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/25"
        >
          <MessageSquare size={18} />
          Talk to {persona.role.split(' ')[0]}
        </button>
      </div>
    </div>
  );
};