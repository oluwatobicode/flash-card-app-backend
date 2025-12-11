// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse");
import { generateContent } from "../lib";

interface GeneratedCard {
  question: string;
  answer: string;
}

/**
 * Extract text content from a PDF buffer
 */
export const extractTextFromPdf = async (
  pdfBuffer: Buffer,
): Promise<string> => {
  const data = await pdf(pdfBuffer);
  return data.text;
};

/**
 * Generate flashcards from text using Gemini AI
 */
export const generateCardsFromText = async (
  text: string,
  maxCards: number = 15,
): Promise<GeneratedCard[]> => {
  const prompt = `You are a flashcard generator for educational content.
Given the following text, create flashcards that test understanding.

Rules:
- Generate between 5 and ${maxCards} cards based on content density
- Questions should require understanding, not just memorization
- Answers should be concise but complete (1-3 sentences)
- Focus on key concepts, definitions, and relationships
- Avoid trivial or overly specific questions

IMPORTANT: Return ONLY a valid JSON array with no markdown formatting, no code blocks, just the raw JSON:
[{"question": "...", "answer": "..."}, ...]

Text to process:
${text.slice(0, 15000)}`;

  const response = await generateContent(prompt);

  // Parse JSON response, handling potential markdown code blocks
  let jsonStr = response.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }

  jsonStr = jsonStr.trim();

  try {
    const cards = JSON.parse(jsonStr) as GeneratedCard[];

    // Validate structure
    if (!Array.isArray(cards)) {
      throw new Error("Response is not an array");
    }

    return cards.filter(
      (card) =>
        typeof card.question === "string" &&
        typeof card.answer === "string" &&
        card.question.length > 0 &&
        card.answer.length > 0,
    );
  } catch {
    throw new Error("Failed to parse AI response as valid JSON");
  }
};

/**
 * Generate flashcards directly from a PDF buffer
 */
export const generateCardsFromPdf = async (
  pdfBuffer: Buffer,
  maxCards: number = 15,
): Promise<GeneratedCard[]> => {
  const text = await extractTextFromPdf(pdfBuffer);

  if (!text || text.trim().length < 100) {
    throw new Error("PDF contains insufficient text content");
  }

  return generateCardsFromText(text, maxCards);
};

/**
 * Analyze a study session and generate feedback
 */
export const analyzeStudySession = async (sessionData: {
  totalCards: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  averageTimePerCard: number;
  struggledTopics: string[];
}): Promise<string> => {
  const prompt = `Analyze this study session and provide brief, actionable feedback:

Session Data:
- Total cards reviewed: ${sessionData.totalCards}
- Cards marked "again" (failed): ${sessionData.againCount}
- Cards marked "hard": ${sessionData.hardCount}
- Cards marked "good": ${sessionData.goodCount}
- Cards marked "easy": ${sessionData.easyCount}
- Average time per card: ${sessionData.averageTimePerCard.toFixed(1)} seconds

${sessionData.struggledTopics.length > 0 ? `Topics struggled with:\n${sessionData.struggledTopics.join("\n")}` : ""}

Provide a brief analysis (2-3 sentences) covering:
1. Overall performance assessment
2. One specific recommendation for improvement

Keep the response concise and encouraging.`;

  return generateContent(prompt);
};
