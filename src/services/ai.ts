import { GoogleGenerativeAI } from "@google/generative-ai";
import { type AnalysisData } from "../components/AnalysisResult";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        if (!API_KEY) {
            console.warn("Gemini API Key is missing!");
        }
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    private async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result as string;
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64Content = base64Data.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64Content,
                        mimeType: file.type,
                    },
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async analyzeImage(file: File): Promise<AnalysisData> {
        if (!API_KEY) {
            throw new Error("Gemini API Key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const imagePart = await this.fileToGenerativePart(file);

        const prompt = `
      Analyze this food product image and provide a nutritional assessment in STRICT JSON format. 
      Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON object.
      
      The JSON must match this structure:
      {
        "intent": "moderation" | "general-health" | "processed-concern",
        "intentLabel": "string (e.g., 'Moderation Needed', 'Healthy Choice', 'Highly Processed')",
        "productName": "string (identified product name)",
        "primaryInsight": "string (A detailed insight text with key phrases wrapped in double asterisks **like this** for highlighting. e.g., 'This product is **high in sugar**...')",
        "summaryChips": [
          {
            "label": "string",
            "color": "green" | "amber" | "red",
            "emoji": "string (single emoji)"
          }
        ],
        "whyItMatters": "string (educational context)",
        "uncertaintyNote": "string (optional warning if unclear)",
        "summary": "string (brief summary)"
      }

      analysis rules:
      - intent: 'green' for healthy/natural, 'moderation' for okay but watch out, 'processed-concern' for unhealthy/ultra-processed.
      - Highlight key nutritional facts in primaryInsight using **bold**.
      - Provide 3 summary chips total.
    `;

        try {
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Clean up the response in case it still has markdown
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(cleanText) as AnalysisData;
        } catch (error) {
            console.error("Gemini Analysis Failed:", error);
            throw new Error("Failed to analyze image. Please try again.");
        }
    }
}

export const aiService = new GeminiService();
