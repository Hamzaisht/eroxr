import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const { toast } = useToast();

  return (
    <Card className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-2xl">
            {profile.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{profile.username}</h1>
            {profile.location && (
              <p className="text-muted-foreground">{profile.location}</p>
            )}
          </div>
          {!isOwnProfile && (
            <div className="flex gap-4">
              <Button 
                variant="default" 
                className="gap-2"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
              >
                <Users className="h-4 w-4" />
                Follow
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};