
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VideoThumbnail } from "./VideoThumbnail";
import { UserPlus, Video } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { asUUID, extractProfile } from "@/utils/supabase/helpers";

export const PromotedAds = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPromotedAds = async () => {
      try {
        const { data, error } = await supabase
          .from("dating_ads")
          .select(`
            id,
            title,
            description,
            tags,
            avatar_url,
            video_url,
            user_id,
            created_at,
            view_count,
            message_count
          `)
          .eq("is_active", true)
          .eq("country", "sweden")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        setAds(data || []);
      } catch (error: any) {
        console.error("Error fetching promoted ads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotedAds();
  }, []);

  const handleAdClick = (adId: string) => {
    // Here you'd implement logic to track ad clicks
    console.log(`Ad clicked: ${adId}`);
    // Redirect to the ad's detail page
  };

  const handleConnect = (adId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "Connection request sent",
      description: `You've reached out to ${title}`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-64 bg-gray-800/50">
            <div className="h-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No promoted ads found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {ads.map((ad) => (
        <Card 
          key={ad.id}
          className="overflow-hidden cursor-pointer transition-all hover:border-luxury-primary/50 hover:shadow-md"
          onClick={() => handleAdClick(ad.id)}
        >
          <div className="relative aspect-video">
            <VideoThumbnail 
              videoUrl={ad.video_url} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={ad.avatar_url} />
                <AvatarFallback>{ad.title.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-white font-medium text-sm">{ad.title}</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] bg-black/50 text-white border-none px-1.5 h-4">
                    <Video className="w-3 h-3 mr-1" /> {ad.view_count || 0}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="absolute bottom-3 right-3 flex items-center gap-1"
              onClick={(e) => handleConnect(ad.id, ad.title, e)}
            >
              <UserPlus className="h-3 w-3" />
              <span className="text-xs">Connect</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
