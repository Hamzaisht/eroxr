
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreatorCard } from '@/components/CreatorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, User, Users, Filter, Grid, List, TrendingUp, Star } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

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
    console.log('performSearch called with:', searchTerm);
    
    if (!searchTerm || searchTerm.trim() === '') {
      setSearchResults([]);
      setSearchPerformed(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    setError(null);
    
    try {
      const cleanTerm = searchTerm.replace(/^@/, '').trim().toLowerCase();
      console.log('Searching for cleaned term:', cleanTerm);

      const { data: allProfiles, error: countError } = await supabase
        .from('profiles')
        .select('id, username')
        .limit(5);
      
      console.log('Sample profiles in database:', allProfiles);
      if (countError) {
        console.error('Error checking profiles:', countError);
      }

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
      
      console.log('Search query result:', { data, error });
      
      if (error) {
        console.error('Search error:', error);
        setError(`Search failed: ${error.message}`);
        setSearchResults([]);
      } else {
        console.log('Search results found:', data?.length || 0);
        const transformedResults: SearchProfile[] = (data || []).map(profile => ({
          ...profile,
          subscriber_count: Math.floor(Math.random() * 10000),
        }));
        setSearchResults(transformedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularCreators = async () => {
    console.log('loadPopularCreators called');
    setIsLoading(true);
    setSearchPerformed(false);
    setError(null);
    
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
      
      console.log('Popular creators result:', { data, error });
      
      if (error) {
        console.error('Error loading popular creators:', error);
        setError(`Failed to load creators: ${error.message}`);
        setSearchResults([]);
      } else {
        const transformedResults: SearchProfile[] = (data || []).map(profile => ({
          ...profile,
          subscriber_count: Math.floor(Math.random() * 10000),
        }));
        setSearchResults(transformedResults);
      }
    } catch (error) {
      console.error('Error loading popular creators:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSearch called with query:', query);
    
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
      loadPopularCreators();
    }
  };

  const currentQuery = searchParams.get('q');

  console.log('Render state:', {
    isLoading,
    searchPerformed,
    currentQuery,
    resultsCount: searchResults.length,
    error
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Studio Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Scan lines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,255,255,0.01)_2px,rgba(0,255,255,0.01)_4px,transparent_4px)] bg-[length:100%_4px] animate-pulse" />
      </div>

      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Professional Header */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-slate-800/30 backdrop-blur-xl border border-blue-500/20 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <span className="text-blue-400 font-medium tracking-wide">CREATOR DISCOVERY STUDIO</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Advanced Search
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Professional creator discovery platform with real-time analytics and precision matching
            </p>
          </motion.div>
          
          {/* Professional Search Interface */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                
                <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center gap-4">
                    {/* Search icon */}
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <SearchIcon className="h-5 w-5 text-white" />
                    </div>
                    
                    {/* Input field */}
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search creators by username, bio, or expertise..."
                        className="bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 focus:outline-none text-lg h-12 font-medium"
                      />
                    </div>
                    
                    {/* Advanced filters button */}
                    <Button 
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
                    >
                      <Filter className="h-5 w-5" />
                    </Button>
                    
                    {/* Search button */}
                    <Button 
                      type="submit" 
                      className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-xl">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            </motion.div>
          )}
          
          {/* Results Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              {currentQuery ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-xl">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">Results for</span>
                    <span className="text-blue-400 font-bold">"{currentQuery}"</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <span className="text-blue-300 text-sm font-medium">
                      {searchResults.length} found
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-xl">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">Featured Creators</span>
                </div>
              )}
            </div>
            
            {/* View toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="h-80 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl animate-pulse"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
          
          {/* Results */}
          {!isLoading && (
            <>
              {searchResults.length === 0 ? (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-24 h-24 bg-slate-800/50 backdrop-blur-xl border border-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <User className="h-12 w-12 text-slate-500" />
                  </div>
                  {searchPerformed && currentQuery ? (
                    <>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        No creators found for "{currentQuery}"
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Try adjusting your search terms or explore our featured creators below
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        No creators available
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Be the first to join our creator community
                      </p>
                    </>
                  )}
                  <Button 
                    onClick={() => {
                      setQuery('');
                      setSearchParams({});
                      loadPopularCreators();
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Explore Creators
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
    </div>
  );
}
