
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
  
  // STEP 1: Add useToast back
  const [activeTab, setActiveTab] = useState("overview");
  const session = useSession();
  const { toast } = useToast();
  
  console.log('✅ All minimal hooks called successfully');

  // Simple test content
  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-background md:ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">EroBoard Analytics</h1>
          <p className="text-muted-foreground mb-4">Testing minimal component render...</p>
          <div className="mt-4 p-4 bg-card rounded border">
            <p>Session: {session ? 'Active' : 'None'}</p>
            <p>Active Tab: {activeTab}</p>
            <p>Component rendered successfully with minimal hooks!</p>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setActiveTab("test")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded mr-2"
            >
              Test State Update
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Eroboard;
