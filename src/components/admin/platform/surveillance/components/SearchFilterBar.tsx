
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, RefreshCw } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
}

export const SearchFilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  onRefresh 
}: SearchFilterBarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by username or ID..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button 
        size="icon" 
        variant="outline" 
        onClick={onRefresh} 
        title="Refresh data"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
