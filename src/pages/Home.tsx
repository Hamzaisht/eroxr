import { useState, useEffect } from "react";
import { Search, ImagePlus, Video, Sparkles, MoreVertical, Radio } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@supabase/auth-helpers-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { StoryReel } from "@/components/StoryReel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPayingCustomerStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paying_customer')
        .eq('id', session.user.id)
        .single();
      
      if (!error && data) {
        setIsPayingCustomer(data.is_paying_customer);
      }
    };

    checkPayingCustomerStatus();
  }, [session?.user?.id]);

  const handleFileSelect = (files: FileList | null) => {
    if (!isPayingCustomer && files) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    setSelectedFiles(files);
    setIsCreatePostOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoLive = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start streaming",
        variant: "destructive",
      });
      return;
    }

    if (!isPayingCustomer) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can go live",
        variant: "destructive",
      });
      return;
    }

    setIsGoLiveOpen(true);
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* Stories Reel */}
            <StoryReel />

            {session && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-lg backdrop-blur-lg"
              >
                <div className="flex items-center gap-4">
                  <Link to={`/profile/${session.user.id}`}>
                    <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
                      <AvatarImage src={session.user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-luxury-primary/20">
                        {session.user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Input
                    placeholder="Share something with your followers..."
                    className="flex-1 bg-luxury-dark/30 border-luxury-neutral/10 text-luxury-neutral placeholder:text-luxury-neutral/40"
                    onClick={() => setIsCreatePostOpen(true)}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/10"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <ImagePlus className="h-5 w-5" />
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        disabled={!isPayingCustomer}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/10"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-luxury-neutral/60 hover:text-luxury-primary hover:bg-luxury-primary/10"
                      onClick={handleGoLive}
                    >
                      <Radio className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feed */}
            <CreatorsFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-lg backdrop-blur-lg sticky top-24"
            >
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-luxury-dark/30 border-luxury-neutral/10"
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-luxury-neutral">Suggestions</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-luxury-neutral/60 hover:text-luxury-primary"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex items-center gap-3 rounded-lg p-2 hover:bg-luxury-neutral/5 transition-all cursor-pointer"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-luxury-primary/20">
                        <AvatarImage src={`https://source.unsplash.com/random/100x100?portrait=${i}`} />
                        <AvatarFallback className="bg-luxury-primary/20">U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-luxury-neutral truncate">Creator Name</p>
                          <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                            New
                          </Badge>
                        </div>
                        <p className="text-sm text-luxury-neutral/60 truncate">Professional Model</p>
                      </div>
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
                        onClick={() => {
                          toast({
                            title: "Following",
                            description: "You are now following this creator",
                          });
                        }}
                      >
                        Follow
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />

      <Dialog open={isGoLiveOpen} onOpenChange={setIsGoLiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Go Live</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Stream Title"
              className="bg-luxury-dark/30 border-luxury-neutral/10"
            />
            <Button 
              className="w-full bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Live streaming feature will be available soon!",
                });
                setIsGoLiveOpen(false);
              }}
            >
              Start Streaming
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;