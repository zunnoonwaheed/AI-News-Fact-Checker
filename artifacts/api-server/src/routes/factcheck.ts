import { Router, type IRouter } from "express";
import { db, factChecksTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import {
  CheckFactBody,
  CheckFactResponse,
  GetCheckHistoryQueryParams,
  GetCheckHistoryResponse,
  GetFactCheckStatsResponse,
  GetFactCheckByIdParams,
  GetFactCheckByIdResponse,
} from "@workspace/api-zod";
import { fetchRelatedArticles, analyzeWithClaude } from "../lib/factcheck";

const router: IRouter = Router();

router.post("/factcheck", async (req, res): Promise<void> => {
  try {
    const parsed = CheckFactBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", message: parsed.error.message });
      return;
    }

    const { query } = parsed.data;
    req.log.info({ queryLength: query.length }, "Starting fact check");

    const [relatedArticles, analysis] = await Promise.all([
      fetchRelatedArticles(query),
      analyzeWithClaude(query, []),
    ]);

    const analysisWithSources = await analyzeWithClaude(query, relatedArticles);

    const topSources = relatedArticles
      .filter(a => a.credibilityScore > 60)
      .slice(0, 5);

    const otherArticles = relatedArticles
      .filter(a => a.credibilityScore <= 60)
      .slice(0, 5);

    const [saved] = await db
      .insert(factChecksTable)
      .values({
        query,
        overallVerdict: analysisWithSources.overallVerdict,
        credibilityScore: analysisWithSources.credibilityScore,
        summary: analysisWithSources.summary,
        claims: analysisWithSources.claims,
        sources: topSources,
        relatedArticles: otherArticles,
        analysisDetails: analysisWithSources.analysisDetails,
      })
      .returning();

    req.log.info({ id: saved.id, verdict: saved.overallVerdict }, "Fact check complete");

    // Convert string "false" back to boolean false for API response
    const overallVerdict = saved.overallVerdict === "false" ? false : saved.overallVerdict;
    const claims = (saved.claims as any[]).map((claim: any) => ({
      ...claim,
      verdict: claim.verdict === "false" ? false : claim.verdict,
    }));

    res.json(
      CheckFactResponse.parse({
        id: saved.id,
        query: saved.query,
        overallVerdict,
        credibilityScore: saved.credibilityScore,
        summary: saved.summary,
        claims,
        sources: saved.sources,
        relatedArticles: saved.relatedArticles,
        analysisDetails: saved.analysisDetails,
        checkedAt: saved.checkedAt.toISOString(),
      })
    );
  } catch (error) {
    req.log.error({ error }, "Fact check failed");
    res.status(500).json({
      error: "Fact check failed",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
});

router.get("/factcheck/stats", async (req, res): Promise<void> => {
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(factChecksTable);

  const verdictRows = await db
    .select({
      verdict: factChecksTable.overallVerdict,
      count: sql<number>`count(*)::int`,
    })
    .from(factChecksTable)
    .groupBy(factChecksTable.overallVerdict);

  const verdictBreakdown: Record<string, number> = {};
  for (const row of verdictRows) {
    verdictBreakdown[row.verdict] = row.count;
  }

  const [avgResult] = await db
    .select({
      avg: sql<number>`coalesce(avg(credibility_score), 0)::float`,
    })
    .from(factChecksTable);

  const [recentResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(factChecksTable)
    .where(sql`checked_at > now() - interval '24 hours'`);

  res.json(
    GetFactCheckStatsResponse.parse({
      totalChecked: totalResult?.count ?? 0,
      verdictBreakdown,
      averageCredibilityScore: Math.round((avgResult?.avg ?? 0) * 10) / 10,
      recentChecks: recentResult?.count ?? 0,
    })
  );
});

router.get("/factcheck/history", async (req, res): Promise<void> => {
  const params = GetCheckHistoryQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "Invalid query params", message: params.error.message });
    return;
  }

  const limit = params.data.limit ?? 20;
  const verdictFilter = params.data.verdict;

  const query = db
    .select()
    .from(factChecksTable)
    .orderBy(desc(factChecksTable.checkedAt))
    .limit(limit);

  if (verdictFilter) {
    query.where(eq(factChecksTable.overallVerdict, verdictFilter));
  }

  const items = await query;

  const mapped = items.map(item => {
    // Convert string "false" back to boolean false for API response
    const overallVerdict = item.overallVerdict === "false" ? false : item.overallVerdict;
    const claims = (item.claims as any[]).map((claim: any) => ({
      ...claim,
      verdict: claim.verdict === "false" ? false : claim.verdict,
    }));

    return {
      id: item.id,
      query: item.query,
      overallVerdict,
      credibilityScore: item.credibilityScore,
      summary: item.summary,
      claims,
      sources: item.sources as unknown[],
      relatedArticles: item.relatedArticles as unknown[],
      analysisDetails: item.analysisDetails ?? undefined,
      checkedAt: item.checkedAt.toISOString(),
    };
  });

  res.json(GetCheckHistoryResponse.parse({ items: mapped, total: mapped.length }));
});

router.get("/factcheck/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetFactCheckByIdParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id", message: params.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(factChecksTable)
    .where(eq(factChecksTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Not found", message: "Fact check not found" });
    return;
  }

  // Convert string "false" back to boolean false for API response
  const overallVerdict = item.overallVerdict === "false" ? false : item.overallVerdict;
  const claims = (item.claims as any[]).map((claim: any) => ({
    ...claim,
    verdict: claim.verdict === "false" ? false : claim.verdict,
  }));

  res.json(
    GetFactCheckByIdResponse.parse({
      id: item.id,
      query: item.query,
      overallVerdict,
      credibilityScore: item.credibilityScore,
      summary: item.summary,
      claims,
      sources: item.sources as unknown[],
      relatedArticles: item.relatedArticles as unknown[],
      analysisDetails: item.analysisDetails ?? undefined,
      checkedAt: item.checkedAt.toISOString(),
    })
  );
});

export default router;
