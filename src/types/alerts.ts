
export interface LiveAlert {
  id: string;
  type: "violation" | "risk" | "information";
  user_id: string;
  username: string;
  avatar_url: string | null;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason: string;
  severity: "high" | "medium" | "low";
  content_id: string;
  title: string;
  message?: string;
  status?: string;
  description: string;
  is_viewed: boolean;
  alert_type?: string;
  session_id?: string;
  session?: any;
}
