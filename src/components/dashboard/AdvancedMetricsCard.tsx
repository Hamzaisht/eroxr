
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Star, RefreshCw, UserMinus, Users } from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedMetricsCardProps {
  totalSubscribers: number;
  newSubscribers: number;
  returningSubscribers: number;
  churnRate: number;
  vipFans: number;
}

export function AdvancedMetricsCard({
  totalSubscribers,
  newSubscribers,
  returningSubscribers,
  churnRate,
  vipFans
}: AdvancedMetricsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 glass-card">
        <h3 className="text-lg font-semibold mb-4">Subscriber Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mr-3">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm text-luxury-muted">New Subscribers</span>
              </div>
            </div>
            <p className="text-2xl font-bold">{newSubscribers}</p>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{Math.round((newSubscribers / (totalSubscribers || 1)) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-500 mr-3">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span className="text-sm text-luxury-muted">Returning Subs</span>
              </div>
            </div>
            <p className="text-2xl font-bold">{returningSubscribers}</p>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>Renewed subscriptions</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 mr-3">
                  <Star className="h-5 w-5" />
                </div>
                <span className="text-sm text-luxury-muted">VIP Fans</span>
              </div>
            </div>
            <p className="text-2xl font-bold">{vipFans}</p>
            <div className="flex items-center text-xs text-amber-500">
              <span>High-value customers</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-luxury-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-luxury-muted">Churn Rate</span>
              <div className="flex items-center mt-1">
                <p className="text-xl font-semibold">{churnRate}%</p>
                <div className={`ml-2 flex items-center text-xs ${churnRate > 10 ? 'text-red-500' : 'text-green-500'}`}>
                  {churnRate > 10 ? (
                    <>
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>High</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 mr-1" />
                      <span>Low</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <UserMinus className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-luxury-muted mt-1">
            {churnRate > 10 
              ? "Consider reaching out to lapsed subscribers with special offers." 
              : "Great job retaining your subscribers!"}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
