
import { useState, useEffect } from "react";
import { TabContent } from "./TabContent";
import { EarningsTable } from "./components/EarningsTable";
import { PendingPayoutsTable } from "./components/PendingPayoutsTable";
import { ApprovedPayoutsTable } from "./components/ApprovedPayoutsTable";
import { ProcessedPayoutsTable } from "./components/ProcessedPayoutsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { CreatorEarnings, PayoutRequest } from "./types";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";

export const CreatorEarningsSurveillance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    earnings, 
    pendingPayouts, 
    approvedPayouts, 
    processedPayouts, 
    isLoading, 
    error 
  } = useCreatorEarnings();

  // Add missing functions that were causing errors
  const fetchAll = async () => {
    // This would be implemented in the real component
    console.log("Fetching all earnings data...");
  };

  const processPayouts = async (ids: string[]) => {
    // This would be implemented in the real component
    console.log("Processing payouts:", ids);
  };

  const filteredEarnings = earnings.filter(item => 
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingPayouts = pendingPayouts.filter(item => 
    (item.username || item.creator_username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredApprovedPayouts = approvedPayouts.filter(item => 
    (item.username || item.creator_username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredProcessedPayouts = processedPayouts.filter(item => 
    (item.username || item.creator_username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TabContent isActive={true}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Creator Earnings</h2>
          <div className="flex space-x-2">
            <SearchFilterBar
              onSearchChange={setSearchQuery}
              onRefresh={fetchAll}
            />
          </div>
        </div>

        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
            <TabsTrigger value="approved">Approved Payouts</TabsTrigger>
            <TabsTrigger value="processed">Processed Payouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings">
            <EarningsTable 
              earnings={filteredEarnings} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <PendingPayoutsTable 
              payouts={filteredPendingPayouts} 
              isLoading={isLoading} 
              error={error} 
              onProcessPayouts={processPayouts}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <ApprovedPayoutsTable 
              payouts={filteredApprovedPayouts} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
          
          <TabsContent value="processed">
            <ProcessedPayoutsTable 
              payouts={filteredProcessedPayouts} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </TabContent>
  );
};
