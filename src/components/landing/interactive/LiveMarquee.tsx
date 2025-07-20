import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MarqueeItem {
  id: string;
  text: string;
  type: "earning" | "join" | "activity";
  amount?: string;
  creator?: string;
}

const liveUpdates: MarqueeItem[] = [
  { id: "1", text: "Sarah just earned $2,847 this month", type: "earning", amount: "$2,847", creator: "Sarah" },
  { id: "2", text: "127 new creators joined today", type: "join" },
  { id: "3", text: "Live: 5,234 fans online now", type: "activity" },
  { id: "4", text: "Maya received a $500 tip", type: "earning", amount: "$500", creator: "Maya" },
  { id: "5", text: "Crystal went live 2 minutes ago", type: "activity", creator: "Crystal" },
  { id: "6", text: "Weekly earnings: $127,000 distributed", type: "earning", amount: "$127,000" },
  { id: "7", text: "Jake uploaded new exclusive content", type: "activity", creator: "Jake" },
  { id: "8", text: "89 creators hit monthly goals", type: "earning" },
];

export const LiveMarquee = () => {
  const [currentItems, setCurrentItems] = useState(liveUpdates);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const randomUpdate: MarqueeItem = {
        id: Date.now().toString(),
        text: getRandomUpdate(),
        type: Math.random() > 0.5 ? "earning" : "activity",
      };
      
      setCurrentItems(prev => [randomUpdate, ...prev.slice(0, 7)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getRandomUpdate = () => {
    const updates = [
      `${getRandomName()} just earned $${Math.floor(Math.random() * 5000 + 500)}`,
      `${Math.floor(Math.random() * 200 + 50)} new fans joined in the last hour`,
      `${getRandomName()} received a $${Math.floor(Math.random() * 1000 + 100)} tip`,
      `Live: ${Math.floor(Math.random() * 1000 + 4000)} fans online now`,
      `${getRandomName()} went live ${Math.floor(Math.random() * 30 + 1)} minutes ago`,
    ];
    return updates[Math.floor(Math.random() * updates.length)];
  };

  const getRandomName = () => {
    const names = ["Alex", "Jordan", "Casey", "Taylor", "Morgan", "Riley", "Quinn", "Sage"];
    return names[Math.floor(Math.random() * names.length)];
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 overflow-hidden">
      {/* Cinematic background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-primary/5 to-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl" />
      
      {/* Animated scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Main marquee content */}
      <div className="relative h-full flex items-center overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: "-100%" }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...currentItems, ...currentItems, ...currentItems].map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className={`w-2 h-2 rounded-full ${
                  item.type === "earning" ? "bg-accent" : 
                  item.type === "join" ? "bg-primary" : "bg-secondary"
                }`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-foreground/90 font-medium tracking-wide">
                {item.text}
              </span>
              {item.amount && (
                <motion.span 
                  className="text-accent font-bold bg-accent/10 px-2 py-1 rounded-full text-xs"
                  animate={{ boxShadow: ["0 0 0px hsl(var(--accent))", "0 0 10px hsl(var(--accent)/0.3)", "0 0 0px hsl(var(--accent))"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {item.amount}
                </motion.span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom border with glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
};