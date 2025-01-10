import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { TrendingTopics } from "./TrendingTopics";
import { SuggestedCreators } from "./SuggestedCreators";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TrendingData {
  trendingTags: {
    tag: string;
    count: number;
    percentageIncrease: number;
  }[];
  posts: any[];
}

interface RightSidebarProps {
  trendingData?: TrendingData;
}

export const RightSidebar = ({ trendingData }: RightSidebarProps) => {
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <SearchBar />
      <div className="space-y-6">
        <SuggestedCreators />
        <TrendingTopics trendingData={trendingData} />
      </div>
    </motion.div>
  );
};