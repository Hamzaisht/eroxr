import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Search, TrendingUp, User, PenSquare, Image, Lock, Home as HomeIcon, Bell, MessageSquare, Bookmark, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Link } from "react-router-dom";
import { TempDemoContent } from "@/components/TempDemoContent";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  if (!session) {
    return <TempDemoContent />;
  }

  return (
    <div className="flex min-h-screen bg-luxury-dark">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/10 fixed left-0 top-16 bottom-0">
        <ScrollArea className="h-full py-6">
          <div className="px-6 space-y-6">
            <nav className="space-y-1">
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
              <h3 className="font-medium text-sm text-white/60">Trending Topics</h3>
              <div className="space-y-2">
                {["#Photography", "#DigitalArt", "#Music", "#Writing"].map((topic) => (
                  <Button
                    key={topic}
                    variant="ghost"
                    className="w-full justify-start text-white/80 hover:bg-white/5"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            {session && (
              <div className="pt-4">
                <Link 
                  to={`/profile/${session.user.id}`} 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex flex-col">
                    <span className="font-medium text-white">Your Profile</span>
                    <span className="text-sm text-white/60">View profile</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 border-x border-white/10">
        <div className="max-w-[600px] mx-auto py-8 px-4">
          <div className="rounded-lg border border-white/10 bg-luxury-dark/50 p-4 shadow-sm sticky top-20 z-50 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Link to={`/profile/${session.user.id}`}>
                <div className="h-10 w-10 rounded-full bg-white/10" />
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start text-white/60 border-white/10 hover:bg-white/5"
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
                  className="relative overflow-hidden hover:bg-white/5 border-white/10"
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
          <CreatorsFeed />
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[340px] border-l border-white/10 fixed right-0 top-16 bottom-0">
        <ScrollArea className="h-full py-6">
          <div className="px-6 space-y-6">
            {/* Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search creators..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Suggested Creators */}
            <div className="space-y-4">
              <h2 className="font-semibold text-white">Suggested Creators</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1">
                      <p className="font-medium text-white">Creator Name</p>
                      <p className="text-sm text-white/60">1.2K followers</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="font-semibold text-white">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white">
                        <span className="font-medium">Creator Name</span>
                        {' '}posted a new photo
                      </p>
                      <p className="text-xs text-white/60">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

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