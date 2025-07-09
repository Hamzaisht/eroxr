
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EroboardFiltersProps {
  filters: {
    category: string;
    sortBy: string;
  };
  onFiltersChange: (filters: { category: string; sortBy: string }) => void;
}

export const EroboardFilters = ({ filters, onFiltersChange }: EroboardFiltersProps) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleSortByChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    onFiltersChange({ category: '', sortBy: 'recent' });
  };

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10">
      <CardHeader>
        <CardTitle className="text-white">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-luxury-dark">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="photos">Photos</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Sort By</label>
          <Select value={filters.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="bg-luxury-dark">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};
