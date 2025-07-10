import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  Clock,
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  Mail,
  Settings,
  CheckCircle
} from "lucide-react";
import { EroboardStats } from "@/hooks/useEroboardData";

interface ReportsExportsProps {
  data: {
    stats: EroboardStats;
    earningsData: Array<{ date: string; amount: number }>;
  };
  isLoading: boolean;
}

export function ReportsExports({ data, isLoading }: ReportsExportsProps) {
  const { stats, earningsData } = data;
  const [selectedReport, setSelectedReport] = useState("earnings");
  const [dateRange, setDateRange] = useState("30days");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [emailReport, setEmailReport] = useState(false);

  const reportTypes = [
    {
      id: "earnings",
      title: "Earnings Report",
      description: "Detailed revenue breakdown and payment history",
      icon: DollarSign,
      features: ["Revenue by source", "Payment history", "Tax summaries", "Growth trends"]
    },
    {
      id: "audience",
      title: "Audience Analytics",
      description: "Subscriber demographics and engagement metrics",
      icon: Users,
      features: ["Demographic data", "Engagement rates", "Retention analysis", "Growth patterns"]
    },
    {
      id: "content",
      title: "Content Performance",
      description: "Post analytics and optimization insights",
      icon: BarChart3,
      features: ["Top performing content", "Engagement metrics", "Best posting times", "Content recommendations"]
    },
    {
      id: "comprehensive",
      title: "Comprehensive Report",
      description: "Complete analytics overview with all metrics",
      icon: FileText,
      features: ["All analytics data", "Executive summary", "Growth insights", "Recommendations"]
    }
  ];

  const scheduledReports = [
    {
      name: "Weekly Performance Summary",
      type: "audience",
      frequency: "Weekly",
      nextRun: "Monday, 9:00 AM",
      status: "active"
    },
    {
      name: "Monthly Revenue Report",
      type: "earnings",
      frequency: "Monthly",
      nextRun: "1st of month, 8:00 AM",
      status: "active"
    },
    {
      name: "Quarterly Analytics Review",
      type: "comprehensive",
      frequency: "Quarterly",
      nextRun: "Jan 1, 2025",
      status: "paused"
    }
  ];

  const handleGenerateReport = () => {
    // Simulate report generation
    console.log("Generating report:", {
      type: selectedReport,
      dateRange,
      format: reportFormat,
      emailReport
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-luxury-primary" />
            Reports & Exports
          </h1>
          <p className="text-gray-300 mt-2">Generate detailed reports and export your analytics data</p>
        </div>
        <Button className="bg-luxury-primary hover:bg-luxury-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Quick Export
        </Button>
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-luxury-darker border-luxury-neutral/10">
            <CardHeader>
              <CardTitle className="text-white">Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedReport === report.id
                          ? 'border-luxury-primary bg-luxury-primary/10'
                          : 'border-luxury-neutral/20 hover:border-luxury-primary/50'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-6 w-6 ${selectedReport === report.id ? 'text-luxury-primary' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{report.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{report.description}</p>
                          <div className="space-y-1">
                            {report.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-gray-400">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Configuration Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateRange" className="text-gray-300">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="bg-luxury-dark border-luxury-neutral/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format" className="text-gray-300">Export Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger className="bg-luxury-dark border-luxury-neutral/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="json">JSON Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email" 
                    checked={emailReport} 
                    onCheckedChange={(checked) => setEmailReport(checked === true)}
                  />
                  <Label htmlFor="email" className="text-gray-300">Email report to me</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="watermark" />
                  <Label htmlFor="watermark" className="text-gray-300">Include data visualizations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="summary" defaultChecked />
                  <Label htmlFor="summary" className="text-gray-300">Include executive summary</Label>
                </div>
              </div>

              <Button onClick={handleGenerateReport} className="w-full bg-luxury-primary hover:bg-luxury-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="bg-luxury-darker border-luxury-neutral/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Earnings</span>
                  <span className="text-white font-medium">${stats.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Subscribers</span>
                  <span className="text-white font-medium">{stats.totalSubscribers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Content Posts</span>
                  <span className="text-white font-medium">{stats.totalContent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement Rate</span>
                  <span className="text-white font-medium">{stats.engagementRate.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-luxury-neutral/20">
                <p className="text-sm text-gray-400">
                  Data range: {dateRange === '30days' ? 'Last 30 days' : dateRange}
                </p>
                <p className="text-sm text-gray-400">
                  Export format: {reportFormat.toUpperCase()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-luxury-darker border-luxury-neutral/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Recent Downloads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Earnings Report - Dec 2024</p>
                  <p className="text-xs text-gray-400">Downloaded 2 hours ago</p>
                </div>
                <Button size="sm" variant="outline" className="border-luxury-neutral/20">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Content Analytics - Nov 2024</p>
                  <p className="text-xs text-gray-400">Downloaded yesterday</p>
                </div>
                <Button size="sm" variant="outline" className="border-luxury-neutral/20">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scheduled Reports */}
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-luxury-primary" />
            Scheduled Reports
          </CardTitle>
          <Button variant="outline" size="sm" className="border-luxury-neutral/20">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-luxury-dark/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${report.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <div>
                    <h4 className="font-medium text-white">{report.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400">
                        {report.frequency} • {report.type}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.nextRun}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={report.status === 'active' ? 'secondary' : 'outline'}>
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-luxury-neutral/20">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Compliance */}
      <Card className="bg-gradient-to-r from-luxury-primary/20 to-purple-600/20 border border-luxury-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-luxury-primary/20 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-luxury-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Data Privacy & Compliance</h3>
              <p className="text-gray-300 text-sm">All exports comply with GDPR and data protection regulations. Reports include anonymized data where required.</p>
            </div>
            <Button variant="outline" className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}