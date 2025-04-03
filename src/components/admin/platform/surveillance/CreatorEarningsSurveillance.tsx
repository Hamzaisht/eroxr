
import { useState } from "react";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Import the necessary components
import { SearchFilterBar } from "./components/SearchFilterBar";
import { EarningsTable } from "./components/EarningsTable";
import { PendingPayoutsTable } from "./components/PendingPayoutsTable";
import { ApprovedPayoutsTable } from "./components/ApprovedPayoutsTable";
import { ProcessedPayoutsTable } from "./components/ProcessedPayoutsTable";

export function CreatorEarningsSurveillance() {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    earnings, 
    pendingPayouts, 
    approvedPayouts, 
    processedPayouts, 
    isLoading, 
    fetchAll, 
    processPayouts 
  } = useCreatorEarnings();
  
  // Filter data based on search query - adjust for CreatorEarnings structure
  const filteredEarnings = earnings.filter(earning => 
    earning.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    earning.creator_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingPayouts = pendingPayouts.filter(payout => 
    payout.creator_username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    payout.creator_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredApprovedPayouts = approvedPayouts.filter(payout => 
    payout.creator_username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    payout.creator_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredProcessedPayouts = processedPayouts.filter(payout => 
    payout.creator_username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    payout.creator_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <SearchFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchAll}
      />
      
      <Tabs defaultValue="earnings">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="earnings">Creator Earnings</TabsTrigger>
          <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
          <TabsTrigger value="approved">Approved Payouts</TabsTrigger>
          <TabsTrigger value="processed">Processed Payouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="earnings" className="mt-4">
          <EarningsTable 
            earnings={filteredEarnings} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <PendingPayoutsTable 
            payouts={filteredPendingPayouts}
            isLoading={isLoading}
            onProcessPayout={processPayouts}
          />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          <ApprovedPayoutsTable 
            payouts={filteredApprovedPayouts}
            isLoading={isLoading}
            onProcessPayout={processPayouts}
          />
        </TabsContent>
        
        <TabsContent value="processed" className="mt-4">
          <ProcessedPayoutsTable 
            payouts={filteredProcessedPayouts}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
