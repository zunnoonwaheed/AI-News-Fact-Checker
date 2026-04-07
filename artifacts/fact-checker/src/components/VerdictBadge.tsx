import { CheckCircle2, XCircle, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";

type Verdict = "verified" | "false" | "misleading" | "partially_true" | "unverified";

const VERDICT_CONFIG: Record<string, {
  bg: string; text: string; border: string; icon: React.ElementType; label: string; dot: string;
}> = {
  verified: {
    bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200",
    icon: CheckCircle2, label: "Verified", dot: "bg-emerald-500",
  },
  false: {
    bg: "bg-red-50", text: "text-red-800", border: "border-red-200",
    icon: XCircle, label: "False", dot: "bg-red-500",
  },
  misleading: {
    bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200",
    icon: AlertTriangle, label: "Misleading", dot: "bg-orange-500",
  },
  partially_true: {
    bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200",
    icon: AlertCircle, label: "Partially True", dot: "bg-amber-500",
  },
  unverified: {
    bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200",
    icon: HelpCircle, label: "Unverified", dot: "bg-slate-400",
  },
};

export function VerdictBadge({
  verdict,
  className = "",
  size = "sm",
}: {
  verdict: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const config = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG.unverified;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-sm px-4 py-2 gap-2 font-semibold",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-wide ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <Icon size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}

export function VerdictPill({ verdict }: { verdict: string }) {
  const config = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG.unverified;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
