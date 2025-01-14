import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, Heart } from "lucide-react";
import { TrendingCreator } from "./types";

interface TrendingCreatorCardProps {
  creator: TrendingCreator;
  index: number;
  onMessage: (creatorId: string) => void;
  onFollow: (creatorId: string) => void;
}

export const TrendingCreatorCard = ({ creator, index, onMessage, onFollow }: TrendingCreatorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group">
        <div className="relative h-48 bg-gradient-to-r from-luxury-primary to-luxury-accent">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white">
              <AvatarImage src={creator.creator_avatar} />
              <AvatarFallback>{creator.creator_username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h3 className="font-semibold">{creator.creator_username}</h3>
              <p className="text-sm text-white/80">Rank #{creator.trending_rank}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
              Trending
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {((creator.likes + creator.comments + creator.media_interactions) / 3).toFixed(1)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMessage(creator.creator_id)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onFollow(creator.creator_id)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {creator.likes + creator.comments} interactions
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};