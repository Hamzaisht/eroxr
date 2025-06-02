
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Upload, Radio, Edit, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  username: string;
  subscription_price?: number;
}

interface CreatorDashboardProps {
  profile: ProfileData;
}

interface CreatorStats {
  totalEarnings: number;
  pendingPayouts: number;
  subscriberCount: number;
  monthlyRevenue: number;
}

export const CreatorDashboard = ({ profile }: CreatorDashboardProps) => {
  const [stats, setStats] = useState<CreatorStats>({
    totalEarnings: 0,
    pendingPayouts: 0,
    subscriberCount: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    fetchCreatorStats();
  }, [profile.id]);

  const fetchCreatorStats = async () => {
    try {
      // Get subscriber count
      const { count: subscriberCount } = await supabase
        .from('creator_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', profile.id);

      // Get pending payouts
      const { data: payoutData } = await supabase
        .from('payout_requests')
        .select('amount')
        .eq('creator_id', profile.id)
        .eq('status', 'pending');

      const pendingPayouts = payoutData?.reduce((sum, payout) => sum + Number(payout.amount), 0) || 0;

      // Calculate monthly revenue estimate
      const monthlyRevenue = (subscriberCount || 0) * (profile.subscription_price || 0);

      setStats({
        totalEarnings: 0, // This would come from a proper earnings table
        pendingPayouts,
        subscriberCount: subscriberCount || 0,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching creator stats:', error);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 md:px-8 mt-8"
    >
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 backdrop-blur-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Creator Dashboard
          </h2>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Content
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <Radio className="w-4 h-4 mr-2" />
              Go Live
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">Subscribers</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.subscriberCount}</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Monthly Revenue</span>
            </div>
            <div className="text-2xl font-bold text-white">${stats.monthlyRevenue}</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Pending Payouts</span>
            </div>
            <div className="text-2xl font-bold text-white">${stats.pendingPayouts}</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-white">${stats.totalEarnings}</div>
          </div>
        </div>

        {/* Subscription Pricing Display */}
        {profile.subscription_price && (
          <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-400">Current Subscription Price</span>
                <div className="text-xl font-bold text-white">${profile.subscription_price}/month</div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Update Pricing
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
