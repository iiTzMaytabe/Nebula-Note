import { GoogleGenAI } from "@google/genai";
import { AIActionType } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const enhanceNoteContent = async (
  content: string, 
  action: AIActionType,
  currentTitle?: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    throw new Error("Neural Link Offline: API Key Missing");
  }

  const model = "gemini-2.5-flash"; // Fast and efficient for text tasks
  
  let prompt = "";
  
  switch (action) {
    case AIActionType.SUMMARIZE:
      prompt = `Analyze the following data log and provide a concise, high-level tactical summary (max 3 sentences). Style: Military/Sci-fi Log.\n\nData:\n${content}`;
      break;
    case AIActionType.EXPAND:
      prompt = `Expand upon the following data log entry. Add relevant details, hypotheticals, or logical extrapolations. Keep the tone consistent with a futuristic database. \n\nEntry:\n${content}`;
      break;
    case AIActionType.REWRITE_SCIFI:
      prompt = `Rewrite the following text to sound like a transmission from a cyberpunk dystopia or high-tech spacecraft. Use technical jargon (e.g., 'neural link', 'quantum flux', 'sub-routine').\n\nText:\n${content}`;
      break;
    case AIActionType.FIX_GRAMMAR:
      prompt = `Correct any syntax errors or data corruptions (grammar/spelling) in the following text. Maintain original meaning strictly.\n\nText:\n${content}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "Data corrupted. No response generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Neural Uplink Failed: " + (error instanceof Error ? error.message : "Unknown Error"));
  }
};

export const generateTitle = async (content: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Untitled Log";

  const model = "gemini-2.5-flash";
  const prompt = `Generate a short, cool, sci-fi file name (max 5 words) for the following content. Do not include file extensions like .txt. Examples: "Project Alpha", "Sector 7 Report", "Neural Dump 01".\n\nContent:\n${content}`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    return response.text?.trim().replace(/['"]/g, '') || "Untitled Log";
  } catch (e) {
    return "Untitled Log";
  }
};
