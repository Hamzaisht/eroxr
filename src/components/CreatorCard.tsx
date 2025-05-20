
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface CreatorCardProps {
  creatorId: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  bannerUrl?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  followerCount?: number;
  subscriberCount?: number;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creatorId,
  username,
  avatarUrl,
  bio,
  bannerUrl,
  isVerified,
  isPremium,
  followerCount,
  subscriberCount
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-24 bg-cover bg-center" 
        style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'linear-gradient(to right, #4a5568, #2d3748)' }}
      />
      <CardHeader className="pt-0 relative">
        <div className="absolute -top-12 left-4 border-4 border-background rounded-full">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || ""} alt={username || "Creator"} />
            <AvatarFallback>{username?.charAt(0).toUpperCase() || "C"}</AvatarFallback>
          </Avatar>
        </div>
        <div className="pt-10">
          <h3 className="text-lg font-bold">{username || "Anonymous Creator"}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{bio || "No bio available"}</p>
          {(subscriberCount !== undefined || followerCount !== undefined) && (
            <p className="text-xs text-muted-foreground mt-1">
              {subscriberCount !== undefined 
                ? `${subscriberCount} subscribers`
                : followerCount !== undefined 
                  ? `${followerCount} followers` 
                  : "0 followers"}
            </p>
          )}
          {isVerified && (
            <span className="inline-flex items-center text-blue-500 text-xs mt-1">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          {isPremium && (
            <span className="inline-flex items-center text-luxury-primary text-xs mt-1 ml-2">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 01-1 1H5a1 1 0 01-1-1V7h12v9z" clipRule="evenodd" />
              </svg>
              Premium
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate(`/creator/${creatorId}`)}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};
