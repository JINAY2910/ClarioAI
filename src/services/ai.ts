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

    /* ------------------------------------------------------------------
       OPEN FOOD FACTS INTEGRATION
       ------------------------------------------------------------------ */
    private async searchOpenFoodFacts(productName: string): Promise<string | null> {
        try {
            const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1`;
            const response = await fetch(searchUrl);
            const data = await response.json();

            if (data.products && data.products.length > 0) {
                const product = data.products[0]; // Take top result
                // Construct a helpful context string
                let context = `Starting OpenFoodFacts Data for '${product.product_name}':\n`;
                if (product.ingredients_text) context += `Ingredients: ${product.ingredients_text}\n`;
                if (product.nutriments) {
                    const n = product.nutriments;
                    context += `Nutrition (per 100g): Sugar ${n.sugars_100g}g, Fat ${n.fat_100g}g, Protein ${n.proteins_100g}g, Salt ${n.salt_100g}g.\n`;
                }
                if (product.nova_group) context += `NOVA Group: ${product.nova_group} (Processing Level).\n`;
                if (product.labels) context += `Labels: ${product.labels}\n`;

                return context;
            }
            return null;
        } catch (e) {
            console.warn("OpenFoodFacts lookup failed:", e);
            return null;
        }
    }

    /* ------------------------------------------------------------------
       MAIN ANALYSIS FLOW
       ------------------------------------------------------------------ */
    async analyzeImage(file: File): Promise<AnalysisData> {
        if (!this.model) {
            throw new Error("Gemini API Key is not configured.");
        }

        const imagePart = await this.fileToGenerativePart(file);
        let externalContext = "";
        let dataSource: 'ocr' | 'external' | 'hybrid' = 'ocr';

        // Step 1: Recognition & Legibility Check
        // We do a quick check to see if we need external data.
        const checkPrompt = `
            Identify the product name from this image.
            Can you clearly read the full ingredient list and nutrition facts?
            Output JSON: { "productName": "string", "isLagible": boolean }
        `;

        try {
            const checkResult = await this.model.generateContent([checkPrompt, imagePart]);
            const checkText = checkResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const checkData = JSON.parse(checkText);

            if (!checkData.isLagible && checkData.productName) {
                console.log(`Ingredients unclear for ${checkData.productName}. Fetching from OpenFoodFacts...`);
                // Step 2: Fallback
                const offData = await this.searchOpenFoodFacts(checkData.productName);
                if (offData) {
                    externalContext = offData;
                    dataSource = 'external';
                }
            }
        } catch (e) {
            console.log("Legibility check skipped or failed, proceeding with direct analysis.", e);
        }

        // Step 3: AI-Native Analysis Prompt
        const basePrompt = `
            You are an AI-native consumer health co-pilot.
            Your role is NOT to list ingredients or retrieve data, but to help users make sense of food ingredient information at the moment decisions matter.

            Operate with the following principles:
            - **Intent-First**: Infer what the user likely cares about (e.g. "Is this healthy?", "Too much sugar?") without asking.
            - **Reason Under Uncertainty**: Explain why something matters, what trade-offs exist (pros/cons).
            - **Reduce Cognitive Load**: Translate technical/chemical terms into clear, human-level insight.
            - **Co-Pilot Persona**: Warm, neutral, supportive. Not a database.

            CONTEXT:
            ${externalContext ? `Additional Data from OpenFoodFacts (Use this if image is blurry): ${externalContext}` : "Rely on the image text."}

            OUTPUT FORMAT (JSON):
            {
                "intent": "moderation" | "general-health" | "processed-concern",
                "intentLabel": "string (Short 2-3 word badge, e.g. 'Treat Wisely', 'High Protein')",
                "productName": "string (Identified Name)",
                "primaryInsight": "string (2-3 sentences. The 'Summary Card'. Use **bold** for impact. Focus on user impact, not chemistry.)",
                "whyItMatters": "string (The core reasoning. Why did you give this verdict?)",
                "tradeOffs": "string (What are the pros and cons? e.g. 'Good protein but high sugar'.)",
                "uncertaintyNote": "string (Optional. If data is missing or derived from OpenFoodFacts, mention it here cleanly.)",
                "suggestedQuestions": ["string", "string", "string"] (3 short follow-up questions for the user to tap)
            }
        `;

        try {
            const finalResult = await this.model.generateContent([basePrompt, imagePart]);
            const responseText = finalResult.response.text();
            const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanText) as AnalysisData;

            // Inject datasource info
            data.dataSource = dataSource;
            if (externalContext && !data.uncertaintyNote) {
                data.uncertaintyNote = "Ingredients inferred from OpenFoodFacts database as label was unclear.";
            }

            return data;
        } catch (error) {
            console.error("Gemini Analysis Failed:", error);
            throw new Error("Failed to analyze image. Please try again.");
        }
    }

    async analyzeStreamFrame(file: File, userPrompt?: string): Promise<string> {
        // ... (Keep existing implementation for brevity, or minimal update if needed)
        // For this task, we can keep the existing simple frame analysis or update it broadly.
        // I will keep it simple to avoid breaking existing stream features, but update the tone.
        if (!this.model) return "";
        const imagePart = await this.fileToGenerativePart(file);

        const prompt = userPrompt
            ? `Answer conversationaly in the user's language: ${userPrompt}`
            : "Quickly: Should I eat this? Why? (Max 15 words)";

        try {
            const result = await this.model.generateContent([prompt, imagePart]);
            return result.response.text();
        } catch (e) { return ""; }
    }

    async chat(history: { role: 'user' | 'assistant'; content: string }[], productContext: AnalysisData, currentMessage: string): Promise<string> {
        if (!this.model) throw new Error("Gemini Not Initialized");

        const contextPrompt = `
            SYSTEM: You are an AI-Native Consumer Health Co-pilot.
            CONTEXT:
            Product: ${productContext.productName}
            Insight: ${productContext.primaryInsight}
            Reasoning: ${productContext.whyItMatters}
            Trade-offs: ${productContext.tradeOffs}
            
            HISTORY:
            ${history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}

            USER: "${currentMessage}"

            Respond conversationally, helpfully, and briefly.
        `;

        try {
            const result = await this.model.generateContent(contextPrompt);
            return result.response.text();
        } catch (error) {
            console.error("Chat Error:", error);
            return "I'm having trouble connecting right now.";
        }
    }
}

export const aiService = new GeminiService();
