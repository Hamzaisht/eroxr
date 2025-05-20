import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreatorCard } from '@/components/CreatorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    } else {
      loadPopularCreators();
    }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, banner_url, bio, subscriber_count')
        .ilike('username', `%${searchTerm}%`)
        .order('subscriber_count', { ascending: false })
        .limit(resultsPerPage);
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularCreators = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, banner_url, bio, subscriber_count')
        .order('subscriber_count', { ascending: false })
        .limit(resultsPerPage);
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error loading popular creators:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for creators..."
            className="bg-luxury-darker/50 border-luxury-primary/20 pl-10"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          <Button type="submit" className="absolute right-1 top-1">
            Search
          </Button>
        </div>
      </form>
      
      {/* Results */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {searchParams.get('q') ? `Results for "${searchParams.get('q')}"` : 'Popular Creators'}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-luxury-darker/50 h-48 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No results found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((creator) => (
              <CreatorCard
                key={creator.id}
                username={creator.username}
                avatarUrl={creator.avatar_url}
                bannerUrl={creator.banner_url}
                bio={creator.bio}
                subscriberCount={creator.subscriber_count || 0}
                creatorId={creator.id}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {searchResults.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline"
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
            className="mr-2"
          >
            Previous
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
