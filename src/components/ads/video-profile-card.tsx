
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Eye } from 'lucide-react';

interface DatingAd {
  id: string;
  title: string;
  description: string;
  tags: string[];
  avatarUrl: string;
  videoUrl: string;
  username: string;
  isVerified: boolean;
  isPremium: boolean;
  location: string;
  age: number;
  views: number;
  view_count?: number; // Add view_count property
}

interface VideoProfileCardProps {
  ad: DatingAd;
  onCardClick?: (adId: string) => void;
}

export const VideoProfileCard: React.FC<VideoProfileCardProps> = ({ 
  ad, 
  onCardClick 
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(ad.id);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <div className="aspect-video relative overflow-hidden">
          {ad.videoUrl ? (
            <video 
              src={ad.videoUrl} 
              className="w-full h-full object-cover"
              autoPlay={false}
              muted
              loop
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <p className="text-gray-500">No video available</p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={ad.avatarUrl || ""} alt={ad.username} />
                  <AvatarFallback>{ad.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{ad.username}</p>
                  {ad.isVerified && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400 text-xs">Verified</span>
                    </div>
                  )}
                </div>
              </div>
              {ad.isPremium && (
                <Badge variant="secondary" className="bg-luxury-primary text-white">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{ad.title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3" />
          <span>{ad.location}</span>
          <span className="mx-1">•</span>
          <span>{ad.age} y/o</span>
          <span className="mx-1">•</span>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{ad.view_count || ad.views || 0} views</span>
          </div>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{ad.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {ad.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {ad.tags && ad.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{ad.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
};
