import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, Grid3X3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedDatingHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateAd: () => void;
  onToggleFilters: () => void;
  onSearch?: (query: string) => void;
}

export function EnhancedDatingHeader({ 
  activeTab, 
  onTabChange, 
  viewMode, 
  onViewModeChange,
  onCreateAd,
  onToggleFilters,
  onSearch
}: EnhancedDatingHeaderProps) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="relative">
      {/* Neural Network Background */}
      <div className="absolute inset-0 neural-bg opacity-20 pointer-events-none" />
      
      {/* Glass Container - Mobile Optimized */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          glass-panel rounded-2xl relative overflow-hidden
          ${isMobile ? "p-4 mb-4" : "p-6 mb-8"}
        `}
      >
        {/* Floating Particles - Reduced for mobile */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(isMobile ? 3 : 6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className={`flex flex-col relative z-10 ${
          isMobile ? "space-y-3" : "space-y-6"
        }`}>
          {/* Header Row - Mobile Optimized */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className={`font-bold holographic-text ${
                isMobile 
                  ? "text-2xl leading-tight" 
                  : "text-4xl"
              }`}>
                ⚡ Eros Nexus
              </h1>
              <p className={`text-white/60 mt-1 ${
                isMobile 
                  ? "text-xs" 
                  : "text-sm"
              }`}>
                Where gods and mortals meet
              </p>
            </motion.div>
            
            <div className={`flex items-center ${
              isMobile ? "gap-2" : "gap-3"
            }`}>
              {/* Search Toggle - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setSearchVisible(!searchVisible)}
                  className="touch-target text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Toggle search"
                >
                  {searchVisible ? (
                    <X className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
                  ) : (
                    <Search className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
                  )}
                </Button>
              </motion.div>

              {/* View Mode Toggle - Hidden on Mobile, Show in Tablet+ */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center bg-white/5 rounded-lg p-1"
                >
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange('grid')}
                    className="text-white/70 hover:text-white px-3"
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange('list')}
                    className="text-white/70 hover:text-white px-3"
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              
              {/* Filter Toggle - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  onClick={onToggleFilters}
                  className="touch-target border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200"
                  aria-label="Toggle filters"
                >
                  <Filter className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} ${isMobile ? "mr-1" : "mr-2"}`} />
                  {isMobile ? "Filters" : "Divine Filters"}
                </Button>
              </motion.div>

              {/* Create Ad Button - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={onCreateAd}
                  size={isMobile ? "sm" : "default"}
                  className="touch-target bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 action-button-glow"
                  aria-label="Create new ad"
                >
                  <Plus className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} ${isMobile ? "mr-1" : "mr-2"}`} />
                  {isMobile ? "Create" : "Create Ad"}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Search Bar - Mobile Optimized */}
          {searchVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Search divine connections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 
                      ${isMobile ? "py-3 text-base" : "py-4"} 
                      bg-white/10 border-white/20 text-white placeholder-white/50 
                      focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl 
                      transition-all duration-200 backdrop-blur-sm
                      mobile-input
                    `}
                    autoComplete="off"
                  />
                </div>
              </form>
            </motion.div>
          )}

          {/* Navigation Tabs - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between"
          >
            <div className={`flex items-center ${
              isMobile 
                ? "space-x-1 overflow-x-auto hide-scrollbar" 
                : "space-x-4"
            } w-full`}>
              {[
                { id: 'browse', label: isMobile ? 'Browse' : 'Browse Profiles', icon: '👥' },
                { id: 'online', label: 'Online', icon: '🟢' },
                { id: 'nearby', label: 'Nearby', icon: '📍' },
                { id: 'quick-match', label: isMobile ? 'Match' : 'Quick Match', icon: '⚡' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    ${isMobile ? "touch-target px-3 py-2 text-sm whitespace-nowrap flex-shrink-0" : "px-6 py-3"} 
                    rounded-full transition-all duration-300 font-medium 
                    ${activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quantum Border Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border border-gradient-to-r from-cyan-400/20 via-purple-500/20 to-cyan-400/20 rounded-2xl" />
        </div>
      </motion.div>
    </div>
  );
}