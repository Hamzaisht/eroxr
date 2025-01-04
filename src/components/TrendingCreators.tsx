import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Heart } from "lucide-react";

const trendingCreators = [
  {
    name: "Sarah Anderson",
    handle: "@sarahart",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    category: "Digital Art",
    supporters: "12.5K",
    rating: 4.9,
    description: "Creating unique digital art and tutorials",
  },
  {
    name: "Mike Rivers",
    handle: "@mikemusic",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    category: "Music",
    supporters: "8.2K",
    rating: 4.8,
    description: "Sharing my musical journey and exclusive tracks",
  },
  {
    name: "Elena Smith",
    handle: "@elenafit",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    category: "Fitness",
    supporters: "15.1K",
    rating: 4.9,
    description: "Premium fitness content and personalized coaching",
  },
];

export const TrendingCreators = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Creators</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCreators.map((creator) => (
            <Card key={creator.handle} className="overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <h3 className="font-semibold">{creator.name}</h3>
                    <p className="text-sm text-white/80">{creator.handle}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{creator.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {creator.rating}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{creator.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {creator.supporters} supporters
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};