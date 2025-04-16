
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ErosItem, ErosItemData } from "@/components/eros/ErosItem";
import { CommentDialog } from "@/components/eros/CommentDialog";
import { ShareDialog } from "@/components/eros/ShareDialog";

// Mock data for Eros videos
const mockErosData: ErosItemData[] = [
  {
    id: "1",
    title: "Amazing sunset view",
    description: "Caught this beautiful sunset at the beach today! #sunset #beach #summer",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    creator: {
      id: "creator1",
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    likes: 256,
    comments: 14
  },
  {
    id: "2",
    title: "Mountain hiking",
    description: "Reached the summit after 3 hours! The view was totally worth it 🏔️ #hiking #mountains #adventure",
    videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
    creator: {
      id: "creator2",
      name: "Alex Chen",
      username: "alexc",
      avatar: "https://i.pravatar.cc/150?u=alex"
    },
    likes: 458,
    comments: 32
  },
  {
    id: "3",
    title: "City lights",
    description: "Night drive through the city. Love these vibes 🌃 #citylife #nightdrive #lights",
    videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720p_10s.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
    creator: {
      id: "creator3",
      name: "Jordan Taylor",
      username: "jordant",
      avatar: "https://i.pravatar.cc/150?u=jordan"
    },
    likes: 723,
    comments: 45
  }
];

export default function Eros() {
  const [erosItems, setErosItems] = useState<ErosItemData[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load Eros videos (in a real app, this would be an API call)
  useEffect(() => {
    const fetchErosItems = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setErosItems(mockErosData);
      } catch (error) {
        console.error("Error fetching Eros data:", error);
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchErosItems();
  }, [toast]);

  // Handle scroll to update current item index
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      const itemHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentItemIndex && newIndex >= 0 && newIndex < erosItems.length) {
        setCurrentItemIndex(newIndex);
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentItemIndex, erosItems.length]);

  const handleLike = (id: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like videos"
      });
      return;
    }
    
    // In a real app, this would be an API call to toggle like
    console.log("Liking item:", id);
    
    setErosItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              hasLiked: !item.hasLiked,
              likes: item.hasLiked ? item.likes - 1 : item.likes + 1
            } 
          : item
      )
    );
  };

  const handleComment = (id: string) => {
    setSelectedItemId(id);
    setCommentDialogOpen(true);
  };

  const handleShare = (id: string) => {
    setSelectedItemId(id);
    setShareDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-luxury-darker">
        <Loader2 className="h-10 w-10 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <div className="bg-luxury-darker min-h-screen">
      {/* Eros Feed */}
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory"
      >
        {erosItems.map((item, index) => (
          <ErosItem
            key={item.id}
            item={item}
            isActive={index === currentItemIndex}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))}
        
        {erosItems.length === 0 && !loading && (
          <div className="flex items-center justify-center h-screen">
            <p className="text-luxury-neutral">No content available</p>
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        erosId={selectedItemId || ""}
      />
      
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        erosId={selectedItemId || ""}
      />
    </div>
  );
}
