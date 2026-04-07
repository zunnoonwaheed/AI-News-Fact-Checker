import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useCheckFact, useGetCheckHistory, getGetCheckHistoryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CredibilityScore } from "@/components/CredibilityScore";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const { mutate: checkFact, isPending, error } = useCheckFact();
  
  const { data: historyData, isLoading: historyLoading } = useGetCheckHistory(
    { limit: 5 },
    { query: { queryKey: getGetCheckHistoryQueryKey({ limit: 5 }) } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    checkFact({ data: { query } }, {
      onSuccess: (result) => {
        setLocation(`/result/${result.id}`);
      }
    });
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6 max-w-3xl mx-auto pt-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
            Verify the news. Find the truth.
          </h1>
          <p className="text-lg text-muted-foreground">
            Paste a headline, claim, or full article text to get an instant, AI-powered fact check with cited sources and credibility analysis.
          </p>
        </div>

        <Card className="border-2 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea 
                  placeholder="Enter a claim or article text..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[160px] resize-none text-base p-4 bg-muted/50 border-muted focus-visible:bg-background transition-colors"
                  disabled={isPending}
                />
                {isPending && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-md border border-primary/20 z-10 animate-in fade-in">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-serif font-bold text-foreground animate-pulse">Analyzing Sources...</h3>
                    <p className="text-sm text-muted-foreground mt-2">Cross-referencing databases and extracting claims</p>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error?.message || "Failed to analyze the claim. Please try again."}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={!query.trim() || isPending}
                  className="w-full sm:w-auto text-base"
                >
                  {isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Verify Claim
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6 pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">Recent Checks</h2>
          <Button variant="ghost" onClick={() => setLocation('/history')} className="text-muted-foreground">
            View all <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {historyLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : historyData?.items.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-muted/20 border-dashed">
            <p className="text-muted-foreground">No recent checks found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {historyData?.items.map(item => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group flex flex-col"
                onClick={() => setLocation(`/result/${item.id}`)}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <VerdictBadge verdict={item.overallVerdict} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.checkedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                    "{item.query}"
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 mt-auto">
                  <div className="pt-4 flex items-center justify-between border-t">
                    <span className="text-sm font-medium text-muted-foreground">Credibility Score</span>
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
