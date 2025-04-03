
import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SearchFilter {
  username?: string;
  userId?: string;
  type?: string;
  status?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface SearchFilterBarProps {
  placeholder?: string;
  availableTypes?: { value: string; label: string }[];
  availableStatuses?: { value: string; label: string }[];
  onSearch?: (filters: SearchFilter) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => Promise<void>;
}

export const SearchFilterBar = ({
  placeholder = "Search...",
  availableTypes = [],
  availableStatuses = [],
  onSearch,
  searchQuery,
  onSearchChange,
  onRefresh
}: SearchFilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        username: username.trim() || undefined,
        userId: userId.trim() || undefined,
        type: type !== "all" ? type : undefined,
        status: status !== "all" ? status : undefined
      });
    }
  };
  
  const handleClearFilters = () => {
    setUsername("");
    setUserId("");
    setType("all");
    setStatus("all");
    
    if (onSearch) {
      onSearch({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    } else {
      // If using the filter-based approach
      const value = e.target.value;
      setUsername(value);
      if (!showFilters && onSearch) {
        onSearch({ username: value || undefined });
      }
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-9 pr-4"
            value={searchQuery !== undefined ? searchQuery : username}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          className={showFilters ? "bg-gray-700" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-md bg-gray-900/50">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Username</label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Filter by username" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-500">User ID</label>
            <Input 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Filter by ID" 
            />
          </div>
          
          {availableTypes.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((typeOption) => (
                    <SelectItem key={typeOption.value} value={typeOption.value}>
                      {typeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {availableStatuses.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((statusOption) => (
                    <SelectItem key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-end gap-2 col-span-1 md:col-span-4">
            <Button variant="default" onClick={handleSearch}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
