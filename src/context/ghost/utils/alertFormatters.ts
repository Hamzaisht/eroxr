import { LiveAlert } from "@/types/alerts";

export interface FlaggedContentData {
  id: string;
  content_id: string;
  user_id?: string;
  flagged_by?: string;
  content_type: string;
  status: string;
  reason: string;
  severity: string;
  notes?: string;
  flagged_at: string;
  username?: string;
  avatar_url?: string;
}

export interface ReportData {
  id: string;
  content_type: string;
  reason: string;
  status: string;
  created_at: string;
  is_emergency: boolean;
  reporter_id: string;
  reported_id: string;
  description?: string;
  content_id?: string;
  reporter_username?: string;
  reporter_avatar_url?: string;
  reported_username?: string;
  reported_avatar_url?: string;
  avatar_url?: string;
}

export interface DMCAData {
  id: string;
  content_type: string;
  status: string;
  created_at: string;
  reporter_id: string;
  content_id?: string;
  reporter_username?: string;
  reporter_avatar_url?: string;
  avatar_url?: string;
}

export function formatFlaggedContentAsAlert(
  flaggedContent: FlaggedContentData,
  username?: string
): LiveAlert {
  return {
    id: flaggedContent.id,
    type: "flagged_content",
    alert_type: "risk", // Changed from "flagged_content" to "risk"
    user_id: flaggedContent.user_id,
    username: username || "Unknown User",
    avatar_url: flaggedContent.avatar_url || "",
    timestamp: flaggedContent.flagged_at,
    created_at: flaggedContent.flagged_at,
    content_type: flaggedContent.content_type,
    reason: flaggedContent.reason,
    severity: flaggedContent.severity as "high" | "medium" | "low",
    content_id: flaggedContent.content_id,
    message: flaggedContent.reason,
    status: flaggedContent.status,
    title: `${flaggedContent.content_type} Flagged`,
    is_viewed: false,
    urgent: flaggedContent.severity === "high",
  };
}

export function formatReportAsAlert(
  report: ReportData,
  username?: string
): LiveAlert {
  return {
    id: report.id,
    type: "report",
    alert_type: "violation", // Changed from "report" to "violation"
    user_id: report.reported_id,
    username: username || "Unknown User",
    avatar_url: report.avatar_url || "",
    timestamp: report.created_at,
    created_at: report.created_at,
    content_type: report.content_type,
    reason: report.reason,
    severity: report.is_emergency ? "high" : "medium",
    content_id: report.content_id,
    message: report.reason,
    status: report.status,
    title: `Content Report`,
    description: report.description,
    is_viewed: false,
    urgent: report.is_emergency,
  };
}

export function formatDMCAAsAlert(
  dmca: DMCAData,
  username?: string
): LiveAlert {
  return {
    id: dmca.id,
    type: "dmca",
    alert_type: "information", // Changed from "dmca" to "information"
    user_id: dmca.reporter_id,
    username: username || "Unknown User",
    avatar_url: dmca.avatar_url || "",
    timestamp: dmca.created_at,
    created_at: dmca.created_at,
    content_type: dmca.content_type,
    reason: "DMCA Takedown Request",
    severity: "medium",
    content_id: dmca.content_id,
    message: `DMCA Request for ${dmca.content_type}`,
    status: dmca.status,
    title: `DMCA Takedown`,
    is_viewed: false,
    urgent: false,
  };
}
