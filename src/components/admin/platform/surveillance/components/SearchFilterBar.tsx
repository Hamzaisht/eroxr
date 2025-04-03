
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, RefreshCw, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the SearchFilter type that will be used across components
export interface SearchFilter {
  username?: string;
  userId?: string;
  type?: string;
  status?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilterBarProps {
  placeholder?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  onSearch?: (filters: SearchFilter) => void;
  availableTypes?: FilterOption[];
  availableStatuses?: FilterOption[];
}

export const SearchFilterBar = ({ 
  placeholder = "Search...",
  onSearchChange,
  onRefresh,
  onSearch,
  availableTypes = [],
  availableStatuses = []
}: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If simple search mode is used
    if (onSearchChange) {
      onSearchChange(value);
    }
    
    // If advanced search mode is used
    if (onSearch) {
      onSearch({
        username: value,
        type: selectedType !== 'all' ? selectedType : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
    }
  };
  
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    if (onSearch) {
      onSearch({
        username: searchQuery || undefined,
        type: type !== 'all' ? type : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
    }
  };
  
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    if (onSearch) {
      onSearch({
        username: searchQuery || undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        status: status !== 'all' ? status : undefined,
      });
    }
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      
      {availableTypes.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Type:</span> {selectedType === 'all' ? 'All' : selectedType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableTypes.map((type) => (
              <DropdownMenuItem 
                key={type.value}
                onClick={() => handleTypeSelect(type.value)}
              >
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {availableStatuses.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span className="hidden sm:inline">Status:</span> {selectedStatus === 'all' ? 'All' : selectedStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableStatuses.map((status) => (
              <DropdownMenuItem 
                key={status.value}
                onClick={() => handleStatusSelect(status.value)}
              >
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <Button 
        size="icon" 
        variant="outline" 
        onClick={handleRefresh} 
        title="Refresh data"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
