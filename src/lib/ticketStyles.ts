export const statusColors: Record<string, string> = {
  Open: "bg-slate-100 text-slate-600",
  InProgress: "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

export const priorityColors: Record<string, string> = {
  Urgent: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
  High: "text-amber-700",
  Medium: "text-slate-600",
  Low: "text-slate-500",
  Unclassified: "text-slate-500",
};

export const sentimentColors: Record<string, string> = {
  Frustrated: "text-amber-700",
  Neutral: "text-slate-600",
  Positive: "text-emerald-700",
  Unclassified: "text-slate-600",
};
