
// Extract utility functions to their own file
export const getVariantForStatus = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status.toLowerCase()) {
    case "flagged":
      return "destructive";
    case "pending":
      return "secondary";
    case "warning":
      return "outline";
    default:
      return "default";
  }
};
