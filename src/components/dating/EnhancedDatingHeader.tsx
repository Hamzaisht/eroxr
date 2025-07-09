import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Grid, List, Zap, Crown, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface EnhancedDatingHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateAd: () => void;
  onToggleFilters: () => void;
}

export function EnhancedDatingHeader({ 
  activeTab, 
  onTabChange, 
  viewMode, 
  onViewModeChange,
  onCreateAd,
  onToggleFilters
}: EnhancedDatingHeaderProps) {
  const [searchVisible, setSearchVisible] = useState(false);

  const tabs = [
    { value: "browse", label: "Discover", icon: Search },
    { value: "trending", label: "Olympus", icon: Zap },
    { value: "popular", label: "Elite", icon: Crown },
    { value: "quick-match", label: "Fates", icon: Zap },
    { value: "favorites", label: "Beloved", icon: Crown },
    { value: "nearby", label: "Local", icon: Search },
  ];

  return (
    <div className="relative">
      {/* Neural Network Background */}
      <div className="absolute inset-0 neural-bg opacity-20 pointer-events-none" />
      
      {/* Glass Container */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 mb-8 relative overflow-hidden"
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
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

        <div className="flex flex-col space-y-6 relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold holographic-text">
                ⚡ Eros Nexus
              </h1>
              <p className="text-sm text-white/60 mt-1">
                Where gods and mortals meet
              </p>
            </motion.div>
            
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchVisible(!searchVisible)}
                  className="glass-panel border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>

              {/* Filter Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleFilters}
                  className="glass-panel border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </motion.div>

              {/* Create Ad Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="energy-pulse"
              >
                <Button 
                  onClick={onCreateAd}
                  className="futuristic-container bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ascend to Olympus
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: searchVisible ? "auto" : 0, 
              opacity: searchVisible ? 1 : 0 
            }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-4 rounded-xl">
              <input
                type="text"
                placeholder="Search divine profiles..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/50"
              />
            </div>
          </motion.div>

          {/* Tabs and View Controls */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
                <TabsList className="glass-panel h-12 p-1 rounded-xl">
                  {tabs.map((tab, index) => (
                    <motion.div
                      key={tab.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <TabsTrigger 
                        value={tab.value}
                        className="relative px-4 py-2 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white hover:bg-white/10"
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.label}
                        {activeTab === tab.value && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-lg -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </Tabs>
            </motion.div>

            {/* View Mode Controls */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('grid')}
                  className={`glass-panel transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 border-cyan-400/50' 
                      : 'border-white/20 hover:border-cyan-400/40'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className={`glass-panel transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 border-cyan-400/50' 
                      : 'border-white/20 hover:border-cyan-400/40'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Quantum Border Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border border-gradient-to-r from-cyan-400/20 via-purple-500/20 to-cyan-400/20 rounded-2xl" />
        </div>
      </motion.div>
    </div>
  );
}