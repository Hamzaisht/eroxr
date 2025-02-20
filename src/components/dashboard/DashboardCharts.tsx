
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { EngagementChart } from "./EngagementChart";
import { ContentDistribution } from "./ContentDistribution";
import { RevenueChart } from "./RevenueChart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, subDays, startOfMonth, endOfMonth } from "date-fns";

interface DashboardChartsProps {
  engagementData: any[];
  contentTypeData: any[];
  earningsData: any[];
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function DashboardCharts({
  engagementData,
  contentTypeData,
  earningsData,
  onDateRangeChange
}: DashboardChartsProps) {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
      onDateRangeChange({ from: range.from, to: range.to });
    }
  };

  const setLast30Days = () => {
    const range = {
      from: subDays(new Date(), 30),
      to: new Date()
    };
    setDateRange(range);
    onDateRangeChange(range);
  };

  const setThisMonth = () => {
    const range = {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    };
    setDateRange(range);
    onDateRangeChange(range);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Engagement Overview</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex-grow sm:flex-grow-0">
                <DateRangePicker
                  from={dateRange.from}
                  to={dateRange.to}
                  onSelect={handleDateRangeChange}
                  className="w-full sm:w-[280px]"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={setLast30Days} className="whitespace-nowrap">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
            </div>
          </div>
          <EngagementChart data={engagementData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Content Distribution</h2>
            <Button variant="ghost" size="sm" onClick={setLast30Days}>
              Last 30 Days
            </Button>
          </div>
          <ContentDistribution data={contentTypeData} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Revenue Analytics</h2>
          <Button variant="ghost" size="sm" onClick={setThisMonth}>
            This Month
          </Button>
        </div>
        <RevenueChart data={earningsData} />
      </motion.div>
    </>
  );
}
