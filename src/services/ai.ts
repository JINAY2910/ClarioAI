import { GoogleGenerativeAI } from "@google/generative-ai";
import { type AnalysisData } from "../components/AnalysisResult";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiService {
    private genAI?: GoogleGenerativeAI;
    private model?: any;

    constructor() {
        if (!API_KEY) {
            console.warn("Gemini API Key is missing! AI features will be disabled.");
            return;
        }
        try {
            this.genAI = new GoogleGenerativeAI(API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
        }
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
        if (!this.model) {
            throw new Error("Gemini API Key is not configured or initialization failed. Please check your .env file.");
        }

        const imagePart = await this.fileToGenerativePart(file);

        // AI-Native Prompt: Intent-First & Reasoning-Driven
        const prompt = `
            ROLE: AI-Native Nutrition Co-pilot.
            GOAL: Reduce cognitive load for the user at the moment of decision.
            INPUT: Food product image.
            
            CORE PRINCIPLES:
            1. **Intent-First**: Infer *why* the user is scanning. (e.g., "Is this a healthy snack?", "Is this safe?", "Is it better than X?").
            2. **Reasoning-Driven**: Don't just list facts. Explain *why* it matters. (e.g., instead of "12g Sugar", say "The 12g of sugar makes this more of a dessert than a daily snack").
            3. **Honest Uncertainty**: If you cannot see the label or are unsure, explicitly state it in 'uncertaintyNote'.
            4. **Co-Pilot Persona**: Speak as a helpful, intelligent partner, not a database.

            OUTPUT FORMAT: STRICT JSON (No Markdown).
            Structure:
            {
                "intent": "moderation" | "general-health" | "processed-concern",
                "intentLabel": "string (e.g., 'Treat Wisely', 'Nutrient Dense', 'Ultra-Processed')",
                "productName": "string (Identified Name)",
                "primaryInsight": "string (The ONE most important thing the user needs to know. Use **bold** for impact. e.g. '**High Sugar** but excellent **Protein source**.')",
                "summaryChips": [
                    { "label": "string (e.g. 'High Protein')", "color": "green"| "amber"| "red", "emoji": "string" }
                ],
                "whyItMatters": "string (Educational reasoning: 'Unlike regular chips, these use lentil flour which lowers the glycemic index...')",
                "uncertaintyNote": "string (ONLY if image is blurry or data is missing: 'I couldn't read the sodium count clearly...')",
                "summary": "string (Brief, conversational verdict)"
            }
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

    async analyzeStreamFrame(file: File, userPrompt?: string): Promise<string> {
        if (!this.model) {
            throw new Error("Gemini Not Initialized");
        }

        const imagePart = await this.fileToGenerativePart(file);

        let prompt = `
            You are a quick nutrition assistant. Look at this product/food.
            In ONE short conversational sentence (max 15 words), tell me if I should eat it or avoid it and why.
        `;

        if (userPrompt) {
            prompt = `
                User said: "${userPrompt}"
                Look at the image and answer the user's question.
                IMPORTANT: Detect the language of the user's question (e.g., Hindi, Gujarati, English).
                Reply IN THE SAME LANGUAGE as the user's question.
                Keep it short and conversational (max 1 sentence).
            `;
        }

        try {
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Stream Analysis Failed:", error);
            return "";
        }
    }

    async chat(history: { role: 'user' | 'assistant'; content: string }[], productContext: AnalysisData, currentMessage: string): Promise<string> {
        if (!this.model) {
            throw new Error("Gemini Not Initialized");
        }

        const contextPrompt = `
            SYSTEM INSTRUCTION:
            You are an "AI-Native Consumer Health Co-pilot".
            You are NOT a database lookup tool. You are an intelligent reasoning engine.
            
            YOUR MISSION:
            1. **Infer Intent**: Understand what the user is *really* asking (e.g., "Is this safe?" usually means "Will this hurt my goals?").
            2. **Reduce Cognitive Load**: Don't dump data. Synthesize it into a clear decision or trade-off.
            3. **Be Human**: Use a "Skilled Product Designer" persona—warm, empathetic, and clear.
            4. **Honest Uncertainty**: If you don't know, say so. Don't hallucinate.

            CONTEXT:
            Product: ${productContext.productName}
            Verdict: ${productContext.intentLabel}
            Key Insight: ${productContext.primaryInsight}
            Reasoning: ${productContext.whyItMatters}
            
            CONVERSATION HISTORY:
            ${history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}

            USER'S QUESTION:
            "${currentMessage}"

            RESPONSE GUIDELINES:
            - Language: Reply in the SAME language as the user's question.
            - Length: Concise (2-3 sentences max) unless detailed explanation is requested.
            - Style: Conversational, helpful, and reasoning-driven.
        `;

        try {
            // Note: For a proper chat session we should use startChat(), but for this stateless implementation 
            // passing the full history in the prompt is a robust simple solution for now.
            const result = await this.model.generateContent(contextPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Chat Error:", error);
            return "I'm having a bit of trouble connecting right now. Could you ask that again?";
        }
    }
}

export const aiService = new GeminiService();
