
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useGhostSurveillance = () => {
  const [surveillanceData, setSurveillanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const startSurveillance = async (userId: string) => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    
    try {
      // Record a new surveillance session
      const { error } = await supabase
        .from("ghost_surveillance_sessions")
        .insert({
          admin_id: session.user.id,
          target_user_id: userId,
          status: "active"
        });

      if (error) {
        console.error("Error starting surveillance:", error);
      } else {
        // Fetch initial data
        const { data: userData, error: fetchError } = await supabase
          .from("surveillance_data")
          .select("*")
          .eq("user_id", userId)
          .order("timestamp", { ascending: false })
          .limit(20);

        if (fetchError) {
          console.error("Error fetching surveillance data:", fetchError);
        } else {
          setSurveillanceData(userData || []);
        }
      }
    } catch (err) {
      console.error("Failed in surveillance operation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSurveillance = async (sessionId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from("ghost_surveillance_sessions")
        .update({ status: "ended", end_time: new Date() })
        .eq("id", sessionId);

      if (error) {
        console.error("Error stopping surveillance:", error);
      } else {
        setSurveillanceData([]);
      }
    } catch (err) {
      console.error("Failed to stop surveillance:", err);
    }
  };

  return {
    surveillanceData,
    isLoading,
    startSurveillance,
    stopSurveillance
  };
};
