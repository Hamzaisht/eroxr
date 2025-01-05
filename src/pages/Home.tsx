import { useState } from "react";
import { Search, TrendingUp, User, PenSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const session = useSession();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          {/* Main Feed */}
          <div className="space-y-6">
            {session && (
              <div className="rounded-lg border bg-card p-4 shadow-sm">
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
                </div>
              </div>
            )}
            <CreatorsFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  <h2 className="font-semibold">Search Creators</h2>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by @username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="icon" variant="ghost">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <h2 className="font-semibold">Trending Topics</h2>
                </div>
                <div className="space-y-4">
                  {["Photography", "Digital Art", "Music", "Writing"].map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <span className="font-medium">#{topic}</span>
                      <span className="text-sm text-muted-foreground">2.5K posts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </div>
  );
};

export default Home;