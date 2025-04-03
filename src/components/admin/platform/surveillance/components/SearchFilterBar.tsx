
import { useState } from "react";
import { Search, Filter, Calendar, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export interface SearchFilterBarProps {
  onSearchChange?: (value: string) => void;
  onFilterChange?: (filters: any) => void;
  onRefresh?: () => void;
  showRefresh?: boolean;
  placeholder?: string;
}

interface Filter {
  type?: string;
  status?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export function SearchFilterBar({
  onSearchChange,
  onFilterChange,
  onRefresh,
  showRefresh = true,
  placeholder = "Search by name, ID or content..."
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter>({});
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleFilterChange = (key: string, value: string | null) => {
    if (!value || value === "all") {
      const newFilters = { ...filters };
      delete newFilters[key as keyof Filter];
      setFilters(newFilters);
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    } else {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    }
  };

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range as { from: Date | undefined; to: Date | undefined });
    setFilters({ ...filters, dateRange: range });
    if (onFilterChange) {
      onFilterChange({ ...filters, dateRange: range });
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRange({ from: undefined, to: undefined });
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={hasActiveFilters ? "text-primary" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Filter surveillance content by type and status
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="type">Content Type</Label>
                  <Select
                    value={filters.type || "all"}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="post">Posts</SelectItem>
                      <SelectItem value="stream">Streams</SelectItem>
                      <SelectItem value="chat">Chats</SelectItem>
                      <SelectItem value="story">Stories</SelectItem>
                      <SelectItem value="dating">Dating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label>Date Range</Label>
                  <div className="grid gap-2">
                    <CalendarComponent
                      mode="range"
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to
                      }}
                      onSelect={(range) => {
                        if (range) {
                          handleDateChange(range);
                        }
                      }}
                      className="border rounded-md p-3"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {showRefresh && onRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="outline" className="flex items-center gap-1">
              Type: {filters.type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("type", null)}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("status", null)}
              />
            </Badge>
          )}
          {filters.dateRange?.from && (
            <Badge variant="outline" className="flex items-center gap-1">
              Date: {filters.dateRange.from.toLocaleDateString()} 
              {filters.dateRange.to && ` - ${filters.dateRange.to.toLocaleDateString()}`}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  handleFilterChange("dateRange", null);
                }}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
