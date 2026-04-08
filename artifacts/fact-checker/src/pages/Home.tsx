import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Loader2, ArrowRight, AlertCircle, ShieldCheck, Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, ExternalLink, Newspaper } from "lucide-react";
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
    { limit: 9 },
    { query: { queryKey: getGetCheckHistoryQueryKey({ limit: 9 }) } }
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
    <div className="space-y-8">

      {/* Breaking News Banner - Violet gradient */}
      <div className="network-bg text-white px-6 py-4 rounded-2xl shadow-2xl overflow-hidden border border-violet-400/20">
        <div className="flex items-center gap-3 relative z-10">
          <span className="bg-gradient-to-r from-violet-400 to-violet-500 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg animate-pulse">Live</span>
          <p className="text-sm font-semibold">
            AI-powered fact verification • Real-time news analysis • Multi-source verification
          </p>
        </div>
      </div>

      {/* Main Feature - Fact Checker */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Main feature */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-violet-300/40 rounded-2xl shadow-2xl overflow-hidden">
            <div className="network-bg px-6 py-5 border-b-4 border-violet-400/50 relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30 shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-white font-serif text-2xl font-bold tracking-tight">Fact Verification Center</h2>
                  <p className="text-violet-100 text-sm">AI-powered news verification with multi-source analysis</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-b from-violet-50/50 to-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Enter any news headline, claim, or article to verify its accuracy..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[140px] resize-none text-base border-2 border-violet-200 focus:border-primary shadow-sm focus:shadow-lg transition-all"
                    disabled={isPending}
                  />
                  {isPending && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                          <Loader2 className="w-7 h-7 animate-spin text-primary" />
                        </div>
                        <div>
                          <h3 className="text-foreground font-bold text-lg">Verifying Claim</h3>
                          <p className="text-muted-foreground text-sm mt-1">Analyzing sources and cross-referencing data...</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {["Fetching", "Analyzing", "Verifying"].map((step, i) => (
                            <span key={i} className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-1 rounded border border-primary/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Verification Failed</p>
                      <p className="text-sm mt-1">Unable to analyze the claim. Please try again or rephrase your query.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Headlines supported
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Full articles
                    </span>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!query.trim() || isPending}
                    className="bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg text-base"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Verify Claim
                  </Button>
                </div>
              </form>

              {/* Stats banner */}
              <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
                {[
                  { icon: Zap, label: "Instant Results", value: "< 10 sec" },
                  { icon: TrendingUp, label: "Accuracy Rate", value: "95%" },
                  { icon: ShieldCheck, label: "Sources Checked", value: "100+" },
                ].map(({ icon: Icon, label, value }, i) => (
                  <div key={i} className="text-center">
                    <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                    <p className="text-lg font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Quick info */}
        <div className="space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5">
              <h3 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Why Verify?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Misinformation spreads 6x faster than truth online</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>68% of people share news without reading full articles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AI can verify claims 100x faster than human fact-checkers</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 border-2 border-violet-200 shadow-lg">
            <CardContent className="p-5">
              <h3 className="font-serif font-bold text-lg mb-3 text-violet-900">How It Works</h3>
              <ol className="space-y-3 text-sm">
                {[
                  "Submit your claim or news article",
                  "AI fetches sources from top news channels",
                  "Multi-source verification & analysis",
                  "Detailed verdict with source citations"
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-md">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Verifications - News grid style */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-4 relative">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 rounded-full"></div>
          <div>
            <h2 className="text-2xl font-serif font-black text-foreground uppercase tracking-tight bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Latest Verifications</h2>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
              <Clock size={14} />
              Recently fact-checked with multi-source analysis
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/history")}
            className="text-primary border-primary/50 border-2 font-semibold hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white hover:border-transparent shadow-sm"
          >
            View Archive
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>
        </div>

        {historyLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-3 w-4/6" />
                  <div className="flex items-center justify-between pt-3">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !historyData?.items || historyData.items.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="text-center py-16">
              <ShieldCheck className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-muted-foreground mb-2">No Verifications Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to verify a claim! Submit a news headline or article above to get started with AI fact-checking.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {historyData.items.map((item) => {
              const sourcesTyped = (item.sources ?? []) as Array<{ name: string }>;
              const sourceCount = sourcesTyped.length;
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-violet-400/60 bg-white group"
                  onClick={() => setLocation(`/result/${item.id}`)}
                >
                  <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 px-4 py-2.5 border-b flex items-center justify-between">
                    <VerdictBadge verdict={item.overallVerdict} />
                    <span className="text-[10px] text-violet-600 font-mono uppercase tracking-wide font-semibold">
                      {new Date(item.checkedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <CardContent className="p-5 flex flex-col gap-3">
                    <h3 className="text-base font-serif font-bold leading-tight text-foreground line-clamp-3">
                      "{item.query}"
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed border-l-3 border-violet-400/50 pl-3">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-violet-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Score</span>
                      </div>
                      <CredibilityScore score={item.credibilityScore} size="sm" label={false} />
                    </div>

                    {sourceCount > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-violet-600 font-semibold bg-violet-50 px-2.5 py-1.5 rounded-lg">
                        <Newspaper size={12} />
                        {sourceCount} news source{sourceCount !== 1 ? 's' : ''} verified
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1 group-hover:text-violet-600 transition-colors">
                        <ExternalLink size={12} />
                        View Full Report
                      </span>
                      <ArrowRight size={14} className="text-violet-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
