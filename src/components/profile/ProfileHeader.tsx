
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Edit, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "./ProfileAvatar";
import { Skeleton } from "@/components/ui/skeleton";

export interface ProfileHeaderProps {
  profile: any;
  isCurrentUser: boolean;
}

export const ProfileHeader = ({ profile, isCurrentUser }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const session = useSession();

  const handleEditProfile = () => {
    navigate("/settings/profile");
  };

  const handleMessage = () => {
    navigate(`/messages?user=${profile?.id}`);
  };

  if (!profile) {
    return (
      <div className="bg-luxury-darker w-full">
        <div className="h-40 md:h-60 bg-luxury-darkest"></div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="absolute -top-16 left-4">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
          <div className="pt-20 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Skeleton className="w-48 h-8 mb-2" />
              <Skeleton className="w-80 h-6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-32 h-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-darker w-full">
      {/* Banner */}
      <div 
        className="h-40 md:h-60 bg-cover bg-center"
        style={{ 
          backgroundImage: profile?.banner_url 
            ? `url(${profile.banner_url})` 
            : "linear-gradient(to right, #8B5CF6, #D946EF)"
        }}
      ></div>
      
      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-4">
          <ProfileAvatar 
            profile={profile}
            getMediaType={(url) => url?.match(/\.(mp4|webm|ogg)$/i) ? 'video' : url?.match(/\.gif$/i) ? 'gif' : 'image'}
            isOwnProfile={isCurrentUser} 
          />
        </div>
        
        <div className="pt-20 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{profile?.username || "User"}</h1>
            <p className="text-luxury-neutral">
              {profile?.bio?.substring(0, 100) || "No bio yet"}
              {profile?.bio?.length > 100 ? "..." : ""}
            </p>
          </div>
          
          <div className="flex gap-2">
            {isCurrentUser ? (
              <Button onClick={handleEditProfile} variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button onClick={handleMessage} className="bg-luxury-primary hover:bg-luxury-primary/90 gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
