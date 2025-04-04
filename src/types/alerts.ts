
import { LiveSession } from "@/components/admin/platform/surveillance/types";

export interface LiveAlert {
  id: string;
  type: string;
  alert_type: "violation" | "risk" | "information";
  user_id: string;
  username: string;
  avatar_url?: string;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: "high" | "medium" | "low";
  content_id: string;
  message: string;
  status: string;
  title: string;
  description?: string;
  is_viewed: boolean;
  urgent?: boolean;
  session?: LiveSession;
}
