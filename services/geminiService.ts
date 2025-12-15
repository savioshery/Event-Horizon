import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestionResponse, EventType } from "../types";

// Initialize the API client
// Note: In a real app, ensure process.env.API_KEY is defined in your build environment.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEventSuggestions = async (
  title: string,
  eventType: EventType,
  date: string,
  location: string
): Promise<AISuggestionResponse> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const prompt = `
    I am planning an event.
    Title: "${title}"
    Type: "${eventType}"
    Date: "${date}"
    Location: "${location}"

    Please act as a professional event organizer. 
    1. Write a compelling, short description for this event.
    2. Create a catchy, short tagline.
    3. Suggest a 3-5 item high-level agenda/schedule suitable for this event type.
    4. Suggest a modern hex color code that fits the "vibe" of this event (e.g., professional blue for conference, warm orange for party).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and creative event planning assistant. Output strictly in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "A 2-3 sentence engaging description of the event." },
            tagline: { type: Type.STRING, description: "A short, punchy slogan for the event." },
            themeColor: { type: Type.STRING, description: "A hex color code string (e.g. #3B82F6)." },
            agenda: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "Time of day (e.g. 10:00 AM)" },
                  activity: { type: Type.STRING, description: "Name of the activity or session" }
                },
                required: ["time", "activity"]
              }
            }
          },
          required: ["description", "tagline", "themeColor", "agenda"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    
    // The response is guaranteed to be JSON due to responseMimeType
    const data = JSON.parse(text) as AISuggestionResponse;
    return data;

  } catch (error) {
    console.error("Error generating event suggestions:", error);
    // Return a fallback so the app doesn't crash
    return {
      description: "Could not generate description at this time.",
      tagline: "Event Planning In Progress",
      agenda: [],
      themeColor: "#6366f1" // Default Indigo
    };
  }
};
