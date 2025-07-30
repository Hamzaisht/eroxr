import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { EroboardStats } from '@/hooks/useEroboardData';

export interface EroboardPdfData {
  stats: EroboardStats;
  earningsData: Array<{ date: string; amount: number }>;
  revenueBreakdown: {
    subscriptions: number;
    tips: number;
    liveStreamPurchases: number;
    messages: number;
  };
  contentPerformanceData: Array<{ 
    id: string; 
    earnings: number; 
    likes: number; 
    comments: number;
    views: number;
    content: string;
    created_at: string;
    type: string;
  }>;
  geographicData: Array<{ 
    country: string; 
    fans: number; 
    percentage: number; 
    sessions: number;
    pageViews: number;
  }>;
  engagedFansData: Array<{
    user_id: string;
    total_spent: number;
    engagement_score: number;
  }>;
  conversionFunnelData: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  growthAnalyticsData: {
    follower_growth_rate: number;
    subscription_rate: number;
    retention_rate: number;
    churn_rate: number;
  };
  streamingAnalyticsData: {
    totalStreamTime: string;
    averageViewers: number;
    peakViewers: number;
    totalRevenue: number;
  };
  contentAnalyticsData: {
    totalPosts: number;
    totalViews: number;
    avgEngagementRate: number;
  };
}

export interface UserProfile {
  username: string;
  country: string;
  id: string;
}

