
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SearchFilterBar } from "./SearchFilterBar";
import { SearchFilter } from "./SearchFilterBar";

interface SessionHeaderProps {
  onRefresh: () => void;
  onSearch: (filters: SearchFilter) => void;
}

export const SessionHeader = ({ onRefresh, onSearch }: SessionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Live Sessions</h2>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-9"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        <SearchFilterBar 
          onSearch={onSearch} 
          onRefresh={onRefresh}
          placeholder="Search sessions..."
        />
      </div>
    </div>
  );
};
