export const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  InProgress: "bg-purple-100 text-purple-700",
  Resolved: "bg-green-100 text-green-700",
};

export const priorityColors: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
  Unclassified: "bg-gray-100 text-gray-600",
};

export const sentimentColors: Record<string, string> = {
  Frustrated: "bg-red-50 text-red-600",
  Neutral: "bg-gray-100 text-gray-600",
  Positive: "bg-green-50 text-green-700",
  Unclassified: "bg-gray-100 text-gray-500",
};