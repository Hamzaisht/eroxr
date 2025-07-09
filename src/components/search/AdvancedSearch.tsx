import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Users, Hash, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SearchFilters {
  query: string;
  type: 'all' | 'posts' | 'users' | 'communities';
  dateRange: 'all' | 'today' | 'week' | 'month';
  location?: string;
  tags: string[];
  verified?: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export const AdvancedSearch = ({ onSearch, className }: AdvancedSearchProps) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    dateRange: 'all',
    tags: [],
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Get popular tags for suggestions
  const { data: popularTags = [] } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: async () => {
      const { data: posts } = await supabase
        .from('posts')
        .select('tags')
        .not('tags', 'is', null)
        .limit(100);
      
      if (!posts) return [];
      
      const tagCounts: Record<string, number> = {};
      posts.forEach(post => {
        post.tags?.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      return Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([tag]) => tag);
    },
  });

  // Save search history
  const saveSearchHistory = async (searchFilters: SearchFilters) => {
    if (!user || !searchFilters.query.trim()) return;
    
    try {
      await supabase
        .from('search_history')
        .insert({
          user_id: user.id,
          search_query: searchFilters.query,
          search_type: searchFilters.type,
        });
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const handleSearch = () => {
    onSearch(filters);
    saveSearchHistory(filters);
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          placeholder="Search for content, users, or communities..."
          className="pl-10 pr-12 h-12 text-lg rounded-full border-2 focus:border-primary"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Filters</h4>
                
                {/* Content Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select
                    value={filters.type}
                    onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="posts">Posts</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="communities">Communities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value: any) => setFilters(prev => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addTag(tagInput)}
                    />
                    <Button
                      onClick={() => addTag(tagInput)}
                      size="sm"
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Selected Tags */}
                  {filters.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {filters.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          #{tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Popular Tags */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Popular tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {popularTags.slice(0, 10).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer text-xs"
                          onClick={() => addTag(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={filters.location || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters({
                        query: filters.query,
                        type: 'all',
                        dateRange: 'all',
                        tags: [],
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleSearch();
                      setIsFilterOpen(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            onClick={handleSearch}
            size="sm"
            className="rounded-full px-4"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.type !== 'all' || filters.dateRange !== 'all' || filters.tags.length > 0 || filters.location) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              <Users className="w-3 h-3 mr-1" />
              {filters.type}
            </Badge>
          )}
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              <Calendar className="w-3 h-3 mr-1" />
              {filters.dateRange}
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary">
              <MapPin className="w-3 h-3 mr-1" />
              {filters.location}
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary">
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
};