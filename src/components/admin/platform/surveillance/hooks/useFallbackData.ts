
import { LiveSession } from "@/types/surveillance";

export function useFallbackData() {
  const generateFallbackData = (): LiveSession[] => {
    console.log("Generating fallback data");
    const now = new Date().toISOString();
    
    return [
      {
        id: "fallback-1",
        type: "stream",
        user_id: "system",
        username: "Demo User",
        created_at: now,
        started_at: now,
        title: "Sample Live Stream",
        status: "live",
        is_active: true,
        media_url: []
      },
      {
        id: "fallback-2",
        type: "chat",
        user_id: "system",
        username: "Chat User",
        created_at: now,
        started_at: now,
        content: "Sample Message",
        status: "active",
        is_active: true,
        media_url: []
      }
    ];
  };

  return { generateFallbackData };
}
