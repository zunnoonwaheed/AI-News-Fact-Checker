import { useParams, useLocation } from "wouter";
import { useGetFactCheckById, getGetFactCheckByIdQueryKey } from "@workspace/api-client-react";
import { VerdictBadge, VerdictPill } from "@/components/VerdictBadge";
import { CredibilityScore } from "@/components/CredibilityScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ExternalLink, Calendar, Info, FileText,
  Link as LinkIcon, ShieldCheck, AlertCircle, Newspaper
} from "lucide-react";

const VERDICT_LEFT_COLORS: Record<string, string> = {
  verified: "#10b981",
  false: "#ef4444",
  misleading: "#f97316",
  partially_true: "#f59e0b",
  unverified: "#94a3b8",
};

export function ResultDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = parseInt(params.id || "0");

  const { data, isLoading, error } = useGetFactCheckById(id, {
    query: { queryKey: getGetFactCheckByIdQueryKey(id), enabled: !!id },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-7 w-64" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 space-y-4">
        <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mx-auto" />
        <h2 className="text-2xl font-serif font-bold">Result Not Found</h2>
        <p className="text-muted-foreground">This fact check doesn't exist or an error occurred.</p>
        <Button onClick={() => setLocation("/")} className="mt-2">Return to Home</Button>
      </div>
    );
  }

  const claimTyped = data.claims as Array<{
    text: string; verdict: string; explanation: string; confidence: number; sources?: string[];
    sourceLinks?: Array<{ name: string; url: string; publishedAt?: string }>;
  }>;
  const sourcesTyped = data.sources as Array<{
    name: string; url: string; publishedAt?: string; description?: string; credibilityScore?: number;
  }>;
  const relatedTyped = (data.relatedArticles ?? []) as Array<{
    name: string; url: string; publishedAt?: string;
  }>;

  return (
    <div className="space-y-7 pb-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="-ml-3 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Button>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[300px]">
          Verification #{data.id}
        </span>
      </div>

      {/* Article-style header */}
      <div className="bg-white border-2 border-violet-300/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Category bar */}
        <div className="network-bg px-6 py-3 flex items-center justify-between relative overflow-hidden border-b-2 border-violet-400/30">
          <div className="flex items-center gap-3 relative z-10">
            <span className="bg-white text-violet-700 text-xs font-black uppercase px-2.5 py-1 rounded shadow-md">Fact Check</span>
            <VerdictBadge verdict={data.overallVerdict} size="lg" />
          </div>
          <span className="text-white text-sm flex items-center gap-1.5 relative z-10">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(data.checkedAt).toLocaleString(undefined, {
              dateStyle: "long", timeStyle: "short",
            })}
          </span>
        </div>

        <div className="px-6 md:px-10 py-8 bg-gradient-to-b from-violet-50/30 to-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Main headline */}
            <div className="flex-1 space-y-5">
              <h1 className="text-2xl md:text-4xl font-serif font-black text-foreground leading-tight border-l-4 border-violet-600 pl-4">
                "{data.query}"
              </h1>

              <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-l-4 border-violet-500/50 pl-4 py-3 rounded-r-lg">
                <p className="text-lg text-foreground/80 leading-relaxed font-medium italic">
                  {data.summary}
                </p>
              </div>

              {/* Source count badge */}
              {sourcesTyped.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Newspaper className="w-4 h-4 text-violet-600" />
                  <span className="text-violet-700 font-semibold">
                    Verified against {sourcesTyped.length} news source{sourcesTyped.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Credibility score box */}
            <div className="shrink-0 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300/50 rounded-xl p-6 flex flex-col items-center shadow-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-700 mb-3">Credibility Score</span>
              <CredibilityScore score={data.credibilityScore} size="lg" />
              <span className="text-xs text-muted-foreground mt-3 text-center max-w-[120px]">
                Based on {claimTyped.length} claim{claimTyped.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Consulted Banner */}
      {sourcesTyped.length > 0 && (
        <div className="bg-gradient-to-br from-violet-100 via-purple-100 to-violet-100 border-2 border-violet-300/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-2 rounded-lg shadow-md">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent uppercase">
                News Sources Consulted
              </h3>
              <p className="text-xs text-violet-700 font-semibold">
                This fact-check was verified against {sourcesTyped.length} trusted news source{sourcesTyped.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {sourcesTyped.map((source, i) => (
              <div
                key={i}
                className="bg-white border-2 border-violet-300/60 px-3 py-2 rounded-lg shadow-sm hover:shadow-md hover:border-violet-500/60 transition-all group flex items-center gap-2"
              >
                <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm font-bold text-violet-900 group-hover:text-violet-700 transition-colors">
                  {source.name}
                </span>
                {source.credibilityScore && source.credibilityScore > 70 && (
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left — Claims + Analysis */}
        <div className="lg:col-span-2 space-y-8">

          {/* Claims section */}
          <section>
            <div className="flex items-center gap-3 border-b-4 border-violet-600 pb-3 mb-6 bg-gradient-to-r from-violet-50 to-transparent px-4 -mx-4 py-2 rounded-tl-lg">
              <Info className="w-5 h-5 text-violet-600" />
              <h2 className="text-2xl font-serif font-black uppercase tracking-tight bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Claims Analysis</h2>
              <span className="ml-auto text-xs bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black px-3 py-1.5 rounded-full shadow-md">
                {claimTyped.length}
              </span>
            </div>

            <div className="space-y-4">
              {claimTyped.map((claim, i) => (
                <Card
                  key={i}
                  className="bg-white border overflow-hidden shadow-sm"
                  style={{ borderLeftWidth: 4, borderLeftColor: VERDICT_LEFT_COLORS[claim.verdict] ?? "#94a3b8" }}
                >
                  <CardHeader className="px-5 pt-4 pb-3 bg-muted/20">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <VerdictBadge verdict={claim.verdict} />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Confidence</span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${claim.confidence}%`,
                              backgroundColor: VERDICT_LEFT_COLORS[claim.verdict] ?? "#94a3b8",
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-foreground">{claim.confidence}%</span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold leading-snug text-foreground">
                      "{claim.text}"
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 py-4 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {claim.explanation}
                    </p>

                    {/* Display clickable source links (2-3 per claim) */}
                    {claim.sourceLinks && claim.sourceLinks.length > 0 && (
                      <div className="pt-3 border-t border-violet-200/50 space-y-2">
                        <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wide flex items-center gap-1.5">
                          <LinkIcon className="w-3 h-3" />
                          Source Articles ({claim.sourceLinks.length}):
                        </p>
                        <div className="space-y-2">
                          {claim.sourceLinks.map((sourceLink, idx) => (
                            <a
                              key={idx}
                              href={sourceLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-300/50 hover:border-violet-500/70 rounded-lg transition-all group"
                            >
                              <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Newspaper className="w-3 h-3 text-violet-600 shrink-0" />
                                  <p className="text-xs font-bold text-violet-900 group-hover:text-violet-700 transition-colors line-clamp-1">
                                    {sourceLink.name}
                                  </p>
                                </div>
                                {sourceLink.publishedAt && (
                                  <p className="text-[10px] text-violet-600/70 font-mono flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" />
                                    {new Date(sourceLink.publishedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-1 group-hover:text-violet-600 transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fallback to source names if no links available */}
                    {(!claim.sourceLinks || claim.sourceLinks.length === 0) && claim.sources && claim.sources.length > 0 && (
                      <div className="pt-3 border-t border-violet-200/50">
                        <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <Newspaper className="w-3 h-3" />
                          Verified by these sources:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {claim.sources.map((source, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 text-[10px] font-bold px-2 py-1 rounded-md border border-violet-300/50"
                            >
                              <Newspaper className="w-3 h-3" />
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Methodology */}
          {data.analysisDetails && (
            <section>
              <div className="flex items-center gap-3 border-b-4 border-violet-600 pb-3 mb-6 bg-gradient-to-r from-violet-50 to-transparent px-4 -mx-4 py-2 rounded-tl-lg">
                <AlertCircle size={20} className="text-violet-600" />
                <h2 className="text-2xl font-serif font-black uppercase tracking-tight bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Analysis Method</h2>
              </div>
              <div className="bg-gradient-to-br from-white to-violet-50/30 border-2 border-violet-200/50 rounded-xl p-6 shadow-sm">
                <div className="prose prose-sm prose-slate max-w-none text-muted-foreground">
                  {data.analysisDetails.split("\n").filter(Boolean).map((p, i) => (
                    <p key={i} className="mb-3 last:mb-0 leading-relaxed text-sm">{p}</p>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right — Sources */}
        <div className="space-y-7">

          {/* Cited sources */}
          <section>
            <div className="flex flex-col gap-2 border-b-4 border-violet-600 pb-3 mb-4 bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-3 rounded-t-lg -mx-3">
              <div className="flex items-center gap-2">
                <LinkIcon size={18} className="text-violet-700" />
                <h2 className="text-lg font-serif font-black uppercase bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">News Sources</h2>
              </div>
              <p className="text-[11px] text-violet-700 font-semibold">
                Verified by these news channels
              </p>
            </div>

            <div className="space-y-3">
              {sourcesTyped.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed border-violet-200 rounded-lg bg-violet-50/30">
                  No direct sources found.
                </div>
              ) : (
                sourcesTyped.map((source, i) => (
                  <div key={i} className="bg-gradient-to-br from-white to-violet-50/40 border-2 border-violet-200/60 rounded-xl p-4 shadow-md hover:border-violet-400/60 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shrink-0 shadow-md">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Newspaper className="w-4 h-4 text-violet-600 shrink-0" />
                          <h4 className="font-black text-sm leading-snug text-violet-900 line-clamp-2">
                            {source.name}
                          </h4>
                        </div>
                        {source.credibilityScore && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wide">Credibility</span>
                            <div className="flex-1 h-1.5 bg-violet-100 rounded-full overflow-hidden max-w-[80px]">
                              <div
                                className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                                style={{ width: `${source.credibilityScore}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black font-mono text-violet-700">
                              {Math.round(source.credibilityScore)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {source.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed pl-11 border-l-2 border-violet-300/50">
                        {source.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between border-t-2 border-violet-200/50 pt-2 mt-2">
                      {source.publishedAt && (
                        <span className="text-[10px] font-mono text-violet-600/80 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(source.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-violet-700 hover:text-violet-900 hover:underline flex items-center gap-1 font-bold ml-auto bg-violet-100 hover:bg-violet-200 px-2 py-1 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read Article <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Related articles */}
          {relatedTyped.length > 0 && (
            <section>
              <div className="flex flex-col gap-2 border-b-4 border-violet-600 pb-3 mb-4 bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-3 rounded-t-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Newspaper size={18} className="text-violet-700" />
                  <h2 className="text-lg font-serif font-black uppercase bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Related News</h2>
                </div>
              </div>
              <div className="space-y-2">
                {relatedTyped.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 p-3 border-2 border-violet-200/60 rounded-lg bg-gradient-to-r from-white to-violet-50/30 hover:from-violet-50 hover:to-purple-50 hover:border-violet-400/60 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="w-1 h-full min-h-[36px] rounded-full bg-violet-300 group-hover:bg-gradient-to-b group-hover:from-violet-600 group-hover:to-purple-600 shrink-0 transition-all" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold line-clamp-2 text-violet-900 group-hover:text-violet-700 transition-colors leading-snug">
                        {article.name}
                      </p>
                      <span className="text-[10px] text-violet-600/70 font-mono mt-0.5 block">
                        {(() => { try { return new URL(article.url).hostname.replace("www.", ""); } catch { return ""; } })()}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-violet-400 shrink-0 mt-0.5 group-hover:text-violet-600 transition-colors" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
