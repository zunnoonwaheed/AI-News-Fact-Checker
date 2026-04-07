import { useGetFactCheckStats, getGetFactCheckStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VerdictBadge } from "@/components/VerdictBadge";
import { FileText, ShieldAlert, Target, Activity, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const VERDICT_COLORS: Record<string, string> = {
  verified: "#10b981",
  partially_true: "#f59e0b",
  misleading: "#f97316",
  false: "#ef4444",
  unverified: "#94a3b8",
};

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent = false,
  loading = false,
}: {
  title: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
  loading?: boolean;
}) {
  return (
    <Card className="bg-white border shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className={`text-4xl font-black font-mono tracking-tighter ${accent ? "text-destructive" : "text-foreground"}`}>
                {value}
              </div>
            )}
            {sub && !loading && (
              <p className="text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-lg shrink-0 ml-4 ${accent ? "bg-red-50" : "bg-primary/8 bg-blue-50"}`}>
            <Icon size={20} className={accent ? "text-destructive" : "text-primary"} strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Stats() {
  const { data, isLoading } = useGetFactCheckStats({
    query: { queryKey: getGetFactCheckStatsQueryKey() },
  });

  const chartData = data
    ? Object.entries(data.verdictBreakdown).map(([key, value]) => ({
        name: key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        rawKey: key,
        value: value as number,
        color: VERDICT_COLORS[key] ?? "#94a3b8",
      }))
    : [];

  const total = data?.totalChecked || 1;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="border-b-2 border-border pb-4">
        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform metrics and fact-checking performance statistics.</p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Verifications"
          value={data?.totalChecked.toLocaleString() ?? "—"}
          icon={FileText}
          loading={isLoading}
        />
        <StatCard
          title="Avg Credibility Score"
          value={<>{Math.round(data?.averageCredibilityScore || 0)}<span className="text-xl text-muted-foreground font-bold">/100</span></>}
          icon={Target}
          loading={isLoading}
        />
        <StatCard
          title="Last 24 Hours"
          value={data?.recentChecks ?? "—"}
          sub="checks submitted today"
          icon={Activity}
          loading={isLoading}
        />
        <StatCard
          title="False Claims Caught"
          value={data?.verdictBreakdown["false"] ?? 0}
          icon={ShieldAlert}
          accent={true}
          loading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Pie chart */}
        <Card className="lg:col-span-2 bg-white border shadow-sm">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Verdict Distribution
            </CardTitle>
            <CardDescription className="text-xs">All checks by outcome</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[280px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="w-[200px] h-[200px] rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="#fff" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(214 20% 86%)",
                      backgroundColor: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Breakdown table */}
        <Card className="lg:col-span-3 bg-white border shadow-sm">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base font-bold">Verdict Breakdown</CardTitle>
            <CardDescription className="text-xs">Detailed count by outcome category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : chartData.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No data yet — submit a fact check to see stats.
              </div>
            ) : (
              <div className="space-y-3">
                {chartData
                  .sort((a, b) => (b.value as number) - (a.value as number))
                  .map((item, i) => {
                    const pct = Math.round(((item.value as number) / total) * 100);
                    return (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <VerdictBadge verdict={item.rawKey} size="sm" />
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black tabular-nums">{item.value as number}</span>
                            <span className="text-xs text-muted-foreground font-mono w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
