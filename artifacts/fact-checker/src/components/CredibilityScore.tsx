export function CredibilityScore({ score, size = "md", label = true }: { score: number, size?: "sm" | "md" | "lg", label?: boolean }) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-500";
    if (s >= 50) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };
  
  const textClass = getColor(score);

  const dimensions = {
    sm: { w: 10, r: 18, cx: 20, stroke: 4, text: "text-xs" },
    md: { w: 16, r: 28, cx: 32, stroke: 6, text: "text-lg" },
    lg: { w: 24, r: 42, cx: 48, stroke: 8, text: "text-3xl" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="relative flex items-center justify-center">
        <svg className={`transform -rotate-90 w-${dimensions.w} h-${dimensions.w}`} viewBox={`0 0 ${dimensions.cx * 2} ${dimensions.cx * 2}`}>
          <circle 
            cx={dimensions.cx} cy={dimensions.cx} r={dimensions.r} 
            stroke="currentColor" strokeWidth={dimensions.stroke} 
            fill="transparent" 
            className="text-muted" 
          />
          <circle 
            cx={dimensions.cx} cy={dimensions.cx} r={dimensions.r} 
            stroke="currentColor" strokeWidth={dimensions.stroke} 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round"
            className={`${textClass} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <span className={`absolute font-bold font-mono tracking-tighter ${dimensions.text} ${textClass}`}>
          {score}
        </span>
      </div>
      {label && size !== "sm" && <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Credibility</span>}
    </div>
  );
}
