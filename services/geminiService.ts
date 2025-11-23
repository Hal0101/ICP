import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ChatMessage } from "../types";

// Initialize Gemini Client
// API Key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PERSONA_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    role: { type: Type.STRING, description: "Job title or role of the ICP" },
    industry: { type: Type.STRING, description: "Industry sector" },
    companySize: { type: Type.STRING, description: "Typical company size (e.g., SMB, Enterprise)" },
    incomeLevel: { type: Type.STRING, description: "Estimated budget or income level" },
    painPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of top 3-5 specific burning problems this person faces that keep them up at night."
    },
    motivations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key drivers for purchasing solutions"
    },
    preferredChannels: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific digital communities, physical events, newsletters, or subreddits where this persona actively hangs out. Be specific (e.g., 'r/SaaS', 'Hacker News', 'Dreamforce', 'Marketing Brew')."
    },
    marketingHook: { type: Type.STRING, description: "A one-sentence powerful marketing message targeting this persona" },
    compatibilityScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating how well this persona fits the product" },
    bio: { type: Type.STRING, description: "A short, first-person paragraph describing who they are." }
  },
  required: ["role", "industry", "painPoints", "motivations", "marketingHook", "compatibilityScore", "bio", "preferredChannels"],
};

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    personas: {
      type: Type.ARRAY,
      items: PERSONA_SCHEMA,
      description: "Identify exactly 3 distinct Ideal Customer Profiles."
    },
    marketOverview: { type: Type.STRING, description: "Brief summary of the market landscape for this product." },
    suggestedStrategy: { type: Type.STRING, description: "High-level go-to-market strategy suggestion." }
  },
  required: ["personas", "marketOverview", "suggestedStrategy"]
};

export const analyzeProduct = async (productDescription: string): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a world-class Chief Marketing Officer and Market Researcher.
      Analyze the following product description to identify the Ideal Customer Profiles (ICPs).
      
      Product Description:
      "${productDescription}"
      
      Identify 3 distinct, realistic personas that would benefit most from this product.
      Be specific, avoiding generic "Everyone" answers. Focus on high-intent buyers.
      Crucial: For 'preferredChannels', do not just list 'LinkedIn' or 'Email'. Identify specific communities, subreddits, hashtags, or conferences where these people actually hang out.
      Return the result in strict JSON format based on the schema.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text);
    
    // Add IDs to personas for React keys
    data.personas = data.personas.map((p: any, index: number) => ({
      ...p,
      id: `persona-${index}-${Date.now()}`
    }));

    return data as AnalysisResult;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const createPersonaChat = (persona: any, systemContext: string) => {
  const model = "gemini-2.5-flash";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `
        You are a roleplay character. 
        Character Profile:
        Role: ${persona.role}
        Industry: ${persona.industry}
        Bio: ${persona.bio}
        Pain Points: ${persona.painPoints.join(", ")}
        Hangout Spots: ${persona.preferredChannels.join(", ")}
        
        Context: ${systemContext}

        Your goal is to simulate a real conversation with a founder trying to sell to you. 
        Be realistic. If the pitch is bad, be skeptical. If the pitch addresses your pain points, be interested.
        Keep responses concise (under 3 sentences usually) and conversational.
        Do NOT break character.
      `,
    }
  });

  return chat;
};