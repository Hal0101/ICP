import React, { useState, useEffect, useRef } from 'react';
import { Persona, ChatMessage } from '../types';
import { createPersonaChat } from '../services/geminiService';
import { X, Send, User, Bot, RotateCcw } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

interface PersonaChatProps {
  persona: Persona;
  onClose: () => void;
  productContext: string;
}

export const PersonaChat: React.FC<PersonaChatProps> = ({ persona, onClose, productContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    chatSessionRef.current = createPersonaChat(persona, `The user is pitching this product: "${productContext}"`);
    
    // Add initial greeting from persona
    const initialGreeting: ChatMessage = {
      id: 'init',
      role: 'model',
      text: `Hi, I'm a ${persona.role}. I've got a minute. What's this solution you're talking about?`,
      timestamp: Date.now()
    };
    setMessages([initialGreeting]);
  }, [persona, productContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Thinking...",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "(System) Sorry, I lost my train of thought. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {persona.role.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white">{persona.role}</h3>
              <p className="text-xs text-slate-400">{persona.companySize} • {persona.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => {
                   setMessages([]); 
                   chatSessionRef.current = createPersonaChat(persona, `The user is pitching this product: "${productContext}"`);
                   const initialGreeting: ChatMessage = {
                    id: 'init-reset',
                    role: 'model',
                    text: `Hi, I'm a ${persona.role}. I've got a minute. What's this solution you're talking about?`,
                    timestamp: Date.now()
                  };
                  setMessages([initialGreeting]);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                title="Reset Chat"
            >
                <RotateCcw size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <X size={24} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-900">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl rounded-bl-none border border-slate-700 text-sm flex items-center gap-2">
                <Bot size={16} className="animate-bounce" /> Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/30">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pitch your product or ask questions..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            AI Persona Simulation. Responses may vary.
          </p>
        </div>

      </div>
    </div>
  );
};