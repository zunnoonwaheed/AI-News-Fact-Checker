import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Loader2, ArrowRight, AlertCircle, ShieldCheck, Zap, Globe, CheckSquare } from "lucide-react";
import { useCheckFact, useGetCheckHistory, getGetCheckHistoryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CredibilityScore } from "@/components/CredibilityScore";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const { mutate: checkFact, isPending, error } = useCheckFact();

  const { data: historyData, isLoading: historyLoading } = useGetCheckHistory(
    { limit: 6 },
    { query: { queryKey: getGetCheckHistoryQueryKey({ limit: 6 }) } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    checkFact(
      { data: { query } },
      { onSuccess: (result) => setLocation(`/result/${result.id}`) }
    );
  };

  return (
    <div className="space-y-12">

      {/* Hero */}
      <section className="hero-gradient rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 md:px-12 py-10 md:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/20 border border-primary/30 text-blue-200 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                AI Fact Verification
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight tracking-tight mb-4">
              Is the news you're reading actually true?
            </h1>
            <p className="text-blue-100/80 text-base md:text-lg leading-relaxed">
              Paste any headline, claim, or full article. Our AI cross-references live news sources and returns a verdict in seconds.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-lg overflow-hidden shadow-lg">
              <Textarea
                placeholder="Paste a news headline, claim, or article text here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px] resize-none bg-transparent text-white placeholder:text-blue-200/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-5 pr-4"
                disabled={isPending}
              />
              {isPending && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Analyzing Claim...</h3>
                      <p className="text-blue-200/70 text-sm mt-1">Cross-referencing sources, extracting claims, generating verdict</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {["NewsAPI", "Claude AI", "Source Check"].map((step, i) => (
                        <span key={i} className="text-[11px] text-blue-300/80 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-400/20 text-red-200 p-3 rounded-md flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Analysis failed. Please try again.</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-blue-200/50 text-xs">
                Supports headlines, full articles, social media claims
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={!query.trim() || isPending}
                className="bg-white text-primary hover:bg-blue-50 font-bold px-8 shadow-lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Verify Now
              </Button>
            </div>
          </form>
        </div>

        {/* Feature strip */}
        <div className="border-t border-white/10 bg-black/20 px-6 md:px-12 py-3 flex flex-wrap gap-x-8 gap-y-2">
          {[
            { icon: Zap, text: "Real-time analysis" },
            { icon: Globe, text: "Live news sources" },
            { icon: CheckSquare, text: "Claim-by-claim breakdown" },
            { icon: ShieldCheck, text: "Source credibility scoring" },
          ].map(({ icon: Icon, text }, i) => (
            <span key={i} className="flex items-center gap-2 text-blue-200/60 text-xs font-medium">
              <Icon size={12} />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* Recent checks */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b-2 border-border pb-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">Recent Verifications</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Latest fact checks from our AI engine</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/history")}
            className="text-primary border-primary/30 hover:bg-primary/5 font-semibold text-sm"
          >
            Full Archive
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>

        {historyLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : historyData?.items.length === 0 ? (
          <div className="text-center py-14 border-2 border-dashed rounded-xl bg-muted/30">
            <ShieldCheck className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-muted-foreground">No verifications yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">Submit your first claim above to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {historyData?.items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden cursor-pointer card-hover border bg-white"
                onClick={() => setLocation(`/result/${item.id}`)}
              >
                <CardContent className="p-5 flex flex-col h-full gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <VerdictBadge verdict={item.overallVerdict} />
                    <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                      {new Date(item.checkedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <p className="text-sm font-medium leading-snug text-foreground line-clamp-3 flex-1">
                    "{item.query}"
                  </p>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Credibility</span>
                    </div>
                    <CredibilityScore score={item.credibilityScore} size="sm" label={false} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
