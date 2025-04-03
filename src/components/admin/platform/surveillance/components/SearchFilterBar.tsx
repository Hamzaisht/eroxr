
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface SearchFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  placeholder?: string;
  onSearch?: (filters: SearchFilter) => void;
  availableTypes?: FilterOption[];
  availableStatuses?: FilterOption[];
}

export function SearchFilterBar({ 
  searchQuery = "", 
  onSearchChange, 
  onRefresh,
  placeholder = "Search...",
  onSearch,
  availableTypes = [],
  availableStatuses = []
}: SearchFilterBarProps) {
  const [filters, setFilters] = useState<SearchFilter>({});
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        ...filters,
        username: searchTerm,
        type: selectedType,
        status: selectedStatus
      });
    } else if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    if (onSearch) {
      onSearch({
        ...filters,
        username: searchTerm,
        type: value,
        status: selectedStatus
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    if (onSearch) {
      onSearch({
        ...filters,
        username: searchTerm,
        type: selectedType,
        status: value
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      
      {availableTypes.length > 0 && (
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {availableStatuses.length > 0 && (
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
        
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
