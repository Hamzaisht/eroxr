import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RightSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const RightSidebar = ({ searchQuery, setSearchQuery }: RightSidebarProps) => {
  return (
    <aside className="w-[340px] border-l border-white/10 fixed right-0 top-16 bottom-0">
      <ScrollArea className="h-full py-6">
        <div className="px-6 space-y-6">
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
  );
};