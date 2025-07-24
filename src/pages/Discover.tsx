import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Discover() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Discover</h1>
          
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search creators, content, or topics..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-card-foreground">Trending Now</h3>
              </div>
              <p className="text-muted-foreground">Discover what's popular on the platform right now.</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-4">Featured Creators</h3>
              <p className="text-muted-foreground">Find and connect with top creators in your interests.</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-4">New Content</h3>
              <p className="text-muted-foreground">Explore the latest posts and updates from creators.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}