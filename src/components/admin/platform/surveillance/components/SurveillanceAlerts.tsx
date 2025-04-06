
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AlertsList } from "../AlertsList";
import { LiveAlert } from "@/types/alerts";

interface SurveillanceAlertsProps {
  liveAlerts: LiveAlert[];
  loadingRefresh: boolean;
  onRefresh: () => Promise<void>;
  onSelectAlert: (alert: LiveAlert) => void;
}

export const SurveillanceAlerts: React.FC<SurveillanceAlertsProps> = ({
  liveAlerts,
  loadingRefresh,
  onRefresh,
  onSelectAlert
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Alerts</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          disabled={loadingRefresh}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingRefresh ? 'animate-spin' : ''}`} />
          {loadingRefresh ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <AlertsList 
        alerts={liveAlerts} 
        isLoading={loadingRefresh}
        onSelect={onSelectAlert} 
      />
    </div>
  );
};
