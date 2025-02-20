
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Radio } from "lucide-react";

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;  // Updated type
  onOpenGoLive: () => void;
}

export const FeedTabs = ({
  activeTab,
  onTabChange,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: FeedTabsProps) => {
  return (
    <div className="flex items-center justify-between">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="feed">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*,video/*';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) {
                onFileSelect(target.files);
              }
            };
            input.click();
          }}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenCreatePost}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenGoLive}>
          <Radio className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
