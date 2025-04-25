
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, MessageCircle, Video } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import MediaGrid from "./MediaGrid";
import { EmptyState } from "./EmptyState";
import { useParams } from "react-router-dom";
import { VideoProfileCarousel } from "@/components/ads/video-profile-carousel";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { useState, useEffect } from "react";
import { useFeedQuery } from "@/components/feed/useFeedQuery";
import { useSession } from "@supabase/auth-helpers-react";
import { ShortsList } from "./ShortsList";
import { Short } from "@/components/home/types/short";

export const ProfileTabs = ({ profile }: { profile: any }) => {
  const { id } = useParams();
  const session = useSession();
  const canAccessBodyContact = profile?.is_paying_customer || profile?.id_verification_status === 'verified';
  const [bodyContactAds, setBodyContactAds] = useState<any[]>([]);
  const [hasAds, setHasAds] = useState(false);

  const isCurrentUserProfile = session?.user?.id === id;
  
  const { data: profileAds, isLoading: adsLoading } = useAdsQuery({
    userId: id,
    includeMyPendingAds: true,
    skipModeration: true
  });
  
  const { data: videosData, isLoading: videosLoading } = useFeedQuery(id, 'shorts');
  const hasVideos = videosData?.pages?.[0]?.length > 0;
  
  useEffect(() => {
    if (profileAds) {
      setBodyContactAds(profileAds);
      setHasAds(profileAds.length > 0);
      console.log("Profile body contact ads:", profileAds);
    }
  }, [profileAds]);

  // Transform posts data to match the Short format expected by ShortsList
  const transformPostsToShorts = (posts: any[]): Short[] => {
    if (!posts) return [];
    
    return posts.flatMap(page => page).map(post => ({
      id: post.id,
      creator_id: post.creator_id,
      description: post.content,
      url: post.video_urls?.[0] || '',
      thumbnail: post.video_thumbnail_url || post.media_url?.[0] || '',
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      created_at: post.created_at,
      has_liked: post.has_liked,
      has_saved: post.has_saved,
      creator: post.creator,
      video_thumbnail_url: post.video_thumbnail_url,
      view_count: post.view_count,
      video_duration: post.video_duration
    }));
  };

  const tabItems = [
    {
      value: "showcase",
      label: "Showcase",
      icon: CircuitBoard,
      content: <CreatorsFeed feedType="recent" />
    },
    {
      value: "media",
      label: "Media",
      icon: Image,
      content: <MediaGrid media={[]} onMediaClick={() => {}} />
    },
    {
      value: "eros",
      label: "Eros",
      icon: Video,
      content: videosLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
        </div>
      ) : hasVideos ? (
        <ShortsList shorts={transformPostsToShorts(videosData?.pages || [])} />
      ) : (
        <EmptyState 
          icon={Video} 
          message={isCurrentUserProfile 
            ? "You haven't uploaded any videos yet" 
            : "No videos uploaded yet"
          }
          actionLabel={isCurrentUserProfile ? "Upload Video" : undefined}
          actionHref={isCurrentUserProfile ? "/shorts" : undefined}
        />
      )
    },
    {
      value: "subscribers",
      label: "Subscribers",
      icon: Users,
      content: <EmptyState icon={Users} message="No subscribers yet" />
    },
    {
      value: "likes",
      label: "Likes",
      icon: Heart,
      content: <EmptyState icon={Heart} message="No liked content yet" />
    },
    {
      value: "bodycontact",
      label: "Body Contact",
      icon: MessageCircle,
      disabled: !canAccessBodyContact && !hasAds,
      content: !canAccessBodyContact && !hasAds ? (
        <Alert>
          <AlertDescription>
            Body Contact is only available for verified content creators or paying members. 
            {!profile?.is_paying_customer && (
              <span> Subscribe for $4.99/month to access this feature.</span>
            )}
          </AlertDescription>
        </Alert>
      ) : adsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
        </div>
      ) : bodyContactAds && bodyContactAds.length > 0 ? (
        <div className="mt-8">
          <VideoProfileCarousel ads={bodyContactAds} />
        </div>
      ) : (
        <EmptyState icon={MessageCircle} message="No body contact ads yet" />
      )
    }
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="showcase" className="w-full">
        <div className="sticky top-16 z-50 bg-luxury-dark/95 backdrop-blur-lg border-b border-luxury-primary/10">
          <div className="max-w-[1400px] mx-auto px-4">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap rounded-none bg-transparent h-14 sm:h-16 -mb-px">
              {tabItems.map(({ value, label, icon: Icon, disabled }) => (
                <TabsTrigger 
                  key={value}
                  value={value} 
                  disabled={disabled}
                  className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary 
                           px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap
                           hover:bg-luxury-primary/10 transition-all duration-300
                           group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {tabItems.map(({ value, content }) => (
              <TabsContent key={value} value={value} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {content}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
};
