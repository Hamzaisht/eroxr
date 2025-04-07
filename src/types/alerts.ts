
import { LiveSession } from "@/components/admin/platform/surveillance/types";

export interface LiveAlert {
  id: string;
  type: string;
  alert_type: "violation" | "risk" | "information";
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  timestamp: string;
  created_at: string;
  title: string;
  description: string;
  content_type: string;
  content_id: string;
  reason: string;
  severity: string;
  message: string;
  status: string;
  is_viewed: boolean;
  urgent: boolean;
  reporter?: {
    id: string;
    username?: string;
    avatar_url?: string | null;
  };
  session?: LiveSession;
}
