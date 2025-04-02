
import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchFilter {
  username?: string;
  userId?: string;
  status?: string;
  type?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface SearchFilterBarProps {
  onSearch: (filters: SearchFilter) => void;
  placeholder?: string;
  showTypeFilter?: boolean;
  showStatusFilter?: boolean;
  availableTypes?: { value: string; label: string }[];
  availableStatuses?: { value: string; label: string }[];
}

export function SearchFilterBar({
  onSearch,
  placeholder = "Search by username or ID...",
  showTypeFilter = true,
  showStatusFilter = true,
  availableTypes = [
    { value: "all", label: "All Types" },
    { value: "video", label: "Video" },
    { value: "image", label: "Image" },
    { value: "text", label: "Text" },
    { value: "audio", label: "Audio" }
  ],
  availableStatuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deleted", label: "Deleted" },
    { value: "draft", label: "Draft" },
    { value: "flagged", label: "Flagged" }
  ]
}: SearchFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilter>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine if the search term is a user ID (UUID format) or username
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchTerm);
    
    const updatedFilters = { 
      ...filters,
      ...(isUUID ? { userId: searchTerm } : { username: searchTerm })
    };
    
    onSearch(updatedFilters);
  };

  const updateFilter = (key: string, value: any) => {
    if (value === "all" || value === "") {
      const newFilters = { ...filters };
      delete newFilters[key as keyof SearchFilter];
      setFilters(newFilters);
      
      // Remove from active filters
      setActiveFilters(activeFilters.filter(f => !f.startsWith(key)));
    } else {
      setFilters({ ...filters, [key]: value });
      
      // Add to active filters
      const filterName = key.charAt(0).toUpperCase() + key.slice(1);
      const filterValue = availableTypes.find(t => t.value === value)?.label || 
                         availableStatuses.find(s => s.value === value)?.label ||
                         value;
      
      // Check if this filter type already exists and replace it
      const newActiveFilters = activeFilters.filter(f => !f.startsWith(filterName + ":"));
      newActiveFilters.push(`${filterName}: ${filterValue}`);
      setActiveFilters(newActiveFilters);
    }
  };

  const removeFilter = (filterKey: string) => {
    const key = filterKey.split(":")[0].toLowerCase().trim();
    updateFilter(key, "all");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({});
    setActiveFilters([]);
    onSearch({});
  };

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-9 bg-[#161B22]/80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showTypeFilter && (
          <Select 
            value={filters.type || "all"} 
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-[140px] bg-[#161B22]/80">
              <SelectValue placeholder="Content Type" />
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

        {showStatusFilter && (
          <Select 
            value={filters.status || "all"} 
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-[140px] bg-[#161B22]/80">
              <SelectValue placeholder="Status" />
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="bg-[#161B22]/80">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>
              <div className="grid gap-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium col-span-4">
                    More filters will be added here
                  </p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="submit">Search</Button>
      </form>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="secondary"
              className="flex items-center gap-1 bg-[#161B22]/80"
            >
              {filter}
              <button 
                onClick={() => removeFilter(filter)}
                className="ml-1 rounded-full hover:bg-gray-700 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs h-auto p-0"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
