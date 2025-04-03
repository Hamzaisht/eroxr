
import { Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export interface SearchFilter {
  query: string;
  type?: string;
  status?: string;
}

export interface SearchFilterBarProps {
  onSearchChange?: (searchQuery: string) => void;
  onRefresh?: () => void;
  onSearch?: (filters: SearchFilter) => void;
  placeholder?: string;
  availableTypes?: Array<{value: string, label: string}>;
  availableStatuses?: Array<{value: string, label: string}>;
}

export const SearchFilterBar = ({ 
  onSearchChange, 
  onRefresh,
  onSearch,
  placeholder = "Search...",
  availableTypes = [],
  availableStatuses = []
}: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        query: searchQuery,
        type: filterType || undefined,
        status: filterStatus || undefined
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-9 bg-background/50"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      
      {availableTypes.length > 0 && (
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {availableTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {availableStatuses.length > 0 && (
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {availableStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {onSearch && (availableTypes.length > 0 || availableStatuses.length > 0) && (
        <Button 
          variant="secondary" 
          size="icon"
          onClick={handleSearch}
        >
          <Filter className="h-4 w-4" />
        </Button>
      )}
      
      {onRefresh && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRefresh}
          className="bg-white/5"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
