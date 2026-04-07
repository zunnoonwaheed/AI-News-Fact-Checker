import { useParams, useLocation } from "wouter";
import { useGetFactCheckById, getGetFactCheckByIdQueryKey } from "@workspace/api-client-react";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CredibilityScore } from "@/components/CredibilityScore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, Info, FileText, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function ResultDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = parseInt(params.id || "0");

  const { data, isLoading, error } = useGetFactCheckById(id, {
    query: { 
      queryKey: getGetFactCheckByIdQueryKey(id),
      enabled: !!id 
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-1/4" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 space-y-4">
        <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-2xl font-serif font-bold">Result Not Found</h2>
        <p className="text-muted-foreground">The fact check you're looking for doesn't exist or an error occurred.</p>
        <Button onClick={() => setLocation('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setLocation('/')} className="-ml-3 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {/* Header Section */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <VerdictBadge verdict={data.overallVerdict} className="text-base px-3 py-1.5" />
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(data.checkedAt).toLocaleString(undefined, { 
                    dateStyle: 'medium', timeStyle: 'short' 
                  })}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">
                "{data.query}"
              </h1>
            </div>
            <div className="shrink-0 p-4 bg-background border rounded-lg shadow-sm">
              <CredibilityScore score={data.credibilityScore} size="lg" />
            </div>
          </div>
          
          <div className="bg-background/80 p-5 rounded-lg border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Summary
            </h3>
            <p className="text-lg leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content: Claims & Analysis */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Claims Breakdown */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold flex items-center border-b pb-2">
              <Info className="w-5 h-5 mr-2 text-primary" /> 
              Claims Analysis
            </h2>
            
            <div className="space-y-4">
              {data.claims.map((claim, index) => (
                <Card key={index} className="overflow-hidden border-l-4 shadow-sm" style={{ 
                  borderLeftColor: claim.verdict === 'verified' ? 'var(--color-chart-3)' : 
                                   claim.verdict === 'false' ? 'var(--color-destructive)' : 
                                   claim.verdict === 'misleading' ? 'var(--color-chart-1)' : 
                                   claim.verdict === 'partially_true' ? 'var(--color-chart-4)' : 'var(--color-border)'
                }}>
                  <CardHeader className="p-5 pb-3 bg-muted/10">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <VerdictBadge verdict={claim.verdict} />
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border">
                        Confidence
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${claim.confidence}%` }} 
                          />
                        </div>
                        <span>{claim.confidence}%</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-snug">"{claim.text}"</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-3 text-muted-foreground">
                    {claim.explanation}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Analysis Details */}
          {data.analysisDetails && (
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-bold border-b pb-2">Detailed Methodology</h2>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground bg-muted/20 p-6 rounded-lg border">
                {data.analysisDetails.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Sources & Related */}
        <div className="space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold flex items-center border-b pb-2">
              <LinkIcon className="w-5 h-5 mr-2 text-primary" /> 
              Cited Sources
            </h2>
            
            <div className="space-y-3">
              {data.sources.map((source, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2">{source.name}</h4>
                      {source.credibilityScore && (
                        <Badge variant="secondary" className="shrink-0 font-mono text-xs">
                          Score: {source.credibilityScore}
                        </Badge>
                      )}
                    </div>
                    {source.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{source.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                      {source.publishedAt && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {new Date(source.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-primary hover:underline flex items-center ml-auto font-medium"
                      >
                        View Source <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {data.sources.length === 0 && (
                <div className="text-sm text-muted-foreground text-center p-4 border rounded-md">
                  No direct sources found.
                </div>
              )}
            </div>
          </section>

          {data.relatedArticles && data.relatedArticles.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-serif font-bold border-b pb-2">Related Articles</h2>
              <div className="space-y-3">
                {data.relatedArticles.map((article, index) => (
                  <a 
                    key={index} 
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 border rounded-md hover:bg-muted/50 transition-colors group"
                  >
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {article.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {new URL(article.url).hostname.replace('www.', '')}
                    </span>
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
