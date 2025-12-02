import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Transaction } from '../types';

// Initialize Gemini lazily
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in your .env file.");
  }
  return new GoogleGenAI({ apiKey });
};

const transactionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING, description: "Date of transaction in YYYY-MM-DD format" },
    description: { type: Type.STRING, description: "Description or narration of the transaction" },
    amount: { type: Type.NUMBER, description: "Absolute amount of the transaction" },
    type: { type: Type.STRING, enum: ["credit", "debit"], description: "Whether the money is coming in (credit) or going out (debit)" },
  },
  required: ["date", "description", "amount", "type"],
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: transactionSchema,
};

export const parseBankStatement = async (base64Data: string, mimeType: string): Promise<Transaction[]> => {
  try {
    const model = "gemini-2.0-flash";
    
    const response = await getAiClient().models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `
              Analyze this bank statement document. Extract all transactions. 
              For each transaction, identify the date, the description, the amount, and whether it is a credit (inflow) or debit (outflow).
              Return the data as a JSON array.
              Ensure dates are strictly YYYY-MM-DD.
              If a year is missing, assume the current year or the year visible in the header.
              Amounts should be numbers (no currency symbols).
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        // thinkingConfig: { thinkingBudget: 2048 } // Disabled for stability with flash model
      }
    });

    const text = response.text;
    if (!text) return [];

    const rawData = JSON.parse(text);

    // Map to our internal Transaction type with Signed Amounts
    return rawData.map((item: any) => ({
      id: Math.random().toString(36).substring(7),
      date: item.date,
      description: item.description,
      amount: item.type === 'debit' ? -Math.abs(item.amount) : Math.abs(item.amount), // Normalize negatives
      type: item.type,
      note: '',
    }));

  } catch (error) {
    console.error("Gemini OCR Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to process image with Gemini: ${errorMessage}`);
  }
};