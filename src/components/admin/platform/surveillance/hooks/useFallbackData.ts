
import { LiveSession } from "../types";

export function useFallbackData() {
  const generateFallbackData = (): LiveSession[] => {
    console.log("Generating fallback data");
    return [
      {
        id: "fallback-1",
        type: "stream",
        user_id: "system",
        username: "Demo User",
        created_at: new Date().toISOString(),
        title: "Sample Live Stream",
        status: "live",
        media_url: []
      },
      {
        id: "fallback-2",
        type: "chat",
        user_id: "system",
        username: "Chat User",
        created_at: new Date().toISOString(),
        content: "Sample Message",
        status: "active",
        media_url: []
      }
    ];
  };

  return { generateFallbackData };
}
