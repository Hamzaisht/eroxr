import { useState, useEffect } from "react";
import { Search, TrendingUp, User, PenSquare, Image, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { StoryReel } from "@/components/StoryReel";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const { toast } = useToast();
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

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* Stories Reel */}
            <StoryReel />

            {session && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-sm sticky top-[4.5rem] z-50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <Link to={`/profile/${session.user.id}`}>
                    <div className="h-10 w-10 rounded-full bg-luxury-primary/20 hover:bg-luxury-primary/30 transition-colors" />
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-luxury-neutral/60 hover:text-luxury-neutral hover:bg-luxury-neutral/5 border-luxury-neutral/10"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    Share something with your followers...
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="relative overflow-hidden hover:bg-luxury-neutral/5 border-luxury-neutral/10"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      {isPayingCustomer ? (
                        <Image className="h-5 w-5 text-luxury-neutral/60" />
                      ) : (
                        <Lock className="h-5 w-5 text-luxury-neutral/60" />
                      )}
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        disabled={!isPayingCustomer}
                      />
                    </Button>
                    {!isPayingCustomer && (
                      <span className="text-sm text-luxury-neutral/60 whitespace-nowrap">
                        Upgrade to upload
                      </span>
                    )}
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
              className="rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-luxury-neutral">
                  <Search className="h-5 w-5" />
                  <h2 className="font-semibold">Discover Creators</h2>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by @username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-luxury-dark/30 border-luxury-neutral/10 text-luxury-neutral placeholder:text-luxury-neutral/40"
                  />
                  <Button size="icon" variant="ghost" className="text-luxury-neutral hover:bg-luxury-neutral/5">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-luxury-neutral">
                  <TrendingUp className="h-5 w-5" />
                  <h2 className="font-semibold">Trending Now</h2>
                </div>
                <div className="space-y-4">
                  {["Photography", "Digital Art", "Music", "Writing"].map((topic) => (
                    <motion.div
                      key={topic}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between rounded-lg bg-luxury-neutral/5 p-3 cursor-pointer hover:bg-luxury-neutral/10 transition-colors"
                    >
                      <span className="font-medium text-luxury-neutral">#{topic}</span>
                      <span className="text-sm text-luxury-neutral/60">2.5K posts</span>
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
    </div>
  );
};

export default Home;