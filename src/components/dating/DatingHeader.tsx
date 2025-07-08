
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Grid, List } from "lucide-react";

interface DatingHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateAd: () => void;
}

export function DatingHeader({ 
  activeTab, 
  onTabChange, 
  viewMode, 
  onViewModeChange,
  onCreateAd 
}: DatingHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          Dating
        </h1>
        
        <Button 
          onClick={onCreateAd}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Ad
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
          <TabsList>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="quick-match">Quick Match</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
