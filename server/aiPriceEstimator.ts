/**
 * AI-Powered Trading Card Price Estimator
 * Uses the Manus LLM to provide market value estimates for trading cards.
 * Returns structured price data with confidence levels and market context.
 *
 * This is a fallback/complement to live eBay API data — useful when:
 * - eBay production API keys are not yet configured
 * - Quick price guidance is needed without waiting for API calls
 * - Market context and pricing factors are desired alongside raw numbers
 */

import { invokeLLM } from "./_core/llm";

export interface AIPriceEstimate {
  cardName: string;
  grade: string;
  estimatedLow: number;
  estimatedHigh: number;
  estimatedAverage: number;
  estimatedMedian: number;
  confidence: "high" | "medium" | "low";
  marketTrend: "rising" | "stable" | "declining" | "volatile";
  factors: string[];
  comparables: Array<{
    description: string;
    estimatedPrice: number;
    condition: string;
  }>;
  notes: string;
  disclaimer: string;
}

export interface AIPriceEstimateResult {
  estimate: AIPriceEstimate;
  source: "ai_estimate";
  generatedAt: number;
}

/**
 * Get an AI-powered price estimate for a trading card.
 */
export async function getAIPriceEstimate(params: {
  query: string;
  grade?: string;
}): Promise<AIPriceEstimateResult> {
  const gradeContext = params.grade && params.grade !== "all"
    ? `The card is graded: ${params.grade}.`
    : "The card condition/grade is not specified (assume raw/ungraded unless the query mentions a grade).";

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert trading card market analyst specializing in Marvel, sports, and collectible trading cards. You have deep knowledge of eBay sold prices, market trends, and card valuations as of early 2026.

Your job is to provide realistic market price estimates for trading cards based on recent eBay sold data patterns you've been trained on. Be specific and honest about your confidence level.

Key pricing knowledge:
- Marvel Chrome/Topps Chrome cards from 2024-2025 are actively traded
- PSA 10 graded cards typically command 3-10x premium over raw
- BGS 9.5 is roughly equivalent to PSA 10 in value
- Refractors, numbered parallels, and 1st editions carry premiums
- Base cards from recent sets are typically $1-15 raw, $20-100 graded PSA 10
- Key characters (Spider-Man, Wolverine, Deadpool) command premiums
- Rookie/first appearance cards are more valuable
- Market has been active with Marvel Chrome and Topps products

Always provide realistic estimates. If you're unsure about a specific card, say so and provide a wider range. Never fabricate specific eBay listing URLs or seller names.`
      },
      {
        role: "user",
        content: `Provide a market price estimate for this trading card search: "${params.query}"
${gradeContext}

Return a JSON object with this exact structure (no markdown, just raw JSON):
{
  "cardName": "normalized card name",
  "grade": "grade if specified or 'Raw'",
  "estimatedLow": <lowest expected price in USD>,
  "estimatedHigh": <highest expected price in USD>,
  "estimatedAverage": <average expected price in USD>,
  "estimatedMedian": <median expected price in USD>,
  "confidence": "high" | "medium" | "low",
  "marketTrend": "rising" | "stable" | "declining" | "volatile",
  "factors": ["factor 1 affecting price", "factor 2", ...],
  "comparables": [
    {"description": "Similar card description", "estimatedPrice": <price>, "condition": "condition"},
    {"description": "Another comparable", "estimatedPrice": <price>, "condition": "condition"},
    {"description": "Third comparable", "estimatedPrice": <price>, "condition": "condition"},
    {"description": "Fourth comparable", "estimatedPrice": <price>, "condition": "condition"},
    {"description": "Fifth comparable", "estimatedPrice": <price>, "condition": "condition"}
  ],
  "notes": "Brief market context and analysis"
}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "price_estimate",
        strict: true,
        schema: {
          type: "object",
          properties: {
            cardName: { type: "string", description: "Normalized card name" },
            grade: { type: "string", description: "Grade or Raw" },
            estimatedLow: { type: "number", description: "Low price estimate in USD" },
            estimatedHigh: { type: "number", description: "High price estimate in USD" },
            estimatedAverage: { type: "number", description: "Average price estimate in USD" },
            estimatedMedian: { type: "number", description: "Median price estimate in USD" },
            confidence: { type: "string", enum: ["high", "medium", "low"], description: "Confidence level" },
            marketTrend: { type: "string", enum: ["rising", "stable", "declining", "volatile"], description: "Market trend" },
            factors: {
              type: "array",
              items: { type: "string" },
              description: "Factors affecting price"
            },
            comparables: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  estimatedPrice: { type: "number" },
                  condition: { type: "string" }
                },
                required: ["description", "estimatedPrice", "condition"],
                additionalProperties: false
              },
              description: "Comparable card estimates"
            },
            notes: { type: "string", description: "Market context and analysis" }
          },
          required: ["cardName", "grade", "estimatedLow", "estimatedHigh", "estimatedAverage", "estimatedMedian", "confidence", "marketTrend", "factors", "comparables", "notes"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("AI price estimation returned empty response");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("AI price estimation returned invalid JSON");
  }

  const estimate: AIPriceEstimate = {
    cardName: parsed.cardName || params.query,
    grade: parsed.grade || (params.grade || "Raw"),
    estimatedLow: Number(parsed.estimatedLow) || 0,
    estimatedHigh: Number(parsed.estimatedHigh) || 0,
    estimatedAverage: Number(parsed.estimatedAverage) || 0,
    estimatedMedian: Number(parsed.estimatedMedian) || 0,
    confidence: parsed.confidence || "low",
    marketTrend: parsed.marketTrend || "stable",
    factors: Array.isArray(parsed.factors) ? parsed.factors : [],
    comparables: Array.isArray(parsed.comparables)
      ? parsed.comparables.map((c: any) => ({
          description: c.description || "",
          estimatedPrice: Number(c.estimatedPrice) || 0,
          condition: c.condition || "Unknown",
        }))
      : [],
    notes: parsed.notes || "",
    disclaimer: "AI-estimated prices based on market knowledge. For exact pricing, check recent eBay sold listings directly. Estimates may not reflect current market conditions.",
  };

  return {
    estimate,
    source: "ai_estimate",
    generatedAt: Date.now(),
  };
}
