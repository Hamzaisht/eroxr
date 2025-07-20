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
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-md border-b border-primary/20">
      <div className="overflow-hidden py-2">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: "-100%" }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...currentItems, ...currentItems].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <div className={`w-2 h-2 rounded-full ${
                item.type === "earning" ? "bg-accent" : 
                item.type === "join" ? "bg-primary" : "bg-secondary"
              }`} />
              <span className="text-foreground/90">{item.text}</span>
              {item.amount && (
                <span className="text-accent font-bold">{item.amount}</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};