import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ProfileTabs } from "./ProfileTabs";
import { FollowButton } from "./FollowButton";

interface ProfileContainerProps {
  userId: string;
}

export function ProfileContainer({ userId }: ProfileContainerProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        setProfile(profileData);

        // Fetch post count
        const { count: posts, error: postsError } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("creator_id", userId);

        if (postsError) {
          console.error("Error fetching post count:", postsError);
        } else {
          setPostCount(posts || 0);
        }

        // Fetch follower count
        const { count: followers, error: followersError } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        if (followersError) {
          console.error("Error fetching follower count:", followersError);
        } else {
          setFollowerCount(followers || 0);
        }

        // Fetch following count
        const { count: followings, error: followingsError } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId);

        if (followingsError) {
          console.error("Error fetching following count:", followingsError);
        } else {
          setFollowingCount(followings || 0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!session?.user?.id || !profile?.id) return;

      const { data, error } = await supabase
        .from("followers")
        .select("*")
        .eq("follower_id", session.user.id)
        .eq("following_id", profile.id)
        .single();

      if (error) {
        console.error("Error checking follow status:", error);
        return;
      }

      setIsFollowing(!!data);
    };

    checkFollowingStatus();
  }, [session?.user?.id, profile?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8">
        <p className="text-lg text-muted-foreground">
          User profile not found.
        </p>
        <Button onClick={() => router.push("/")}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url} alt={profile.username} />
          <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{profile.username}</h2>
          <p className="text-muted-foreground">{profile.bio || "No bio available"}</p>
        </div>
      </div>
      {session?.user?.id !== profile.id && (
        <FollowButton
          isFollowing={isFollowing}
          followerId={session?.user?.id || ""}
          followingId={profile.id}
          onFollowStatusChange={setIsFollowing}
        />
      )}
      <ProfileTabs 
        userId={profile?.id || ''} 
        postCount={postCount} 
        followerCount={followerCount} 
        followingCount={followingCount} 
      />
    </div>
  );
}
