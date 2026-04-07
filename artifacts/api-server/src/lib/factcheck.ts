import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE = "https://newsapi.org/v2";

export interface NewsArticle {
  name: string;
  url: string;
  publishedAt: string;
  description: string;
  credibilityScore: number;
}

export interface Claim {
  text: string;
  verdict: "verified" | "false" | "misleading" | "unverified" | "partially_true";
  explanation: string;
  confidence: number;
}

export interface FactCheckAnalysis {
  overallVerdict: "verified" | "false" | "misleading" | "unverified" | "partially_true";
  credibilityScore: number;
  summary: string;
  claims: Claim[];
  analysisDetails: string;
}

const KNOWN_CREDIBLE_DOMAINS = [
  "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "nytimes.com",
  "washingtonpost.com", "theguardian.com", "npr.org", "pbs.org",
  "economist.com", "ft.com", "wsj.com", "bloomberg.com", "time.com",
  "theatlantic.com", "politico.com", "axios.com", "vox.com",
  "snopes.com", "factcheck.org", "politifact.com", "fullfact.org",
  "afp.com", "dw.com", "aljazeera.com", "cnn.com", "nbcnews.com",
  "cbsnews.com", "abcnews.go.com", "usatoday.com", "latimes.com",
];

const LOWER_CREDIBILITY_DOMAINS = [
  "infowars.com", "breitbart.com", "naturalnews.com", "rt.com",
  "sputniknews.com", "thegatewaypundit.com", "beforeitsnews.com",
];

function getDomainCredibility(url: string): number {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    if (KNOWN_CREDIBLE_DOMAINS.some(d => hostname.includes(d))) return 85 + Math.random() * 15;
    if (LOWER_CREDIBILITY_DOMAINS.some(d => hostname.includes(d))) return 10 + Math.random() * 20;
    return 40 + Math.random() * 30;
  } catch {
    return 50;
  }
}

export async function fetchRelatedArticles(query: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    logger.warn("NEWS_API_KEY not set, skipping news fetch");
    return [];
  }

  try {
    const searchQuery = query.length > 100 ? query.substring(0, 100) : query;
    const params = new URLSearchParams({
      q: searchQuery,
      language: "en",
      sortBy: "relevancy",
      pageSize: "10",
      apiKey: NEWS_API_KEY,
    });

    const response = await fetch(`${NEWS_API_BASE}/everything?${params}`);
    if (!response.ok) {
      logger.warn({ status: response.status }, "NewsAPI request failed");
      return [];
    }

    const data = await response.json() as {
      status: string;
      articles: Array<{
        source: { name: string };
        url: string;
        publishedAt: string;
        description: string | null;
      }>;
    };

    if (data.status !== "ok" || !data.articles) return [];

    return data.articles
      .filter(a => a.url && a.source?.name)
      .slice(0, 8)
      .map(article => ({
        name: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        description: article.description ?? "",
        credibilityScore: getDomainCredibility(article.url),
      }));
  } catch (err) {
    logger.error({ err }, "Failed to fetch related articles");
    return [];
  }
}

export async function analyzeWithClaude(
  query: string,
  relatedArticles: NewsArticle[]
): Promise<FactCheckAnalysis> {
  const sourcesContext = relatedArticles.length > 0
    ? `\n\nRelated news articles found:\n${relatedArticles.map((a, i) =>
        `${i + 1}. "${a.name}" - ${a.description || "No description"} (Published: ${a.publishedAt})`
      ).join("\n")}`
    : "\n\nNo related news articles were found for this claim.";

  const prompt = `You are an expert fact-checker and journalist. Analyze the following news claim or article and fact-check it thoroughly.

CLAIM/ARTICLE TO FACT-CHECK:
"${query}"
${sourcesContext}

Respond with a JSON object (no markdown, no code blocks) in EXACTLY this format:
{
  "overallVerdict": "verified" | "false" | "misleading" | "unverified" | "partially_true",
  "credibilityScore": <number 0-100>,
  "summary": "<2-3 sentence summary of the fact-check finding>",
  "claims": [
    {
      "text": "<specific claim extracted>",
      "verdict": "verified" | "false" | "misleading" | "unverified" | "partially_true",
      "explanation": "<clear explanation of why this verdict was given>",
      "confidence": <number 0-100>
    }
  ],
  "analysisDetails": "<detailed 3-5 paragraph analysis explaining the methodology, what was checked, what sources say, and the overall conclusion>"
}

VERDICT DEFINITIONS:
- "verified": The claim is accurate and supported by credible evidence
- "false": The claim is factually incorrect or fabricated  
- "misleading": Contains some truth but presents it in a deceptive or out-of-context way
- "partially_true": Some aspects are accurate but key parts are inaccurate or missing
- "unverified": Cannot be confirmed or denied with available information

Extract 2-5 specific claims from the article. Be objective, thorough, and cite reasoning. Use the credibilityScore (0-100) to reflect overall trustworthiness.`;

  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  try {
    const parsed = JSON.parse(content.text) as FactCheckAnalysis;
    return parsed;
  } catch {
    logger.error({ text: content.text }, "Failed to parse Claude JSON response");
    throw new Error("Failed to parse AI analysis response");
  }
}
