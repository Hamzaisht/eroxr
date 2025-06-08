
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreatorCard } from '@/components/CreatorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, User, Users } from 'lucide-react';

interface SearchProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  subscriber_count: number;
  is_verified: boolean;
  created_at: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<SearchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
    if (!searchTerm || searchTerm.trim() === '') {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      // Clean the search term - remove @ if present and trim
      const cleanTerm = searchTerm.replace(/^@/, '').trim().toLowerCase();
      
      console.log('Searching for:', cleanTerm);

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          username, 
          avatar_url, 
          banner_url, 
          bio, 
          is_verified,
          created_at
        `)
        .or(`username.ilike.%${cleanTerm}%,bio.ilike.%${cleanTerm}%`)
        .not('username', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        console.log('Search results:', data);
        // Transform the data to match our interface
        const transformedResults: SearchProfile[] = (data || []).map(profile => ({
          ...profile,
          subscriber_count: Math.floor(Math.random() * 10000), // Mock subscriber count for now
        }));
        setSearchResults(transformedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularCreators = async () => {
    setIsLoading(true);
    setSearchPerformed(false);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          username, 
          avatar_url, 
          banner_url, 
          bio, 
          is_verified,
          created_at
        `)
        .not('username', 'is', null)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error('Error loading popular creators:', error);
        setSearchResults([]);
      } else {
        const transformedResults: SearchProfile[] = (data || []).map(profile => ({
          ...profile,
          subscriber_count: Math.floor(Math.random() * 10000), // Mock subscriber count for now
        }));
        setSearchResults(transformedResults);
      }
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
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
      loadPopularCreators();
    }
  };

  const currentQuery = searchParams.get('q');

  return (
    <div className="min-h-screen bg-luxury-darker pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent mb-2">
            Search Creators
          </h1>
          <p className="text-luxury-muted">
            Find amazing creators by username
          </p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by @username..."
              className="bg-luxury-card border-luxury-primary/20 pl-10 pr-20 h-12 text-white placeholder:text-luxury-muted"
            />
            <SearchIcon className="absolute left-3 top-3 h-6 w-6 text-luxury-primary" />
            <Button 
              type="submit" 
              className="absolute right-1 top-1 h-10 bg-luxury-primary hover:bg-luxury-primary/90"
            >
              Search
            </Button>
          </div>
        </form>
        
        {/* Results Header */}
        <div className="flex items-center gap-2 mb-6">
          {currentQuery ? (
            <>
              <User className="h-5 w-5 text-luxury-primary" />
              <h2 className="text-xl font-semibold text-white">
                Results for "@{currentQuery}"
              </h2>
              <span className="text-luxury-muted">
                ({searchResults.length} found)
              </span>
            </>
          ) : (
            <>
              <Users className="h-5 w-5 text-luxury-primary" />
              <h2 className="text-xl font-semibold text-white">
                Popular Creators
              </h2>
            </>
          )}
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-luxury-card h-64 rounded-xl animate-pulse border border-luxury-primary/10"></div>
            ))}
          </div>
        )}
        
        {/* Results */}
        {!isLoading && (
          <>
            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-luxury-card rounded-full flex items-center justify-center mx-auto mb-4 border border-luxury-primary/20">
                  <User className="h-8 w-8 text-luxury-muted" />
                </div>
                {searchPerformed && currentQuery ? (
                  <>
                    <h3 className="text-lg font-medium text-white mb-2">
                      No creators found for "@{currentQuery}"
                    </h3>
                    <p className="text-luxury-muted mb-4">
                      Try searching with a different username
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-white mb-2">
                      No creators found
                    </h3>
                    <p className="text-luxury-muted mb-4">
                      Be the first to create content!
                    </p>
                  </>
                )}
                <Button 
                  onClick={() => {
                    setQuery('');
                    setSearchParams({});
                    loadPopularCreators();
                  }}
                  variant="outline"
                  className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {searchResults.map((creator, index) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CreatorCard
                      creatorId={creator.id}
                      username={creator.username || 'Unknown'}
                      avatarUrl={creator.avatar_url}
                      bannerUrl={creator.banner_url}
                      bio={creator.bio}
                      subscriberCount={creator.subscriber_count}
                      isVerified={creator.is_verified}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
