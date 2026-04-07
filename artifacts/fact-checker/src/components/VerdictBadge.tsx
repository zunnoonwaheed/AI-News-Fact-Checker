import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";

export function VerdictBadge({ verdict, className = "" }: { verdict: string, className?: string }) {
  const config = {
    verified: { color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20", icon: CheckCircle2, label: "Verified" },
    false: { color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20", icon: XCircle, label: "False" },
    misleading: { color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20", icon: AlertTriangle, label: "Misleading" },
    partially_true: { color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20", icon: AlertCircle, label: "Partially True" },
    unverified: { color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20", icon: HelpCircle, label: "Unverified" },
  }[verdict] || { color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20", icon: HelpCircle, label: verdict };

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 px-2.5 py-1 border font-medium whitespace-nowrap ${config.color} ${className}`}>
      <Icon size={14} />
      {config.label}
    </Badge>
  );
}
