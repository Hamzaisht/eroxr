import { motion } from 'framer-motion';

interface LuxuryTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const LuxuryTabs = ({ tabs, activeTab, onTabChange, className = "" }: LuxuryTabsProps) => {
  return (
    <div className={`p-2 ${className}`}>
      <div className="relative bg-gradient-to-r from-black/40 via-slate-900/60 to-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-2xl shadow-black/50">
        {/* Luxury background pattern */}
        <div 
          className="absolute inset-0 opacity-10 rounded-3xl"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #8b5cf6 2px, transparent 2px),
                             radial-gradient(circle at 80% 50%, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative flex gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium
                  transition-all duration-500 overflow-hidden group min-w-[140px]
                  ${isActive 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/90'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-purple-500/30 to-cyan-500/20 border border-purple-400/30 rounded-2xl shadow-lg shadow-purple-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Hover shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5" />}
                  <span className="hidden sm:inline font-medium">{tab.label}</span>
                </div>
                
                {/* Glow effect for active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl rounded-2xl -z-10" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};