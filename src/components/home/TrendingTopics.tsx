import { motion } from "framer-motion";
import { TrendingUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const trendingTopics = [
  {
    tag: "#Photography",
    posts: "12.5K posts",
    trend: "+25%"
  },
  {
    tag: "#DigitalArt",
    posts: "8.2K posts",
    trend: "+18%"
  },
  {
    tag: "#CreativeMinds",
    posts: "6.7K posts",
    trend: "+15%"
  }
];

export const TrendingTopics = () => {
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

      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-3 rounded-lg hover:bg-luxury-neutral/5 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-luxury-neutral group-hover:text-luxury-primary transition-colors">
                  {topic.tag}
                </h3>
                <p className="text-sm text-luxury-neutral/60">{topic.posts}</p>
              </div>
              <span className="text-green-400 text-sm font-medium">{topic.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};