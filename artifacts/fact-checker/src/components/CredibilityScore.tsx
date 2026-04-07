export function CredibilityScore({
  score,
  size = "md",
  label = true,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: boolean;
}) {
  const getColor = (s: number) => {
    if (s >= 75) return { stroke: "#10b981", text: "#065f46" };
    if (s >= 50) return { stroke: "#f59e0b", text: "#92400e" };
    if (s >= 30) return { stroke: "#f97316", text: "#9a3412" };
    return { stroke: "#ef4444", text: "#7f1d1d" };
  };

  const colors = getColor(score);

  const dims = {
    sm: { size: 44, r: 18, stroke: 4, fs: 9, lh: 11 },
    md: { size: 72, r: 30, stroke: 5.5, fs: 15, lh: 18 },
    lg: { size: 104, r: 44, stroke: 7, fs: 22, lh: 26 },
  }[size];

  const cx = dims.size / 2;
  const circumference = 2 * Math.PI * dims.r;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dims.size}
          height={dims.size}
          style={{ transform: "rotate(-90deg)" }}
          viewBox={`0 0 ${dims.size} ${dims.size}`}
        >
          <circle
            cx={cx}
            cy={cx}
            r={dims.r}
            fill="none"
            stroke="hsl(214 20% 90%)"
            strokeWidth={dims.stroke}
          />
          <circle
            cx={cx}
            cy={cx}
            r={dims.r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={dims.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ color: colors.text }}
        >
          <span
            className="font-black font-mono leading-none"
            style={{ fontSize: dims.fs }}
          >
            {Math.round(score)}
          </span>
          {size !== "sm" && (
            <span className="text-[8px] font-semibold uppercase tracking-wider opacity-70 mt-0.5">
              /100
            </span>
          )}
        </div>
      </div>
      {label && size !== "sm" && (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Credibility
        </span>
      )}
    </div>
  );
}
