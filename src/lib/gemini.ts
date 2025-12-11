import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

/**
 * Initialize Gemini AI client
 */
const genAI = new GoogleGenerativeAI(config.geminiApiKey || "");

/**
 * Get Gemini model for text generation
 * Using gemini-1.5-flash for fast, cost-effective responses
 */
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
