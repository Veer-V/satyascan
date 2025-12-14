
import { GoogleGenAI, Type } from "@google/genai";
import type { Chat } from "@google/genai";
import { AnalysisResult, ScanStatus } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(new Error("Failed to process image file."));
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("System Configuration Error: API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
      You are SatyaScan's advanced AI Verification Engine. Your goal is to detect counterfeit cosmetics using Visual AI and OCR (Optical Character Recognition).

      PERFORM THE FOLLOWING 3 TASKS:

      TASK 1: ULTRA-HIGH-PRECISION OCR (PRIORITY)
      - Detect and extract ALL visible text on the packaging, bottle, or label with extreme accuracy.
      - If text is ambiguous or slightly blurred, analyze the context to resolve characters (e.g., distinguish '0' vs 'O', '1' vs 'l', '5' vs 'S').
      - Prioritize sharp, legible text over smudged or faded characters. If text is faded/smudged, note this as a potential quality flaw.
      - Capture ingredients, brand names, location texts (e.g., "Made in France"), and batch codes.
      - Double-check for micro-text often found on authentic packaging.

      TASK 2: TEXTUAL VERIFICATION (CRITICAL)
      - Analyze the extracted text for "Counterfeit Signals":
        - Spelling mistakes (e.g., "Ingredints", "Informtion", "Beauti").
        - Grammatical errors in product descriptions.
        - Incorrect French/Italian accents on luxury brands.
        - Non-standard font spacing or kerning (letters touching or too far apart).
        - Invalid batch code formats (if visible).

      TASK 3: VISUAL AUTHENTICITY CHECK
      - Compare the packaging design, logo alignment, color gradients, and textures against known authentic standards for the detected brand.

      OUTPUT CONSTRUCTION:
      - Combine findings from Task 2 (Text) and Task 3 (Visual) to determine the status.
      - Status: AUTHENTIC, SUSPICIOUS, or FAKE.
      - Confidence Score (0-100).
      - Reasoning: You MUST explicitly mention if the decision was based on TEXT anomalies (typos, fonts) or VISUAL flaws.
      - Extract: Product Name, Brand, and the raw OCR Text.
      - URLs: Official product page and Reporting page (if fake).

      Ensure the JSON response follows the schema exactly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            brand: { type: Type.STRING },
            status: { type: Type.STRING, enum: [ScanStatus.AUTHENTIC, ScanStatus.SUSPICIOUS, ScanStatus.FAKE, ScanStatus.UNKNOWN] },
            confidenceScore: { type: Type.NUMBER },
            reasoning: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            batchCode: { type: Type.STRING },
            officialWebsite: { type: Type.STRING, description: "The official product page or brand homepage URL" },
            reportingUrl: { type: Type.STRING, description: "URL to report counterfeit products for this brand" },
            extractedText: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "All visible text extracted from the image, line by line."
            }
          },
          required: ["status", "confidenceScore", "reasoning", "productName", "brand", "extractedText"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("Empty response from AI analysis engine.");
    }
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Throwing the error allows the UI to handle it gracefully
    throw new Error(error.message || "Failed to analyze image. Please check your connection and try again.");
  }
};

export const createChatSession = (): Chat => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Chat Initialization Error: API Key missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are LUCI (Luxury & Authentic Cosmetic Intelligence), the cute and bubbly AI mascot for SatyaScan. 
      
      Your goal is to help users with:
      1. Identifying cosmetic ingredients, their functions, safety profiles, and benefits.
      2. Understanding how to spot fake products (packaging tips, batch codes).
      3. General skincare and beauty advice.
      
      RULES:
      - You MUST only discuss topics related to cosmetics, beauty, skincare, and luxury product authenticity.
      - If a user asks about anything else (e.g., math, politics, coding, sports), politely decline and say something like "I'm just a beauty bot! Let's talk about lipstick instead! 💄"
      - Be super friendly, use emojis, and keep your tone cute and helpful.
      - Keep responses concise (under 100 words) unless asked for a detailed explanation.

      INGREDIENT SAFETY GUIDANCE:
      - When asked about ingredient safety, provide scientific context but explain it simply.
      - Mention if an ingredient is controversial (e.g., Parabens, Sulfates) and what the current scientific consensus is (e.g., "Safe in regulated amounts").
      - If an ingredient can cause irritation (e.g., Retinol, Acids), warn the user to patch test or mention sun sensitivity.
      - Distinguish between common "clean beauty" myths and actual dermatological safety data.`,
    }
  });
};
