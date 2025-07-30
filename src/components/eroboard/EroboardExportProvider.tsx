import React, { createContext, useContext } from 'react';
import { EroboardPdfData } from '@/utils/eroboardPdfExporter';

interface EroboardExportContextType {
  exportData: EroboardPdfData;
}

const EroboardExportContext = createContext<EroboardExportContextType | null>(null);

interface EroboardExportProviderProps {
  children: React.ReactNode;
  data: {
    stats: any;
    revenueBreakdown: any;
    earningsData: any[];
    contentPerformanceData: any[];
    geographicData: any[];
    engagedFansData: any[];
    conversionFunnelData: any[];
    growthAnalyticsData: any;
    streamingAnalyticsData: any;
    contentAnalyticsData: any;
  };
}

export const EroboardExportProvider: React.FC<EroboardExportProviderProps> = ({ 
  children, 
  data 
}) => {
  const exportData: EroboardPdfData = {
    stats: data.stats || {
      totalEarnings: 0,
      earningsPercentile: null,
      totalSubscribers: 0,
      newSubscribers: 0,
      returningSubscribers: 0,
      churnRate: 0,
      vipFans: 0,
      followers: 0,
      totalContent: 0,
      totalViews: 0,
      engagementRate: 0,
      timeOnPlatform: 0,
      revenueShare: 0.92
    },
    revenueBreakdown: data.revenueBreakdown || {
      subscriptions: 0,
      tips: 0,
      liveStreamPurchases: 0,
      messages: 0
    },
    earningsData: data.earningsData || [],
    contentPerformanceData: data.contentPerformanceData || [],
    geographicData: data.geographicData || [],
    engagedFansData: data.engagedFansData || [],
    conversionFunnelData: data.conversionFunnelData || [],
    growthAnalyticsData: data.growthAnalyticsData || {
      follower_growth_rate: 0,
      subscription_rate: 0,
      retention_rate: 0,
      churn_rate: 0
    },
    streamingAnalyticsData: data.streamingAnalyticsData || {
      totalStreamTime: '0h 0m',
      averageViewers: 0,
      peakViewers: 0,
      totalRevenue: 0
    },
    contentAnalyticsData: data.contentAnalyticsData || {
      totalPosts: 0,
      totalViews: 0,
      avgEngagementRate: 0
    }
  };

  return (
    <EroboardExportContext.Provider value={{ exportData }}>
      {children}
    </EroboardExportContext.Provider>
  );
};

export const useEroboardExport = (): EroboardExportContextType => {
  const context = useContext(EroboardExportContext);
  if (!context) {
    throw new Error('useEroboardExport must be used within an EroboardExportProvider');
  }
  return context;
};