
// Update the CreatorCard component to fix the property names
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CreatorCardProps {
  creatorId: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  bannerUrl?: string;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creatorId,
  username,
  avatarUrl,
  bio,
  bannerUrl
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
