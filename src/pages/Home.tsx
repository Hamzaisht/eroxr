import { useState } from "react";
import { Search, TrendingUp, User, PenSquare, Image, Lock, Home as HomeIcon, Bell, MessageSquare, Bookmark, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { TempDemoContent } from "@/components/TempDemoContent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

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
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-[240px,1fr,340px]">
        {/* Left Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-60 bg-card border-r p-6 space-y-6">
          <div className="flex items-center gap-2 mb-8">
            <img src="/eroxr-logo.svg" alt="EROXR" className="w-8 h-8" />
            <span className="font-semibold text-lg">EROXR</span>
          </div>
          
          <nav className="space-y-2">
            {[
              { icon: <HomeIcon className="w-5 h-5" />, label: "Home", path: "/home" },
              { icon: <Bell className="w-5 h-5" />, label: "Notifications", path: "/notifications" },
              { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", path: "/messages" },
              { icon: <Bookmark className="w-5 h-5" />, label: "Saved", path: "/saved" },
              { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {session && (
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <Link to={`/profile/${session.user.id}`} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex flex-col">
                  <span className="font-medium">Your Profile</span>
                  <span className="text-sm text-muted-foreground">View profile</span>
                </div>
              </Link>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="min-h-screen col-start-2 border-x">
          <div className="max-w-[600px] mx-auto py-8 px-4">
            {session && (
              <div className="rounded-lg border bg-card p-4 shadow-sm sticky top-4 z-50 mb-6">
                <div className="flex items-center gap-4">
                  <Link to={`/profile/${session.user.id}`}>
                    <div className="h-10 w-10 rounded-full bg-muted" />
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    What's on your mind?
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="relative overflow-hidden hover:bg-accent"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      {isPayingCustomer ? (
                        <Image className="h-5 w-5" />
                      ) : (
                        <Lock className="h-5 w-5" />
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
                  </div>
                </div>
              </div>
            )}
            <CreatorsFeed />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="fixed right-0 top-0 w-[340px] h-screen p-6 space-y-6 bg-card border-l">
          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creators..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Trending Topics */}
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </h2>
              <div className="space-y-3">
                {["Photography", "Digital Art", "Music", "Writing"].map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="font-medium">#{topic}</span>
                    <span className="text-sm text-muted-foreground">2.5K posts</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Suggested Creators */}
            <div className="space-y-4">
              <h2 className="font-semibold">Suggested Creators</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <p className="font-medium">Creator Name</p>
                      <p className="text-sm text-muted-foreground">1.2K followers</p>
                    </div>
                    <Button variant="outline" size="sm">Follow</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
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