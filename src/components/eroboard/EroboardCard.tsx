
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Share, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface EroboardCardProps {
  post: {
    id: string;
    title: string;
    description: string;
    creator: string;
    views: number;
    likes: number;
    createdAt: Date;
    thumbnail: string;
  };
}

export const EroboardCard = ({ post }: EroboardCardProps) => {
  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10 overflow-hidden hover:border-luxury-primary/20 transition-colors">
      <div className="aspect-video bg-luxury-dark relative">
        {post.thumbnail ? (
          <img 
            src={post.thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No thumbnail</span>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-luxury-primary">
          Premium
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {post.creator[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{post.title}</h3>
            <p className="text-sm text-gray-400">by {post.creator}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes.toLocaleString()}
            </div>
          </div>
          <span>{post.createdAt.toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-luxury-primary hover:bg-luxury-primary/90">
            View
          </Button>
          <Button size="sm" variant="outline">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
