import { useState } from "react";
import { 
  AlertTriangle, 
  CreditCard, 
  DollarSign, 
  Download, 
  FileText, 
  Filter, 
  RefreshCw, 
  Search, 
  User, 
  UserPlus, 
  XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";
import { CreatorEarnings, PayoutRequest } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export const CreatorEarningsSurveillance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState<CreatorEarnings | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [showCreatorDialog, setShowCreatorDialog] = useState(false);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("creators");
  
  const { toast } = useToast();
  const { 
    creators, 
    payouts,
    isLoading, 
    error,
    isActionInProgress,
    handleRefresh,
    handleApprovePayoutRequest,
    handleRejectPayoutRequest,
    handleBlockCreatorPayouts,
    handleDownloadReport
  } = useCreatorEarnings();

  const filteredCreators = creators.filter(creator => {
    if (searchTerm && !creator.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (statusFilter === "stripe-connected" && !creator.stripe_connected) {
      return false;
    }
    if (statusFilter === "stripe-missing" && creator.stripe_connected) {
      return false;
    }
    
    return true;
  });
  
  const filteredPayouts = payouts.filter(payout => {
    if (searchTerm && !payout.creator_username?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (statusFilter !== "all" && payout.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const openCreatorDetails = (creator: CreatorEarnings) => {
    setSelectedCreator(creator);
    setShowCreatorDialog(true);
  };

  const openPayoutDetails = (payout: PayoutRequest) => {
    setSelectedPayout(payout);
    setShowPayoutDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-800 text-red-300 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-xl font-semibold">Monetization Surveillance</h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadReport}
            disabled={isLoading || isActionInProgress}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Report
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading || isActionInProgress}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-[#161B22]/80 backdrop-blur-md">
          <TabsTrigger value="creators">Creator Earnings</TabsTrigger>
          <TabsTrigger value="payouts">
            Payout Requests
            <Badge 
              variant={payouts.some(p => p.status === 'pending') ? "destructive" : "outline"} 
              className="ml-2"
            >
              {payouts.filter(p => p.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="stripe">Stripe Accounts</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 my-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by username..."
              className="pl-8 bg-[#161B22]/80"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px] bg-[#161B22]/80">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {activeTab === 'creators' ? (
                <>
                  <SelectItem value="all">All Creators</SelectItem>
                  <SelectItem value="stripe-connected">Stripe Connected</SelectItem>
                  <SelectItem value="stripe-missing">Missing Stripe</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          
          <Button size="icon" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="creators" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Gross Earnings</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Net Earnings</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCreators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No creators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCreators.map(creator => (
                    <TableRow key={creator.id} className="hover:bg-[#1C2128]/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.avatar_url || ''} alt={creator.username} />
                            <AvatarFallback>{creator.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{creator.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(creator.gross_earnings)}</TableCell>
                      <TableCell>{formatCurrency(creator.platform_fee)}</TableCell>
                      <TableCell>{formatCurrency(creator.net_earnings)}</TableCell>
                      <TableCell>{creator.subscription_count}</TableCell>
                      <TableCell>
                        {creator.stripe_connected ? (
                          <Badge variant="default" className="bg-green-700 text-white">Connected</Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-300 border-yellow-600">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openCreatorDetails(creator)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleBlockCreatorPayouts(creator.id)}
                            disabled={isActionInProgress}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
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
        
        <TabsContent value="payouts" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Final Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No payout requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayouts.map(payout => (
                    <TableRow key={payout.id} className="hover:bg-[#1C2128]/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={payout.creator_avatar_url || ''} alt={payout.creator_username || 'User'} />
                            <AvatarFallback>{(payout.creator_username?.[0] || 'U').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{payout.creator_username || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(payout.requested_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{formatCurrency(payout.amount)}</TableCell>
                      <TableCell>{formatCurrency(payout.platform_fee)}</TableCell>
                      <TableCell>{formatCurrency(payout.final_amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payout.status === 'pending' ? 'outline' :
                            payout.status === 'approved' ? 'default' :
                            payout.status === 'processed' ? 'default' : 'destructive'
                          }
                          className={payout.status === 'processed' ? 'bg-green-700 text-white' : ''}
                        >
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openPayoutDetails(payout)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          {payout.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleApprovePayoutRequest(payout.id)}
                                disabled={isActionInProgress}
                              >
                                <DollarSign className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRejectPayoutRequest(payout.id)}
                                disabled={isActionInProgress}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="stripe" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Stripe Status</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Connected On</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCreators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No creators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCreators.map(creator => (
                    <TableRow key={creator.id} className="hover:bg-[#1C2128]/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.avatar_url || ''} alt={creator.username} />
                            <AvatarFallback>{creator.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{creator.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {creator.stripe_connected ? (
                          <Badge variant="default" className="bg-green-700 text-white">Connected</Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-300 border-yellow-600">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell>United States</TableCell>
                      <TableCell>{creator.stripe_connected ? '2023-10-15' : '-'}</TableCell>
                      <TableCell>
                        {creator.stripe_connected ? (
                          <Badge variant="outline" className="text-green-300 border-green-600">Enabled</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-300 border-red-600">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Stripe Dashboard",
                                description: `Opening Stripe dashboard for ${creator.username}`,
                              });
                            }}
                          >
                            <CreditCard className="h-4 w-4 text-blue-500" />
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
      </Tabs>
      
      {/* Creator Details Dialog */}
      {selectedCreator && (
        <Dialog open={showCreatorDialog} onOpenChange={setShowCreatorDialog}>
          <DialogContent className="bg-[#161B22] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Creator Earnings Details
              </DialogTitle>
              <DialogDescription>
                Details for {selectedCreator.username}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCreator.avatar_url || ''} alt={selectedCreator.username} />
                  <AvatarFallback>{selectedCreator.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCreator.username}</h3>
                  <p className="text-sm text-gray-400">ID: {selectedCreator.id}</p>
                  <div className="flex items-center mt-1">
                    {selectedCreator.stripe_connected ? (
                      <Badge variant="default" className="bg-green-700 text-white">Stripe Connected</Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-300 border-yellow-600">Missing Stripe</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Gross Earnings</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedCreator.gross_earnings)}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Platform Fee (7%)</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedCreator.platform_fee)}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Net Earnings</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedCreator.net_earnings)}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Subscribers</div>
                  <div className="text-xl font-semibold">{selectedCreator.subscription_count}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">PPV Sales</div>
                  <div className="text-xl font-semibold">{selectedCreator.ppv_count}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Tips Received</div>
                  <div className="text-xl font-semibold">{selectedCreator.tip_count}</div>
                </div>
              </div>
              
              <div className="bg-[#1C2128]/80 p-4 rounded-md">
                <h4 className="font-medium mb-2">Last Payout</h4>
                {selectedCreator.last_payout_date ? (
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Date</div>
                      <div>{format(new Date(selectedCreator.last_payout_date), 'MMM d, yyyy')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Amount</div>
                      <div>{formatCurrency(selectedCreator.last_payout_amount || 0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <Badge variant="outline">
                        {selectedCreator.payout_status || 'Processed'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No payouts processed yet</div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDownloadReport()}>
                  <Download className="h-4 w-4 mr-1.5" />
                  Export Report
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleBlockCreatorPayouts(selectedCreator.id);
                    setShowCreatorDialog(false);
                  }}
                  disabled={isActionInProgress}
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Block Payouts
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Payout Request Dialog */}
      {selectedPayout && (
        <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
          <DialogContent className="bg-[#161B22] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Payout Request Details
              </DialogTitle>
              <DialogDescription>
                Request #{selectedPayout.id.substring(0, 8)} from {selectedPayout.creator_username || 'Unknown'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPayout.creator_avatar_url || ''} alt={selectedPayout.creator_username || 'User'} />
                  <AvatarFallback>{(selectedPayout.creator_username?.[0] || 'U').toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPayout.creator_username || 'Unknown'}</h3>
                  <p className="text-sm text-gray-400">Creator ID: {selectedPayout.creator_id}</p>
                  <div className="flex items-center mt-1">
                    <Badge
                      variant={
                        selectedPayout.status === 'pending' ? 'outline' :
                        selectedPayout.status === 'approved' ? 'default' :
                        selectedPayout.status === 'processed' ? 'default' : 'destructive'
                      }
                      className={payout.status === 'processed' ? 'bg-green-700 text-white' : ''}
                    >
                      {selectedPayout.status.charAt(0).toUpperCase() + selectedPayout.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Requested Amount</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedPayout.amount)}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Platform Fee (7%)</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedPayout.platform_fee)}</div>
                </div>
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Final Payout</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedPayout.final_amount)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400">Requested Date</div>
                  <div>{format(new Date(selectedPayout.requested_at), 'PPP')}</div>
                  <div>{format(new Date(selectedPayout.requested_at), 'HH:mm:ss')}</div>
                </div>
                
                {selectedPayout.approved_at && (
                  <div className="bg-[#1C2128]/80 p-4 rounded-md">
                    <div className="text-sm text-gray-400">Approved Date</div>
                    <div>{format(new Date(selectedPayout.approved_at), 'PPP')}</div>
                    <div>{format(new Date(selectedPayout.approved_at), 'HH:mm:ss')}</div>
                  </div>
                )}
                
                {selectedPayout.processed_at && (
                  <div className="bg-[#1C2128]/80 p-4 rounded-md">
                    <div className="text-sm text-gray-400">Processed Date</div>
                    <div>{format(new Date(selectedPayout.processed_at), 'PPP')}</div>
                    <div>{format(new Date(selectedPayout.processed_at), 'HH:mm:ss')}</div>
                  </div>
                )}
              </div>
              
              {selectedPayout.notes && (
                <div className="bg-[#1C2128]/80 p-4 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Notes</div>
                  <div className="text-sm">{selectedPayout.notes}</div>
                </div>
              )}
              
              {selectedPayout.status === 'pending' && (
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="default" 
                    onClick={() => {
                      handleApprovePayoutRequest(selectedPayout.id);
                      setShowPayoutDialog(false);
                    }}
                    disabled={isActionInProgress}
                  >
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    Approve Payout
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleRejectPayoutRequest(selectedPayout.id);
                      setShowPayoutDialog(false);
                    }}
                    disabled={isActionInProgress}
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Reject Payout
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