export class EroboardPdfExporter {
  private pdf: jsPDF;
  private pageHeight: number;
  private currentY: number;
  private margin: number;
  private pageWidth: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.margin = 20;
    this.currentY = this.margin;
  }

  private addNewPageIfNeeded(height: number): void {
    if (this.currentY + height > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addHeader(userProfile: UserProfile): void {
    // Add Eroxr logo/branding
    this.pdf.setFillColor(138, 92, 246); // Purple brand color
    this.pdf.rect(0, 0, this.pageWidth, 25, 'F');
    
    // Eroxr title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('EROXR', this.margin, 15);
    
    // Subtitle
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Creator Analytics Report', this.margin, 22);
    
    // Date and user info
    this.pdf.setTextColor(0, 0, 0);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    this.currentY = 35;
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`Analytics Report for @${userProfile.username}`, this.margin, this.currentY);
    
    this.currentY += 8;
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Generated on: ${dateStr}`, this.margin, this.currentY);
    this.pdf.text(`Location: ${userProfile.country}`, this.pageWidth - this.margin - 40, this.currentY);
    
    this.currentY += 15;
  }

  private addSectionTitle(title: string): void {
    this.addNewPageIfNeeded(15);
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.rect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, 12, 'F');
    
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY + 3);
    this.currentY += 20;
  }

  private addKeyValuePair(key: string, value: string, isHighlight = false): void {
    this.addNewPageIfNeeded(8);
    
    if (isHighlight) {
      this.pdf.setTextColor(138, 92, 246);
      this.pdf.setFont('helvetica', 'bold');
    } else {
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.setFont('helvetica', 'normal');
    }
    
    this.pdf.setFontSize(11);
    this.pdf.text(`${key}:`, this.margin, this.currentY);
    this.pdf.text(value, this.margin + 60, this.currentY);
    this.currentY += 6;
  }

  private addTable(headers: string[], rows: string[][]): void {
    const cellHeight = 8;
    const headerHeight = 10;
    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidth = tableWidth / headers.length;
    
    this.addNewPageIfNeeded(headerHeight + (rows.length * cellHeight) + 10);
    
    // Table header
    this.pdf.setFillColor(138, 92, 246);
    this.pdf.rect(this.margin, this.currentY, tableWidth, headerHeight, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    
    headers.forEach((header, index) => {
      this.pdf.text(header, this.margin + (index * colWidth) + 2, this.currentY + 6);
    });
    
    this.currentY += headerHeight;
    
    // Table rows
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    
    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(this.margin, this.currentY, tableWidth, cellHeight, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        this.pdf.text(cell.toString().substring(0, 25), this.margin + (colIndex * colWidth) + 2, this.currentY + 5);
      });
      
      this.currentY += cellHeight;
    });
    
    this.currentY += 10;
  }

  private addChart(title: string, data: Array<{name: string, value: number}>): void {
    this.addNewPageIfNeeded(60);
    
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 10;
    
    // Simple bar chart representation
    const maxValue = Math.max(...data.map(d => d.value));
    const chartWidth = this.pageWidth - 2 * this.margin - 40;
    const barHeight = 8;
    
    data.forEach((item, index) => {
      const barWidth = (item.value / maxValue) * chartWidth;
      
      // Bar
      this.pdf.setFillColor(138, 92, 246);
      this.pdf.rect(this.margin + 40, this.currentY, barWidth, barHeight, 'F');
      
      // Label
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.setFontSize(9);
      this.pdf.text(item.name.substring(0, 15), this.margin, this.currentY + 5);
      this.pdf.text(item.value.toLocaleString(), this.margin + 40 + barWidth + 5, this.currentY + 5);
      
      this.currentY += barHeight + 3;
    });
    
    this.currentY += 10;
  }

  public async generatePDF(data: EroboardPdfData, userProfile: UserProfile): Promise<Blob> {
    // Header with branding
    this.addHeader(userProfile);
    
    // Executive Summary
    this.addSectionTitle('📊 EXECUTIVE SUMMARY');
    this.addKeyValuePair('Total Earnings', `$${data.stats.totalEarnings.toLocaleString()}`, true);
    this.addKeyValuePair('Total Subscribers', data.stats.totalSubscribers.toLocaleString(), true);
    this.addKeyValuePair('Total Followers', data.stats.followers.toLocaleString(), true);
    this.addKeyValuePair('Engagement Rate', `${data.stats.engagementRate.toFixed(1)}%`, true);
    this.addKeyValuePair('Total Content Posts', data.stats.totalContent.toLocaleString());
    this.addKeyValuePair('Total Views', data.stats.totalViews.toLocaleString());
    this.addKeyValuePair('Revenue Share', `${(data.stats.revenueShare * 100).toFixed(0)}%`);
    this.currentY += 10;
    
    // Revenue Breakdown
    this.addSectionTitle('💰 REVENUE BREAKDOWN');
    this.addKeyValuePair('Subscriptions Revenue', `$${data.revenueBreakdown.subscriptions.toLocaleString()}`);
    this.addKeyValuePair('Tips Revenue', `$${data.revenueBreakdown.tips.toLocaleString()}`);
    this.addKeyValuePair('PPV Messages Revenue', `$${data.revenueBreakdown.messages.toLocaleString()}`);
    this.addKeyValuePair('Live Stream Revenue', `$${data.revenueBreakdown.liveStreamPurchases.toLocaleString()}`);
    
    // Revenue chart
    const revenueChartData = [
      { name: 'Subscriptions', value: data.revenueBreakdown.subscriptions },
      { name: 'Tips', value: data.revenueBreakdown.tips },
      { name: 'PPV Messages', value: data.revenueBreakdown.messages },
      { name: 'Live Streams', value: data.revenueBreakdown.liveStreamPurchases }
    ].filter(item => item.value > 0);
    
    if (revenueChartData.length > 0) {
      this.addChart('Revenue Distribution', revenueChartData);
    }
    
    // Content Performance
    this.addSectionTitle('📈 CONTENT PERFORMANCE');
    this.addKeyValuePair('Total Posts', data.contentAnalyticsData.totalPosts.toLocaleString());
    this.addKeyValuePair('Total Content Views', data.contentAnalyticsData.totalViews.toLocaleString());
    this.addKeyValuePair('Average Engagement Rate', `${data.contentAnalyticsData.avgEngagementRate.toFixed(1)}%`);
    
    // Top performing content table
    if (data.contentPerformanceData.length > 0) {
      this.currentY += 5;
      const topContent = data.contentPerformanceData.slice(0, 10);
      const contentHeaders = ['Content Preview', 'Type', 'Views', 'Likes', 'Earnings'];
      const contentRows = topContent.map(content => [
        content.content.substring(0, 30) + '...',
        content.type.charAt(0).toUpperCase() + content.type.slice(1),
        content.views.toLocaleString(),
        content.likes.toLocaleString(),
        `$${content.earnings.toFixed(2)}`
      ]);
      this.addTable(contentHeaders, contentRows);
    }
    
    // Geographic Analytics
    this.addSectionTitle('🌍 GEOGRAPHIC ANALYTICS');
    if (data.geographicData.length > 0) {
      const geoHeaders = ['Country', 'Fans', 'Percentage', 'Sessions', 'Page Views'];
      const geoRows = data.geographicData.map(geo => [
        geo.country,
        geo.fans.toLocaleString(),
        `${geo.percentage.toFixed(1)}%`,
        geo.sessions.toLocaleString(),
        geo.pageViews.toLocaleString()
      ]);
      this.addTable(geoHeaders, geoRows);
    }
    
    // Growth Analytics
    this.addSectionTitle('📊 GROWTH ANALYTICS');
    this.addKeyValuePair('Follower Growth Rate', `${data.growthAnalyticsData.follower_growth_rate.toFixed(1)}%`);
    this.addKeyValuePair('Subscription Rate', `${data.growthAnalyticsData.subscription_rate.toFixed(1)}%`);
    this.addKeyValuePair('Retention Rate', `${data.growthAnalyticsData.retention_rate.toFixed(1)}%`);
    this.addKeyValuePair('Churn Rate', `${data.growthAnalyticsData.churn_rate.toFixed(1)}%`);
    
    // Conversion Funnel
    this.addSectionTitle('🎯 CONVERSION FUNNEL');
    if (data.conversionFunnelData.length > 0) {
      const funnelHeaders = ['Stage', 'Count', 'Conversion Rate'];
      const funnelRows = data.conversionFunnelData.map(stage => [
        stage.stage,
        stage.count.toLocaleString(),
        `${stage.percentage.toFixed(1)}%`
      ]);
      this.addTable(funnelHeaders, funnelRows);
    }
    
    // Streaming Analytics
    this.addSectionTitle('📺 STREAMING ANALYTICS');
    this.addKeyValuePair('Total Stream Time', data.streamingAnalyticsData.totalStreamTime);
    this.addKeyValuePair('Average Viewers', data.streamingAnalyticsData.averageViewers.toLocaleString());
    this.addKeyValuePair('Peak Viewers', data.streamingAnalyticsData.peakViewers.toLocaleString());
    this.addKeyValuePair('Stream Revenue', `$${data.streamingAnalyticsData.totalRevenue.toLocaleString()}`);
    
    // Earnings Timeline (simplified representation)
    if (data.earningsData.length > 0) {
      this.addSectionTitle('💸 EARNINGS TIMELINE (LAST 30 DAYS)');
      const totalEarningsLast30 = data.earningsData.reduce((sum, day) => sum + day.amount, 0);
      const avgDailyEarnings = totalEarningsLast30 / Math.max(data.earningsData.length, 1);
      const bestDay = data.earningsData.reduce((max, day) => day.amount > max.amount ? day : max, data.earningsData[0]);
      
      this.addKeyValuePair('Total Earnings (30d)', `$${totalEarningsLast30.toLocaleString()}`);
      this.addKeyValuePair('Average Daily Earnings', `$${avgDailyEarnings.toFixed(2)}`);
      this.addKeyValuePair('Best Performing Day', `${bestDay.date} - $${bestDay.amount.toFixed(2)}`);
    }
    
    // Footer
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.setFontSize(8);
    this.pdf.text('Generated by Eroxr Analytics Platform', this.margin, this.pageHeight - 10);
    this.pdf.text(`Report for @${userProfile.username} | ${userProfile.country}`, this.pageWidth - this.margin - 80, this.pageHeight - 10);
    
    return this.pdf.output('blob');
  }
}

export async function checkExportLimit(userId: string): Promise<{canExport: boolean, count: number, limit: number}> {
  try {
    const { data, error } = await supabase.rpc('get_monthly_export_count', { p_user_id: userId });
    
    if (error) {
      console.error('Error checking export limit:', error);
      return { canExport: false, count: 0, limit: 3 };
    }
    
    const count = data || 0;
    return { canExport: count < 3, count, limit: 3 };
  } catch (error) {
    console.error('Error checking export limit:', error);
    return { canExport: false, count: 0, limit: 3 };
  }
}

export async function recordExport(userId: string, fileSize: number, exportData: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('pdf_exports')
      .insert({
        user_id: userId,
        export_type: 'eroboard_analytics',
        file_size: fileSize,
        export_data: exportData
      });
    
    if (error) {
      console.error('Error recording export:', error);
    }
  } catch (error) {
    console.error('Error recording export:', error);
  }
}