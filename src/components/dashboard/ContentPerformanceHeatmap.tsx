
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface ContentItem {
  id: string;
  earnings: number;
  likes: number;
  comments: number;
  views: number;
  engagement: number;
  created_at: string;
  type: string;
}

interface ContentPerformanceHeatmapProps {
  data: ContentItem[];
}

export function ContentPerformanceHeatmap({ data }: ContentPerformanceHeatmapProps) {
  const [metric, setMetric] = useState<'earnings' | 'engagement' | 'views'>('earnings');
  
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 glass-card">
        <h3 className="text-lg font-semibold mb-2">Content Performance</h3>
        <p className="text-sm text-luxury-muted mb-4">
          Visualize which content performs best
        </p>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-luxury-muted">No content data available</p>
        </div>
      </Card>
    );
  }

  // Get the max value for the selected metric to scale colors appropriately
  const maxValue = Math.max(...data.map(item => item[metric]));
  
  const getIntensity = (value: number) => {
    if (maxValue === 0) return 0;
    return Math.min(0.9, Math.max(0.1, value / maxValue));
  };
  
  const getColor = (value: number, type: string) => {
    const intensity = getIntensity(value);
    
    if (metric === 'earnings') {
      return `rgba(52, 211, 153, ${intensity})`;
    } else if (metric === 'engagement') {
      return `rgba(139, 92, 246, ${intensity})`;
    } else {
      return `rgba(59, 130, 246, ${intensity})`;
    }
  };

  const getCellLabel = (item: ContentItem) => {
    if (metric === 'earnings') {
      return `$${item.earnings.toFixed(2)}`;
    } else if (metric === 'engagement') {
      return item.engagement;
    } else {
      return item.views;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-6 glass-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Content Performance</h3>
            <p className="text-sm text-luxury-muted">
              Visualize which content performs best
            </p>
          </div>
          
          <Tabs 
            value={metric} 
            onValueChange={(value) => setMetric(value as 'earnings' | 'engagement' | 'views')}
            className="mt-2 md:mt-0"
          >
            <TabsList className="bg-luxury-darker">
              <TabsTrigger value="earnings">Revenue</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="views">Views</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-xs text-luxury-muted font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 grid-rows-4">
              {Array.from({ length: 28 }).map((_, index) => {
                const day = index % 7;
                const week = Math.floor(index / 7);
                
                // Find content published on this day (simplified for demo)
                const content = data.find((item, i) => i % 28 === index);
                
                return (
                  <div 
                    key={index}
                    className={`aspect-square rounded-md flex items-center justify-center relative cursor-pointer transition-transform hover:scale-105 ${
                      content ? 'hover:shadow-lg' : 'opacity-40 bg-luxury-darker/30'
                    }`}
                    style={{
                      backgroundColor: content ? getColor(content[metric], content.type) : undefined
                    }}
                    title={content ? `${format(new Date(content.created_at), 'MMM d')}: ${getCellLabel(content)}` : ''}
                  >
                    {content && (
                      <span className="text-xs font-medium text-white">
                        {getCellLabel(content)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-xs text-luxury-muted">
          <div className="flex items-center">
            <span className="mr-2">Low</span>
            <div className="flex h-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-6 h-full"
                  style={{
                    backgroundColor: getColor((i + 1) * (maxValue / 5), 'photo')
                  }}
                />
              ))}
            </div>
            <span className="ml-2">High</span>
          </div>
          
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-luxury-primary/40 mr-1"></div>
            <span className="mr-3">Photos</span>
            <div className="h-3 w-3 rounded-full bg-luxury-secondary/40 mr-1"></div>
            <span>Videos</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
