import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StudyMaterial {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export async function processStudyMaterial(images: string[]): Promise<StudyMaterial> {
  const model = "gemini-3-flash-preview";
  
  const imageParts = images.map(base64 => ({
    inlineData: {
      data: base64.split(',')[1],
      mimeType: "image/jpeg"
    }
  }));

  const prompt = `
    Analyze these study materials (notes, workbook pages, or textbook snippets).
    Extract the key concepts and create:
    1. A set of 5-10 flashcards (question and answer).
    2. A quiz with 5-10 multiple-choice questions.
    
    Ensure the questions are challenging but fair, based strictly on the provided content.
    For the quiz, provide 4 options for each question and identify the correct answer with an explanation.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["flashcards", "quiz"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as StudyMaterial;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to process study materials. Please try again.");
  }
}
