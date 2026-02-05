import Anthropic from "@anthropic-ai/sdk";
import { MarketInsights } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateMarketInsights(
  title: string,
  problem: string,
  solution: string,
  audience: string
): Promise<MarketInsights> {
  const prompt = `You are a market research analyst. Analyze the following business idea and provide market insights in JSON format.

Business Idea:
- Title: ${title}
- Problem: ${problem}
- Solution: ${solution}
- Target Audience: ${audience}

Provide your analysis in the following JSON format only, with no additional text:
{
  "market_size": "Estimated Total Addressable Market (TAM) with explanation",
  "market_growth": "Potential market growth rate and trends",
  "competitors": "Key competitors and competitive landscape",
  "difficulty": "Implementation difficulty (1-10 scale) with explanation of challenges"
}

Be realistic and provide specific insights based on current market conditions.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse market insights");
  }

  return JSON.parse(jsonMatch[0]) as MarketInsights;
}
