import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TrendingCreatorCard } from "./trending/TrendingCreatorCard";
import { useTrendingCreators } from "./trending/useTrendingCreators";
import { useTrendingActionHandlers } from "./trending/TrendingActionHandlers";
import { useNavigate } from "react-router-dom";

export const TrendingCreators = () => {
  const navigate = useNavigate();
  const { data: trendingCreators, isLoading } = useTrendingCreators();
  const { handleMessage, handleFollow } = useTrendingActionHandlers();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Creators</h2>
          <Button variant="outline" onClick={() => navigate('/trending')}>View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCreators?.map((creator, index) => (
            <TrendingCreatorCard
              key={creator.creator_id}
              creator={creator}
              index={index}
              onMessage={handleMessage}
              onFollow={handleFollow}
            />
          ))}
        </div>
      </div>
    </section>
  );
};