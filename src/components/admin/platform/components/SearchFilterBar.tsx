
import { useState } from "react";
import { Search, Filter, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface SearchFilterBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  availableTypes?: { value: string; label: string }[];
  availableStatuses?: { value: string; label: string }[];
  className?: string;
  onRefresh?: () => void;
  onSearchChange?: (value: string) => void;
}

export function SearchFilterBar({
  placeholder = "Search...",
  onSearch,
  onSearchChange,
  availableTypes,
  availableStatuses,
  className,
  onRefresh
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // If controlled input
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  const clearFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={handleSearchSubmit} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>
        <Button type="submit" variant="default" size="default" className="shrink-0">
          Search
        </Button>
        
        {(availableTypes || availableStatuses) && (
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 relative">
                <Filter className="h-4 w-4" />
                {(selectedType || selectedStatus || dateRange.from) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Options</h4>
                
                {availableTypes && (
                  <div className="space-y-2">
                    <Label htmlFor="type-filter">Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="type-filter">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {availableTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {availableStatuses && (
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-statuses">All Statuses</SelectItem>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Date Range</span>
                    {(dateRange.from || dateRange.to) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </Label>
                  <div className="rounded-md border p-2">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange as any}
                      numberOfMonths={1}
                    />
                  </div>
                  {dateRange.from && (
                    <div className="text-sm text-gray-500 italic">
                      {dateRange.from && format(dateRange.from, 'PPP')}
                      {dateRange.to && ' to '}
                      {dateRange.to && format(dateRange.to, 'PPP')}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Apply filters and close popover
                      setIsFiltersOpen(false);
                      
                      if (onSearch) {
                        // This would ideally call with filter objects
                        onSearch(searchQuery);
                      }
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="shrink-0"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
