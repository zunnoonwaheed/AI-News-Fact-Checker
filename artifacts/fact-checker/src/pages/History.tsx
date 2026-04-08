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

      {/* Page header - Modern violet gradient */}
      <div className="pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 rounded-full"></div>
        <div>
          <p className="text-violet-600 text-xs font-black uppercase tracking-[0.25em] mb-2">News Archive</p>
          <h1 className="text-4xl font-serif font-black tracking-tight uppercase bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Verification History</h1>
          <p className="text-foreground/70 mt-2 text-base font-medium">
            Complete archive of fact-checked claims and news articles
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300/40 rounded-xl p-3 shadow-lg">
          <Filter className="w-5 h-5 text-violet-600" />
          <Select
            value={verdictFilter}
            onValueChange={(v) => setVerdictFilter(v as VerdictFilter)}
          >
            <SelectTrigger className="w-[190px] bg-white border-violet-300/50 shadow-sm font-semibold text-sm">
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
            <span className="text-xs text-white bg-primary px-3 py-1.5 rounded-full font-bold shadow-md">
              {data.total}
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
          : !data?.items || data.items.length === 0
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
            <div className="rounded-xl border-2 border-violet-200/40 overflow-hidden bg-white shadow-md divide-y-2 divide-violet-100/50">
              {data?.items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLocation(`/result/${item.id}`)}
                  className="flex items-center gap-5 px-6 py-5 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-violet-600"
                >
                  {/* Rank */}
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <span className="text-lg font-black text-violet-400 group-hover:text-violet-600 transition-colors">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Credibility ring */}
                  <div className="shrink-0">
                    <CredibilityScore score={item.credibilityScore} size="md" label={false} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <VerdictBadge verdict={item.overallVerdict} />
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                        {new Date(item.checkedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-base font-serif font-bold text-foreground leading-tight line-clamp-2 group-hover:text-violet-700 transition-colors mb-1.5">
                      "{item.query}"
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed border-l-2 border-violet-300/40 pl-3">
                      {item.summary}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
