import { GoogleGenAI, Type } from "@google/genai";
import { MarketInsights } from "@/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const marketInsightsSchema = {
  type: Type.OBJECT,
  properties: {
    market_analysis: {
      type: Type.OBJECT,
      properties: {
        tam: { type: Type.STRING, description: "Total Addressable Market value" },
        cagr: { type: Type.STRING, description: "CAGR percentage" },
        market_growth: { type: Type.STRING, description: "Market growth trends" },
        market_size: { type: Type.STRING, description: "Current market size" },
      },
      required: ["tam", "cagr", "market_growth", "market_size"],
    },
    competitors: {
      type: Type.OBJECT,
      properties: {
        competitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              market_share: { type: Type.STRING },
              revenue: { type: Type.STRING },
            },
            required: ["name", "market_share", "revenue"],
          },
        },
        your_estimated_share: { type: Type.STRING },
        market_opportunity: { type: Type.STRING },
      },
      required: ["competitors", "your_estimated_share", "market_opportunity"],
    },
    difficulty: { type: Type.STRING, description: "1-10 scale with explanation" },
  },
  required: ["market_analysis", "competitors", "difficulty"],
};

export async function generateMarketInsights(
  title: string,
  problem: string,
  solution: string,
  audience: string
): Promise<MarketInsights> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a market research analyst. Analyze this business idea and provide market insights:

- Title: ${title}
- Problem: ${problem}
- Solution: ${solution}
- Target Audience: ${audience}

Provide realistic TAM, CAGR, competitor data (include at least 3 real competitors with their estimated market share and revenue), and implementation difficulty assessment (1-10 scale with explanation).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: marketInsightsSchema,
    },
  });

  return JSON.parse(response.text ?? "{}") as MarketInsights;
}
