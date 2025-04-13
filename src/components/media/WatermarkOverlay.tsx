
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface WatermarkOverlayProps {
  creatorId: string;
}

export const WatermarkOverlay = ({ creatorId }: WatermarkOverlayProps) => {
  const [username, setUsername] = useState<string>("");
  
  useEffect(() => {
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
    
    if (creatorId) {
      fetchUsername();
    }
  }, [creatorId]);
  
  if (!username) return null;
  
  return (
    <div className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
      @{username}
    </div>
  );
};

export default WatermarkOverlay;
