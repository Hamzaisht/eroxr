
import { motion } from "framer-motion";
import { StatCard } from "./sections/StatCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AnimatedStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      // For profiles, we need to get the exact count
      const { count: profilesCount, error: profilesError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      
      // For dating ads, we need to get the exact count
      const { count: datingsCount, error: datingsError } = await supabase
        .from("dating_ads")
        .select("id", { count: "exact", head: true });
      
      const { data: earnings } = await supabase
        .from("top_creators_by_earnings")
        .select("total_earnings")
        .order("total_earnings", { ascending: false })
        .limit(1)
        .single();

      if (profilesError || datingsError) {
        console.error("Error fetching stats:", profilesError || datingsError);
      }

      return {
        creators: profilesCount || 0,
        users: (profilesCount || 0) * 10, // Estimate monthly users as 10x creators
        earnings: earnings?.total_earnings || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            number={isLoading ? "Loading..." : `${stats?.creators}+`}
            label="Active Creators"
            description="Join our growing community of content creators"
          />
          <StatCard
            number={isLoading ? "Loading..." : `${stats?.users}+`}
            label="Monthly Users"
            description="Connect with engaged fans"
          />
          <StatCard
            number={isLoading ? "Loading..." : `$${Math.round(stats?.earnings || 0).toLocaleString()}+`}
            label="Creator Earnings"
            description="Our creators earn through diverse revenue streams"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
