
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { EngagementChart } from "./EngagementChart";
import { ContentDistribution } from "./ContentDistribution";
import { RevenueChart } from "./RevenueChart";

interface DashboardChartsProps {
  engagementData: any[];
  contentTypeData: any[];
  earningsData: any[];
}

export function DashboardCharts({
  engagementData,
  contentTypeData,
  earningsData
}: DashboardChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Engagement Overview</h2>
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Filter
            </Button>
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
            <Button variant="ghost" size="sm">
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
          <Button variant="ghost" size="sm">
            This Month
          </Button>
        </div>
        <RevenueChart data={earningsData} />
      </motion.div>
    </>
  );
}
