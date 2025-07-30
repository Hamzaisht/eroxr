
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { BackButton } from "@/components/ui/back-button";
import { useUserRole } from "@/hooks/useUserRole";
import { useEroboardData } from "@/hooks/useEroboardData";
import { EarningsOverview } from "@/components/eroboard/analytics/EarningsOverview";
import { StreamingAnalytics } from "@/components/eroboard/analytics/StreamingAnalytics";
import { ContentAnalytics } from "@/components/eroboard/analytics/ContentAnalytics";
import { AudienceAnalytics } from "@/components/eroboard/analytics/AudienceAnalytics";
import { GrowthAnalytics } from "@/components/eroboard/analytics/GrowthAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { geoTracker } from "@/utils/geoTracker";
import { LoadingOverlay } from "@/components/eroboard/LoadingOverlay";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown,
  Zap,
  Download,
  FileText,
  Lightbulb,
  Database,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const Eroboard = () => {
  console.log('🔍 Eroboard component starting render');
  
  // STEP 3: Add useEroboardData back - final step
  const [activeTab, setActiveTab] = useState("overview");
  const { session, user: authUser } = useAuth();
  const { toast } = useToast();
  const { role, isLoading, isSuperAdmin, isAdmin, isPremiumUser } = useUserRole();
  const {
    loading,
    error,
    stats,
    revenueBreakdown,
    earningsData,
    creatorRankings,
    engagementData,
    contentTypeData,
    contentPerformanceData,
    latestPayout,
    geographicData,
    engagedFansData,
    conversionFunnelData,
    growthAnalyticsData,
    streamingAnalyticsData,
    contentAnalyticsData,
    fetchDashboardData
  } = useEroboardData();
  
  console.log('✅ All hooks working - now showing full EroBoard interface');
  console.log('🔍 EroBoard Debug Info:', {
    loading,
    error,
    session: !!session,
    sessionUser: session?.user?.id,
    stats,
    hasStats: !!stats,
    totalEarnings: stats?.totalEarnings
  });

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background md:ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Analytics</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background md:ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please log in to view your analytics dashboard</p>
            <Button onClick={() => window.location.href = '/auth'}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <InteractiveNav />
      <div className="hidden md:block md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-background md:ml-20 p-4 md:p-8 safe-area-pt">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with Gradient and Interactive Elements */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 relative gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl opacity-50" />
              <div className="relative">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  EroBoard Analytics
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 text-sm md:text-base">
                  <span>Comprehensive insights into your content performance</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                </p>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-3 self-start md:self-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Badge variant="outline" className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 text-xs md:text-sm">
                <Crown className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" />
                <span className="font-medium">Creator Dashboard</span>
              </Badge>
            </motion.div>
          </motion.div>

          {/* Enhanced Tab Navigation with Hover Effects */}
          <div className="flex overflow-x-auto space-x-1 mb-6 md:mb-8 bg-muted/50 backdrop-blur-sm p-1.5 rounded-xl w-full md:w-fit border border-border/50 shadow-lg scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'audience', label: 'Audience', icon: Users },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'growth', label: 'Growth', icon: TrendingUp },
              { id: 'streaming', label: 'Streaming', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-md ring-2 ring-primary/20 transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50 hover:shadow-sm hover:scale-102'
                }`}
              >
                <tab.icon className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'group-hover:text-primary group-hover:scale-110'
                }`} />
                <span className="relative hidden sm:inline">
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </span>
                <span className="sm:hidden relative text-xs">
                  {tab.label.slice(0, 3)}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicatorMobile"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </span>
                {/* Subtle glow effect for active tab */}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-primary/5 rounded-lg animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Enhanced Tab Content with Motion */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <EarningsOverview 
                    data={{
                      stats,
                      revenueBreakdown,
                      earningsData
                    }}
                    isLoading={loading}
                  />
                </motion.div>
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <StreamingAnalytics 
                      data={{
                        stats,
                        earningsData,
                        engagementData,
                        streamingAnalyticsData
                      }}
                      isLoading={loading}
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ContentAnalytics 
                      data={{
                        stats,
                        contentAnalyticsData,
                        contentPerformanceData,
                        contentTypeData
                      }}
                      isLoading={loading}
                    />
                  </motion.div>
                </motion.div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <EarningsOverview 
                  data={{
                    stats,
                    revenueBreakdown,
                    earningsData
                  }}
                  isLoading={loading}
                />
              </motion.div>
            )}

            {activeTab === 'audience' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AudienceAnalytics 
                  data={{
                    stats,
                    geographicData,
                    engagedFansData,
                    conversionFunnelData,
                    growthAnalyticsData
                  }}
                  isLoading={loading}
                />
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ContentAnalytics 
                  data={{
                    stats,
                    contentAnalyticsData,
                    contentPerformanceData,
                    contentTypeData
                  }}
                  isLoading={loading}
                />
              </motion.div>
            )}

            {activeTab === 'growth' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GrowthAnalytics 
                  data={{
                    stats,
                    growthAnalyticsData,
                    geographicData
                  }}
                  isLoading={loading}
                />
              </motion.div>
            )}

            {activeTab === 'streaming' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StreamingAnalytics 
                  data={{
                    stats,
                    earningsData,
                    engagementData,
                    streamingAnalyticsData
                  }}
                  isLoading={loading}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Eroboard;
