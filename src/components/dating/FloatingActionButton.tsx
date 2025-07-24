import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Crown, Heart, MessageCircle, Search } from "lucide-react";
import { useState } from "react";

interface FloatingActionButtonProps {
  onCreateAd: () => void;
  onQuickMatch?: () => void;
  onMessages?: () => void;
  onSearch?: () => void;
}

export const FloatingActionButton = ({ 
  onCreateAd, 
  onQuickMatch, 
  onMessages, 
  onSearch 
}: FloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { icon: Plus, label: "Create Ad", action: onCreateAd, color: "from-cyan-500 to-purple-600" },
    { icon: Zap, label: "Quick Match", action: onQuickMatch, color: "from-yellow-500 to-orange-600" },
    { icon: MessageCircle, label: "Messages", action: onMessages, color: "from-pink-500 to-red-600" },
    { icon: Search, label: "Search", action: onSearch, color: "from-green-500 to-teal-600" },
  ];

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      {/* Action Buttons */}
      <motion.div
        className="flex flex-col-reverse gap-3 mb-3"
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {actions.slice(1).map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ scale: 0, x: 50 }}
            animate={{
              scale: isExpanded ? 1 : 0,
              x: isExpanded ? 0 : 50,
            }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={action.action}
              className={`
                h-12 w-12 rounded-full glass-panel border-white/20
                bg-gradient-to-r ${action.color} 
                hover:scale-110 transition-all duration-300
                shadow-lg hover:shadow-xl
              `}
              title={action.label}
            >
              <action.icon className="h-5 w-5" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Main FAB */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => {
            if (isExpanded) {
              // If expanded, clicking main button creates ad
              onCreateAd();
            } else {
              // If not expanded, toggle the menu
              setIsExpanded(true);
            }
          }}
          className={`
            h-16 w-16 rounded-full futuristic-container
            bg-gradient-to-r from-cyan-500 to-purple-600
            hover:from-cyan-400 hover:to-purple-500
            shadow-2xl hover:shadow-cyan-500/30
            transition-all duration-300
            relative overflow-hidden
          `}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="h-8 w-8" />
          </motion.div>
          
          {/* Quantum particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </Button>

        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/50 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};