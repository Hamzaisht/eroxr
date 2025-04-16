
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Grid, Columns, Filter, 
  TrendingUp, Clock, Heart, Image as ImageIcon,
  Video, UserPlus, Loader2 
} from "lucide-react";
import { EroboardCard } from "@/components/eroboard/EroboardCard";
import { EroboardFilters } from "@/components/eroboard/EroboardFilters";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MediaItem } from "@/components/eroboard/types";

const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    title: "Summer Beach",
    type: "image",
    url: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    creator: {
      id: "creator-1",
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?u=creator1"
    },
    likeCount: 234,
    commentCount: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "City Timelapse",
    type: "video",
    url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    thumbnail: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    creator: {
      id: "creator-2",
      name: "Jamie Smith",
      avatar: "https://i.pravatar.cc/150?u=creator2"
    },
    likeCount: 456,
    commentCount: 32,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    title: "Mountain Sunset",
    type: "image",
    url: "https://images.unsplash.com/photo-1441057206919-63d19fac2369",
    creator: {
      id: "creator-3",
      name: "Robin Chen",
      avatar: "https://i.pravatar.cc/150?u=creator3"
    },
    likeCount: 789,
    commentCount: 56,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "4",
    title: "Ocean Waves",
    type: "video",
    url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    creator: {
      id: "creator-4",
      name: "Taylor Lee",
      avatar: "https://i.pravatar.cc/150?u=creator4"
    },
    likeCount: 321,
    commentCount: 21,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

const Eroboard = () => {
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [view, setView] = useState<"grid" | "columns">("grid");
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Simulate loading media items
    const timer = setTimeout(() => {
      setMediaItems(mockMediaItems);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const filteredItems = mediaItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-luxury-dark">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-16"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-luxury-neutral">
              Eroboard
            </h1>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "columns" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("columns")}
              >
                <Columns className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-neutral/50" />
                <Input
                  placeholder="Search media, creators, or tags..."
                  className="pl-10 bg-luxury-darker/40 border-luxury-primary/20"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 flex gap-2">
              <Button variant="outline" className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <EroboardFilters />
            </div>
          </div>

          <Tabs
            defaultValue="trending"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-8"
          >
            <TabsList className="mb-6 bg-luxury-darker/40">
              <TabsTrigger value="trending" className="flex gap-2 items-center">
                <TrendingUp className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>Trending</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>Recent</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex gap-2 items-center">
                <Heart className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>Popular</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex gap-2 items-center">
                <ImageIcon className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>Images</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex gap-2 items-center">
                <Video className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="following" className="flex gap-2 items-center">
                <UserPlus className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>Following</span>
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin text-luxury-primary mb-4" />
                  <p className="text-luxury-neutral/70">Loading content...</p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 bg-luxury-darker/40 rounded-lg">
                <div className="text-center">
                  <Search className="h-10 w-10 mx-auto text-luxury-neutral/50 mb-2" />
                  <h3 className="text-xl font-semibold text-luxury-neutral/90 mb-1">No Results Found</h3>
                  <p className="text-luxury-neutral/70">Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              <TabsContent value={activeTab} className="mt-0">
                <div className={`
                  grid gap-6
                  ${view === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1 md:grid-cols-2"
                  }
                `}>
                  {filteredItems.map((item) => (
                    <EroboardCard key={item.id} item={item} view={view} />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Eroboard;
