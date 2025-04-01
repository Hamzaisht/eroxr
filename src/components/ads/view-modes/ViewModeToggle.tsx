
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const ViewModeToggle = ({ viewMode, setViewMode }: ViewModeToggleProps) => {
  return (
    <TooltipProvider>
      <div className="flex bg-luxury-dark/30 rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-1"
            >
              <Grid className="h-4 w-4" />
              Grid
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Grid view with video previews</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Detailed list view</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
