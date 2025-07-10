import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EroboardStats } from '@/hooks/useEroboardData';

export interface ReportData {
  stats: EroboardStats;
  earningsData: Array<{ date: string; amount: number }>;
  geographicData: Array<{ country: string; fans: number; percentage: number }>;
  contentPerformanceData: Array<{ 
    id: number; 
    earnings: number; 
    likes: number; 
    comments: number; 
    views: number; 
    engagement: number; 
    type: string; 
    created_at: string;
  }>;
  reportType: string;
  dateRange: string;
}

export class PDFReportGenerator {
  private pdf: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private margin: number;

  constructor() {
    this.pdf = new jsPDF();
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.currentY = 20;
    this.margin = 20;
  }

  async generateReport(data: ReportData): Promise<void> {
    this.addHeader(data);
    this.addExecutiveSummary(data);
    
    if (data.reportType === 'comprehensive' || data.reportType === 'earnings') {
      this.addEarningsSection(data);
    }
    
    if (data.reportType === 'comprehensive' || data.reportType === 'audience') {
      this.addAudienceSection(data);
    }
    
    if (data.reportType === 'comprehensive' || data.reportType === 'content') {
      this.addContentSection(data);
    }
    
    this.addFooter();
  }

  private addHeader(data: ReportData): void {
    // Title
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(139, 92, 246); // luxury-primary color
    this.pdf.text('EroBoard Analytics Report', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Subtitle
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(`${this.formatReportType(data.reportType)} • ${data.dateRange}`, this.margin, this.currentY);
    
    this.currentY += 10;
    
    // Date generated
    this.pdf.setFontSize(10);
    this.pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margin, this.currentY);
    
    this.currentY += 20;
    this.addSeparator();
  }

  private addExecutiveSummary(data: ReportData): void {
    this.checkPageBreak(60);
    
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Executive Summary', this.margin, this.currentY);
    this.currentY += 15;
    
    this.pdf.setFontSize(12);
    
    // Key metrics in a grid
    const metrics = [
      { label: 'Total Earnings', value: `$${data.stats.totalEarnings.toLocaleString()}` },
      { label: 'Total Subscribers', value: data.stats.totalSubscribers.toLocaleString() },
      { label: 'Engagement Rate', value: `${data.stats.engagementRate.toFixed(1)}%` },
      { label: 'Content Posts', value: data.stats.totalContent.toString() }
    ];
    
    const cols = 2;
    const rowHeight = 20;
    
    metrics.forEach((metric, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = this.margin + (col * 80);
      const y = this.currentY + (row * rowHeight);
      
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text(metric.label, x, y);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.setFont(undefined, 'bold');
      this.pdf.text(metric.value, x, y + 8);
      this.pdf.setFont(undefined, 'normal');
    });
    
    this.currentY += 50;
    this.addSeparator();
  }

  private addEarningsSection(data: ReportData): void {
    this.checkPageBreak(80);
    
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Revenue Analysis', this.margin, this.currentY);
    this.currentY += 15;
    
    // Total earnings
    this.pdf.setFontSize(12);
    this.pdf.text(`Total Revenue: $${data.stats.totalEarnings.toLocaleString()}`, this.margin, this.currentY);
    this.currentY += 10;
    
    // Revenue per subscriber
    const revenuePerSub = data.stats.totalSubscribers > 0 
      ? (data.stats.totalEarnings / data.stats.totalSubscribers).toFixed(2)
      : '0.00';
    this.pdf.text(`Revenue per Subscriber: $${revenuePerSub}`, this.margin, this.currentY);
    this.currentY += 10;
    
    // Growth trend
    const totalEarnings = data.earningsData.reduce((sum, item) => sum + item.amount, 0);
    this.pdf.text(`Total Period Earnings: $${totalEarnings.toFixed(2)}`, this.margin, this.currentY);
    this.currentY += 20;
    
    this.addSeparator();
  }

  private addAudienceSection(data: ReportData): void {
    this.checkPageBreak(100);
    
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Audience Insights', this.margin, this.currentY);
    this.currentY += 15;
    
    // Subscriber metrics
    this.pdf.setFontSize(12);
    this.pdf.text(`Total Followers: ${data.stats.followers.toLocaleString()}`, this.margin, this.currentY);
    this.currentY += 8;
    this.pdf.text(`New Subscribers: ${data.stats.newSubscribers}`, this.margin, this.currentY);
    this.currentY += 8;
    this.pdf.text(`VIP Fans: ${data.stats.vipFans}`, this.margin, this.currentY);
    this.currentY += 8;
    this.pdf.text(`Churn Rate: ${data.stats.churnRate.toFixed(1)}%`, this.margin, this.currentY);
    this.currentY += 15;
    
    // Geographic breakdown
    if (data.geographicData.length > 0) {
      this.pdf.text('Top Geographic Markets:', this.margin, this.currentY);
      this.currentY += 10;
      
      data.geographicData.slice(0, 5).forEach(geo => {
        this.pdf.text(`${geo.country}: ${geo.fans} fans (${geo.percentage.toFixed(1)}%)`, this.margin + 10, this.currentY);
        this.currentY += 8;
      });
    }
    
    this.currentY += 10;
    this.addSeparator();
  }

  private addContentSection(data: ReportData): void {
    this.checkPageBreak(120);
    
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Content Performance', this.margin, this.currentY);
    this.currentY += 15;
    
    // Content overview
    this.pdf.setFontSize(12);
    this.pdf.text(`Total Content Posts: ${data.stats.totalContent}`, this.margin, this.currentY);
    this.currentY += 8;
    this.pdf.text(`Total Views: ${data.stats.totalViews.toLocaleString()}`, this.margin, this.currentY);
    this.currentY += 8;
    this.pdf.text(`Average Engagement Rate: ${data.stats.engagementRate.toFixed(1)}%`, this.margin, this.currentY);
    this.currentY += 15;
    
    // Top performing content
    if (data.contentPerformanceData.length > 0) {
      this.pdf.text('Top Performing Content:', this.margin, this.currentY);
      this.currentY += 10;
      
      data.contentPerformanceData.slice(0, 5).forEach((content, index) => {
        const rank = index + 1;
        this.pdf.text(`${rank}. ${content.type} - ${content.views} views, ${content.likes} likes`, this.margin + 10, this.currentY);
        this.currentY += 8;
      });
    }
    
    this.currentY += 10;
    this.addSeparator();
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 20;
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.text('Generated by EroBoard Analytics Platform', this.margin, footerY);
    this.pdf.text(`Page 1 of 1`, this.pageWidth - this.margin - 30, footerY);
  }

  private addSeparator(): void {
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 15;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.pdf.addPage();
      this.currentY = 20;
    }
  }

  private formatReportType(type: string): string {
    const types: Record<string, string> = {
      earnings: 'Revenue Report',
      audience: 'Audience Analytics',
      content: 'Content Performance',
      comprehensive: 'Comprehensive Analytics'
    };
    return types[type] || 'Analytics Report';
  }

  download(filename: string = 'eroboard-analytics-report.pdf'): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }
}