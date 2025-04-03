import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
  availableTypes?: Array<{ value: string; label: string }>;
  availableStatuses?: Array<{ value: string; label: string }>;
  onSearch: (filters: SearchFilter) => void;
}

export const SearchFilterBar = ({
  placeholder = "Search by username...",
  availableTypes = [],
  availableStatuses = [],
  onSearch
}: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const applyFilters = () => {
    const filters: SearchFilter = {
      username: searchQuery,
      type: selectedType,
      status: selectedStatus,
      dateRange: dateRange
    };
    onSearch(filters);
    setIsFilterOpen(false);
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setDateRange(undefined);
    
    const emptyFilters: SearchFilter = {};
    onSearch(emptyFilters);
    setIsFilterOpen(false);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              onSearch({});
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {!searchQuery && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>
      
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {isFilterOpen ? (
              <></>
            ) : (
              <Badge
                variant="secondary"
                className="ml-2 rounded-sm px-1.5 py-0.5 text-xs font-medium ring-offset-0"
              >
                {Object.keys({
                  username: searchQuery,
                  type: selectedType,
                  status: selectedStatus,
                  dateRange: dateRange
                }).filter(key => {
                  const keyValue = {
                    username: searchQuery,
                    type: selectedType,
                    status: selectedStatus,
                    dateRange: dateRange
                  }[key as keyof SearchFilter];
                  
                  if (key === 'username' && searchQuery) return true;
                  if (key === 'type' && selectedType !== 'all') return true;
                  if (key === 'status' && selectedStatus !== 'all') return true;
                  if (key === 'dateRange' && dateRange) return true;
                  
                  return false;
                }).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Type</h4>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Status</h4>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Date Range</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "w-full justify-start text-left font-normal" +
                      (dateRange?.from
                        ? " pl-3.5"
                        : " text-muted-foreground")
                    }
                  >
                    {dateRange?.from ? (
                      format(dateRange.from, "MMM d, yyyy") +
                      " - " +
                      format(dateRange.to || dateRange.from, "MMM d, yyyy")
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  side="bottom"
                >
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
