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
    text: string; verdict: string; explanation: string; confidence: number;
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

      {/* Hero header card */}
      <div className="hero-gradient rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 md:px-10 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <VerdictBadge verdict={data.overallVerdict} size="lg" />
                <span className="text-blue-200/70 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(data.checkedAt).toLocaleString(undefined, {
                    dateStyle: "long", timeStyle: "short",
                  })}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">
                "{data.query}"
              </h1>
            </div>

            <div className="shrink-0 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 flex items-center justify-center">
              <CredibilityScore score={data.credibilityScore} size="lg" />
            </div>
          </div>
        </div>

        {/* Summary bar */}
        <div className="border-t border-white/10 bg-black/20 px-6 md:px-10 py-4">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
            <p className="text-blue-100/90 text-sm leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left — Claims + Analysis */}
        <div className="lg:col-span-2 space-y-8">

          {/* Claims section */}
          <section>
            <div className="flex items-center gap-2 border-b-2 border-border pb-3 mb-5">
              <Info className="w-4.5 h-4.5 text-primary" size={18} />
              <h2 className="text-lg font-serif font-bold">Claims Analysis</h2>
              <span className="ml-auto text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                {claimTyped.length} claim{claimTyped.length !== 1 ? "s" : ""}
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
                  <CardContent className="px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                    {claim.explanation}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Methodology */}
          {data.analysisDetails && (
            <section>
              <div className="flex items-center gap-2 border-b-2 border-border pb-3 mb-5">
                <AlertCircle size={18} className="text-primary" />
                <h2 className="text-lg font-serif font-bold">AI Analysis Methodology</h2>
              </div>
              <div className="bg-white border rounded-xl p-6 shadow-sm">
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
            <div className="flex items-center gap-2 border-b-2 border-border pb-3 mb-4">
              <LinkIcon size={16} className="text-primary" />
              <h2 className="text-base font-serif font-bold">Cited Sources</h2>
            </div>

            <div className="space-y-3">
              {sourcesTyped.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                  No direct sources found.
                </div>
              ) : (
                sourcesTyped.map((source, i) => (
                  <div key={i} className="bg-white border rounded-lg p-4 shadow-sm hover:border-primary/40 transition-colors group">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {source.name}
                      </h4>
                      {source.credibilityScore && (
                        <span className="text-[10px] font-black font-mono shrink-0 text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {Math.round(source.credibilityScore)}
                        </span>
                      )}
                    </div>
                    {source.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                        {source.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-2">
                      {source.publishedAt && (
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          {new Date(source.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-bold ml-auto"
                      >
                        View <ExternalLink className="w-3 h-3" />
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
              <div className="flex items-center gap-2 border-b-2 border-border pb-3 mb-4">
                <Newspaper size={16} className="text-primary" />
                <h2 className="text-base font-serif font-bold">Related Coverage</h2>
              </div>
              <div className="space-y-2">
                {relatedTyped.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                  >
                    <div className="w-1 h-full min-h-[36px] rounded-full bg-border group-hover:bg-primary shrink-0 transition-colors" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {article.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                        {(() => { try { return new URL(article.url).hostname.replace("www.", ""); } catch { return ""; } })()}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
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
