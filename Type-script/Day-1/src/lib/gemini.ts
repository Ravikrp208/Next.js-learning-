import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Helper to generate text using the Gemini Model (gemini-1.5-flash)
 * @param prompt Prompt string for the AI model
 * @returns Generated text or null
 */
export async function generateText(prompt: string): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    return null;
  }
}
