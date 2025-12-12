import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

/**
 * Initialize Gemini AI client
 */
const genAI = new GoogleGenerativeAI(config.geminiApiKey || "");

// tjese are the configuirations to maange the apis
const codingConfig = {
  temperature: 0.2,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

/**
 * Get Gemini model for text generation
 * Using gemini-1.5-flash for fast, cost-effective responses
 */
export const getGeminiModel = () => {
  // Use the specific model ID, not the human-readable name
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: codingConfig,
  });
};
/**
 * Generate content from Gemini
 */
export const generateContent = async (prompt: string): Promise<string> => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export { genAI };
