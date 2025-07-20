import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Users } from "lucide-react";

export const EarningsCalculator = () => {
  const [followers, setFollowers] = useState(1000);
  const [contentPieces, setContentPieces] = useState(10);
  const [averageTip, setAverageTip] = useState(25);

  // Calculate estimated earnings
  const monthlyEarnings = Math.floor(
    (followers * 0.05) * // 5% conversion rate
    (contentPieces * 0.8) * // Content engagement multiplier
    (averageTip * 1.2) // Platform multiplier
  );

  const yearlyEarnings = monthlyEarnings * 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Earnings Calculator</h3>
          <p className="text-sm text-muted-foreground">See your potential on EROXR</p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Followers: {followers.toLocaleString()}
          </label>
          <input
            type="range"
            min="100"
            max="100000"
            step="100"
            value={followers}
            onChange={(e) => setFollowers(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>100</span>
            <span>100K+</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content pieces per month: {contentPieces}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={contentPieces}
            onChange={(e) => setContentPieces(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1</span>
            <span>50+</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Average tip: ${averageTip}
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={averageTip}
            onChange={(e) => setAverageTip(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$5</span>
            <span>$100+</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Monthly</span>
          </div>
          <div className="text-2xl font-bold text-accent">
            ${monthlyEarnings.toLocaleString()}
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Yearly</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            ${yearlyEarnings.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          <span>Keep 90% of your earnings</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span>Instant payouts available</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
          <span>Built-in promotion tools</span>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Users className="w-4 h-4" />
        Start Earning Today
      </motion.button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        *Estimates based on platform averages. Actual earnings may vary.
      </p>
    </motion.div>
  );
};