
import { GoogleGenAI } from "@google/genai";

// Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
export const brewInspiration = async (mood: string, recipient: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a gentle, wise barista at a quiet cafe called "Letters to Kopi". 
  The user wants to write a letter to "${recipient}" and is feeling in a "${mood}" mood.
  Suggest 3 short, poetic opening lines or themes they could use to start their letter. 
  Keep the tone cozy, warm, and slightly nostalgic. Use coffee metaphors occasionally.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error brewing inspiration:", error);
    return "The coffee is still brewing... (Failed to get AI response)";
  }
};

export const refineLetter = async (content: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a literary barista. Here is a draft of a letter:
  "${content}"
  
  Suggest a few ways to make this more heartfelt or descriptive. Don't rewrite the whole thing, just provide 2-3 specific "tweak" suggestions or "flavor notes" to enhance the emotional resonance. Keep it brief.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error refining letter:", error);
    return "I'm having trouble tasting the notes in this draft. Try again?";
  }
};
