
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface WatermarkOverlayProps {
  creatorId: string;
  username?: string; // Username is optional
}

export const WatermarkOverlay = ({ creatorId, username: providedUsername }: WatermarkOverlayProps) => {
  const [username, setUsername] = useState<string>(providedUsername || "");
  
  useEffect(() => {
    // If username is already provided, don't fetch it
    if (providedUsername) return;
    
    const fetchUsername = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", creatorId)
          .single();
          
        if (data && !error) {
          setUsername(data.username || "");
        }
      } catch (error) {
        console.error("Error fetching username for watermark:", error);
      }
    };
    
    if (creatorId && !providedUsername) {
      fetchUsername();
    }
  }, [creatorId, providedUsername]);
  
  if (!username) return null;
  
  return (
    <div className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
      @{username}
    </div>
  );
};

export default WatermarkOverlay;
