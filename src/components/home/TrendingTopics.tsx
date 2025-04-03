
import { motion } from "framer-motion";
import { TrendingUp, MoreHorizontal, Video, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrendingTopics, TrendingData } from "@/hooks/useTrendingTopics";

interface TrendingTopicsProps {
  trendingData?: TrendingData;
}

export const TrendingTopics = ({ trendingData: propsTrendingData }: TrendingTopicsProps) => {
  const navigate = useNavigate();
  
  // Use the hook only if no data was provided via props
  const { data: fetchedTrendingData, isLoading } = useTrendingTopics();
  
  // Use provided data or fetched data
  const trendingData = propsTrendingData || fetchedTrendingData;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-luxury-neutral flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-luxury-primary" />
          Trending
        </h2>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={`loading-topic-${i}`} className="p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-5 w-10" />
              </div>
            </div>
          ))}
        </div>
      ) : trendingData?.trendingTags && trendingData.trendingTags.length > 0 ? (
        <div className="space-y-3">
          {trendingData.trendingTags.map((topic, index) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-3 rounded-lg hover:bg-luxury-neutral/5 transition-all cursor-pointer"
              onClick={() => navigate(`/tag/${topic.tag.replace('#', '')}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-luxury-neutral group-hover:text-luxury-primary transition-colors">
                    {topic.tag}
                  </h3>
                  <p className="text-sm text-luxury-neutral/60">{topic.count} posts</p>
                </div>
                <span className="text-green-400 text-sm font-medium">+{topic.percentageIncrease}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-luxury-neutral/50">
          <p>No trending topics available</p>
        </div>
      )}

      <div className="pt-4 space-y-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-luxury-neutral/80 hover:text-luxury-primary"
          onClick={() => navigate('/eros')}
        >
          <Video className="h-4 w-4" />
          Trending Eros
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-luxury-neutral/80 hover:text-luxury-primary"
          onClick={() => navigate('/live')}
        >
          <Radio className="h-4 w-4" />
          Live Streams
        </Button>
      </div>
    </div>
  );
};
