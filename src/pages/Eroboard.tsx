
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
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
  const session = useSession();
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

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-background md:ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">EroBoard Analytics</h1>
              <p className="text-muted-foreground">Comprehensive insights into your content performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Creator Dashboard
              </Badge>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <EarningsOverview 
                data={{
                  stats,
                  revenueBreakdown,
                  earningsData
                }}
                isLoading={loading}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StreamingAnalytics 
                  data={{
                    stats,
                    earningsData,
                    engagementData,
                    streamingAnalyticsData
                  }}
                  isLoading={loading}
                />
                <ContentAnalytics 
                  data={{
                    stats,
                    contentAnalyticsData,
                    contentPerformanceData,
                    contentTypeData
                  }}
                  isLoading={loading}
                />
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <EarningsOverview 
              data={{
                stats,
                revenueBreakdown,
                earningsData
              }}
              isLoading={loading}
            />
          )}

          {activeTab === 'audience' && (
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
          )}

          {activeTab === 'content' && (
            <ContentAnalytics 
              data={{
                stats,
                contentAnalyticsData,
                contentPerformanceData,
                contentTypeData
              }}
              isLoading={loading}
            />
          )}

          {activeTab === 'growth' && (
            <GrowthAnalytics 
              data={{
                stats,
                growthAnalyticsData,
                geographicData
              }}
              isLoading={loading}
            />
          )}

          {activeTab === 'streaming' && (
            <StreamingAnalytics 
              data={{
                stats,
                earningsData,
                engagementData,
                streamingAnalyticsData
              }}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Eroboard;
