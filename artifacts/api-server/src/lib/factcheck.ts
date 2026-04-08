import Groq from "groq-sdk";
import { logger } from "./logger";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
  sources?: string[]; // Array of source names that support/refute this claim
  sourceLinks?: Array<{ name: string; url: string; publishedAt?: string }>; // Actual article links for this claim (2-3 links)
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
        `Article #${i + 1}: [${a.name}] - ${a.description || "No description"} (Published: ${a.publishedAt}, URL: ${a.url})`
      ).join("\n")}\n\nIMPORTANT: When analyzing claims, cite which specific articles (by number like "Article #1", "Article #2") support or refute each claim. You MUST include article numbers in the "articleNumbers" field.`
    : "\n\nNo related news articles were found for this claim.";

  const prompt = `You are an expert fact-checker and journalist. Analyze the following news claim or article and fact-check it thoroughly.

CLAIM/ARTICLE TO FACT-CHECK:
"${query}"
${sourcesContext}

Respond with a JSON object (no markdown, no code blocks) in EXACTLY this format. IMPORTANT: For the "false" verdict, use the boolean value false (not the string "false"):
{
  "overallVerdict": "verified" | false | "misleading" | "unverified" | "partially_true",
  "credibilityScore": <number 0-100>,
  "summary": "<2-3 sentence summary of the fact-check finding>",
  "claims": [
    {
      "text": "<specific claim extracted>",
      "verdict": "verified" | false | "misleading" | "unverified" | "partially_true",
      "explanation": "<clear explanation of why this verdict was given, MUST cite which specific news sources (by name AND article number) support or refute this claim>",
      "confidence": <number 0-100>,
      "sources": ["<source 1 name>", "<source 2 name>"],
      "articleNumbers": [1, 2, 3]
    }
  ],
  "analysisDetails": "<detailed 3-5 paragraph analysis explaining the methodology, what was checked, what sources say (cite source names like 'According to Reuters...', 'BBC reported...'), and the overall conclusion>"
}

VERDICT DEFINITIONS:
- "verified": The claim is accurate and supported by credible evidence
- false: The claim is factually incorrect or fabricated (use boolean false, NOT the string "false")
- "misleading": Contains some truth but presents it in a deceptive or out-of-context way
- "partially_true": Some aspects are accurate but key parts are inaccurate or missing
- "unverified": Cannot be confirmed or denied with available information

CRITICAL INSTRUCTIONS:
1. Extract 2-5 specific claims from the article
2. For EACH claim, you MUST include "articleNumbers" array with 2-3 article numbers that support/refute the claim (e.g., [1, 3, 5])
3. For EACH claim, cite which specific news sources (e.g., "Reuters", "BBC", "CNN") support or refute it
4. In the explanation field, explicitly mention source names like "According to Article #1 (Reuters)..." or "Article #2 (BBC) confirms..."
5. In the analysisDetails, cite sources throughout like "Article #1 (Reuters) reported...", "As stated by Article #3 (CNN)...", "Article #2 (BBC)'s analysis shows..."
6. The "sources" array for each claim should list the news source names that verify/refute that specific claim
7. The "articleNumbers" array should contain 2-3 article numbers (integers) from the related articles list
8. Be objective, thorough, and always attribute information to specific sources
9. Use the credibilityScore (0-100) to reflect overall trustworthiness based on source quality`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Groq");
  }

  try {
    const parsed = JSON.parse(content) as any;

    // Convert string "false" to boolean false for overallVerdict
    if (parsed.overallVerdict === "false") {
      parsed.overallVerdict = false;
    }

    // Convert string "false" to boolean false for all claim verdicts and populate sourceLinks
    if (parsed.claims && Array.isArray(parsed.claims)) {
      parsed.claims = parsed.claims.map((claim: any) => {
        if (claim.verdict === "false") {
          claim.verdict = false;
        }

        // Map article numbers to actual source links
        if (claim.articleNumbers && Array.isArray(claim.articleNumbers) && relatedArticles.length > 0) {
          claim.sourceLinks = claim.articleNumbers
            .filter((num: number) => num >= 1 && num <= relatedArticles.length)
            .slice(0, 3) // Limit to 3 links per claim
            .map((num: number) => {
              const article = relatedArticles[num - 1]; // Convert 1-based to 0-based index
              return {
                name: article.name,
                url: article.url,
                publishedAt: article.publishedAt,
              };
            });
        }

        return claim;
      });
    }

    return parsed as FactCheckAnalysis;
  } catch {
    logger.error({ text: content }, "Failed to parse Groq JSON response");
    throw new Error("Failed to parse AI analysis response");
  }
}
