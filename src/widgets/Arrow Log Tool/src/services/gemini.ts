import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Verse {
  reference: string;
  text: string;
  translation: string;
  bibleUrl: string;
}

export interface BiblicalTruth {
  truth: string;
  verses: Verse[];
}

export async function generateBiblicalTruth(lie: string): Promise<BiblicalTruth> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user believes this lie about themselves: "${lie}". Counter this with a biblical truth.`,
    config: {
      systemInstruction: `You are a biblical counselor. When a user shares a 'lie' they believe about themselves, respond with a 'Truth' based strictly on the Bible. 
      
      Requirements:
      1. Respond in a gentle, affirming, and pastoral tone.
      2. Provide 1-2 specific scripture references.
      3. Use the English Standard Version (ESV) for all verse text.
      4. Do not fabricate verses; quote them accurately and word-for-word from the ESV.
      5. For each verse, provide a direct link to the chapter on Bible.com (e.g., https://www.bible.com/bible/59/PSA.119.ESV).
      6. Return the response in JSON format.
      
      JSON Schema:
      {
        "truth": "The summary biblical truth countering the lie",
        "verses": [
          {
            "reference": "Book Chapter:Verse",
            "text": "The full ESV verse text",
            "translation": "ESV",
            "bibleUrl": "https://www.bible.com/..."
          }
        ]
      }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          truth: {
            type: Type.STRING,
            description: "The biblical truth countering the lie.",
          },
          verses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                reference: { type: Type.STRING },
                text: { type: Type.STRING },
                translation: { type: Type.STRING },
                bibleUrl: { type: Type.STRING },
              },
              required: ["reference", "text", "translation", "bibleUrl"],
            },
            description: "Detailed scripture verses supporting the truth.",
          },
        },
        required: ["truth", "verses"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      truth: "God loves you and has a purpose for your life.",
      verses: [{
        reference: "John 3:16",
        text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        translation: "ESV",
        bibleUrl: "https://www.bible.com/bible/59/JHN.3.ESV"
      }],
    };
  }
}
