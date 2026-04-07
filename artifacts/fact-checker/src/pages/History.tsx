import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Filter, CalendarIcon, ChevronRight } from "lucide-react";
import { useGetCheckHistory, getGetCheckHistoryQueryKey, GetCheckHistoryVerdict } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CredibilityScore } from "@/components/CredibilityScore";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function History() {
  const [, setLocation] = useLocation();
  const [verdictFilter, setVerdictFilter] = useState<GetCheckHistoryVerdict | "all">("all");
  
  const queryParams = verdictFilter === "all" ? { limit: 50 } : { limit: 50, verdict: verdictFilter };
  
  const { data, isLoading } = useGetCheckHistory(
    queryParams,
    { query: { queryKey: getGetCheckHistoryQueryKey(queryParams) } }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Check History</h1>
          <p className="text-muted-foreground mt-1">Browse all previously verified claims and articles.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select 
            value={verdictFilter} 
            onValueChange={(val) => setVerdictFilter(val as any)}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by verdict" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verdicts</SelectItem>
              <SelectItem value={GetCheckHistoryVerdict.verified}>Verified</SelectItem>
              <SelectItem value={GetCheckHistoryVerdict.partially_true}>Partially True</SelectItem>
              <SelectItem value={GetCheckHistoryVerdict.misleading}>Misleading</SelectItem>
              <SelectItem value={GetCheckHistoryVerdict.false}>False</SelectItem>
              <SelectItem value={GetCheckHistoryVerdict.unverified}>Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full max-w-2xl" />
                </div>
                <Skeleton className="w-24 h-8" />
              </div>
            </Card>
          ))
        ) : data?.items.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-muted/20 border-dashed">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or submitting a new check.</p>
          </div>
        ) : (
          <div className="divide-y border rounded-md bg-card overflow-hidden">
            {data?.items.map(item => (
              <div 
                key={item.id}
                onClick={() => setLocation(`/result/${item.id}`)}
                className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="hidden md:block shrink-0 px-2">
                  <CredibilityScore score={item.credibilityScore} size="sm" label={false} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <VerdictBadge verdict={item.overallVerdict} />
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(item.checkedAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-medium truncate group-hover:text-primary transition-colors">
                    "{item.query}"
                  </h3>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {item.summary}
                  </p>
                </div>
                
                <div className="hidden md:flex shrink-0 items-center justify-center p-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
