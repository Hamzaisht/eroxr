import { useState } from "react";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";
import { CreatorEarnings, PayoutRequest } from "./types";
import { formatCurrency, formatPayoutDate, getPayoutStatusBadge } from "./hooks/utils/payoutFormatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Download, CreditCard, RefreshCw, Loader2, Check } from "lucide-react";

const getVariantForStatus = (status?: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "pending":
      return "outline";
    case "approved":
      return "secondary";
    case "processed":
      return "default";
    case "flagged":
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
};

export function CreatorEarningsSurveillance() {
  const [searchQuery, setSearchQuery] = useState('');
  const { earnings, pendingPayouts, approvedPayouts, processedPayouts, isLoading, fetchAll, processPayouts } = useCreatorEarnings();
  
  const filteredEarnings = earnings.filter(earning => 
    earning.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (earning.user_id && earning.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
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
      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creators..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={fetchAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="earnings">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="earnings">Creator Earnings</TabsTrigger>
          <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
          <TabsTrigger value="approved">Approved Payouts</TabsTrigger>
          <TabsTrigger value="processed">Processed Payouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="earnings" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Creator</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[150px] text-right">Earnings</TableHead>
                  <TableHead className="text-right">Description</TableHead>
                  <TableHead className="w-[120px] text-center">Date</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading earnings data...
                    </TableCell>
                  </TableRow>
                ) : filteredEarnings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No earnings data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEarnings.map((earning) => (
                    <TableRow key={earning.id + earning.user_id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={earning.avatar_url} />
                            <AvatarFallback>{earning.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{earning.username}</div>
                            <div className="text-xs text-muted-foreground">
                              {earning.source || "Platform"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {earning.description || "Earnings"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">{formatCurrency(earning.amount || 0)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{earning.description || "Platform earnings"}</div>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {earning.created_at && formatPayoutDate(earning.created_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={getVariantForStatus(earning.status)}
                        >
                          {earning.status || "Active"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Creator</TableHead>
                  <TableHead className="w-[150px] text-right">Requested</TableHead>
                  <TableHead className="w-[150px] text-right">Platform Fee</TableHead>
                  <TableHead className="w-[150px] text-right">Final Amount</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading pending payouts...
                    </TableCell>
                  </TableRow>
                ) : filteredPendingPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No pending payouts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPendingPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div>{payout.creator_username || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {payout.creator_id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payout.amount)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(payout.platform_fee)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(payout.final_amount)}
                      </TableCell>
                      <TableCell>
                        {formatPayoutDate(payout.requested_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => processPayouts([payout.id], 'approve')}
                          >
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Creator</TableHead>
                  <TableHead className="w-[150px] text-right">Requested</TableHead>
                  <TableHead className="w-[150px] text-right">Platform Fee</TableHead>
                  <TableHead className="w-[150px] text-right">Final Amount</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading approved payouts...
                    </TableCell>
                  </TableRow>
                ) : filteredApprovedPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No approved payouts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApprovedPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div>{payout.creator_username || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {payout.creator_id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payout.amount)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(payout.platform_fee)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(payout.final_amount)}
                      </TableCell>
                      <TableCell>
                        {formatPayoutDate(payout.requested_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => processPayouts([payout.id], 'process')}
                          >
                            Process
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="processed" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Creator</TableHead>
                  <TableHead className="w-[150px] text-right">Requested</TableHead>
                  <TableHead className="w-[150px] text-right">Platform Fee</TableHead>
                  <TableHead className="w-[150px] text-right">Final Amount</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading processed payouts...
                    </TableCell>
                  </TableRow>
                ) : filteredProcessedPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No processed payouts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcessedPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div>{payout.creator_username || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {payout.creator_id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payout.amount)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(payout.platform_fee)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(payout.final_amount)}
                      </TableCell>
                      <TableCell>
                        {formatPayoutDate(payout.requested_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPayoutStatusBadge(payout.status).variant}>
                          {getPayoutStatusBadge(payout.status).label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
