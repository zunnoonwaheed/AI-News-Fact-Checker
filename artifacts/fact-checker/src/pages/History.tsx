import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Filter, ChevronRight, FileSearch } from "lucide-react";
import { useGetCheckHistory, getGetCheckHistoryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CredibilityScore } from "@/components/CredibilityScore";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type VerdictFilter = "all" | "verified" | "false" | "misleading" | "partially_true" | "unverified";

const VERDICT_OPTIONS: { value: VerdictFilter; label: string }[] = [
  { value: "all", label: "All Verdicts" },
  { value: "verified", label: "Verified" },
  { value: "partially_true", label: "Partially True" },
  { value: "misleading", label: "Misleading" },
  { value: "false", label: "False" },
  { value: "unverified", label: "Unverified" },
];

export function History() {
  const [, setLocation] = useLocation();
  const [verdictFilter, setVerdictFilter] = useState<VerdictFilter>("all");

  const queryParams =
    verdictFilter === "all"
      ? { limit: 50 }
      : { limit: 50, verdict: verdictFilter as Exclude<VerdictFilter, "all"> };

  const { data, isLoading } = useGetCheckHistory(queryParams, {
    query: { queryKey: getGetCheckHistoryQueryKey(queryParams) },
  });

  return (
    <div className="space-y-7">

      {/* Page header */}
      <div className="border-b-2 border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Archive</p>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Verification History</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse all previously verified claims and news articles.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={verdictFilter}
            onValueChange={(v) => setVerdictFilter(v as VerdictFilter)}
          >
            <SelectTrigger className="w-[190px] bg-white border-border shadow-sm font-medium text-sm">
              <SelectValue placeholder="Filter by verdict" />
            </SelectTrigger>
            <SelectContent>
              {VERDICT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="font-medium">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data && (
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-md font-mono">
              {data.total} results
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border bg-white">
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full max-w-xl" />
                    <Skeleton className="h-3.5 w-3/4" />
                  </div>
                  <Skeleton className="w-8 h-8 shrink-0" />
                </CardContent>
              </Card>
            ))
          : data?.items.length === 0
          ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
              <FileSearch className="w-14 h-14 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-muted-foreground">No results found</h3>
              <p className="text-sm text-muted-foreground/60 mt-1">Try changing the filter or submit a new claim.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setLocation("/")}>
                Check a new claim
              </Button>
            </div>
          )
          : (
            <div className="rounded-xl border overflow-hidden bg-white shadow-sm divide-y divide-border">
              {data?.items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLocation(`/result/${item.id}`)}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  {/* Rank */}
                  <span className="hidden md:block text-xs font-mono text-muted-foreground/50 w-5 shrink-0 text-right">
                    {idx + 1}
                  </span>

                  {/* Credibility ring */}
                  <div className="shrink-0">
                    <CredibilityScore score={item.credibilityScore} size="sm" label={false} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <VerdictBadge verdict={item.overallVerdict} />
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {new Date(item.checkedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      "{item.query}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
