import { useState, useEffect } from "react";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { 
  Banknote, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  ChevronsUpDown, 
  RefreshCw, 
  UserX, 
  Users, 
  DollarSign,
  Download
} from "lucide-react";
import { CreatorEarnings, PayoutRequest, StripeAccount } from "./types";

export const CreatorEarningsSurveillance = () => {
  const [activeTab, setActiveTab] = useState("earnings");
  const [selectedCreator, setSelectedCreator] = useState<CreatorEarnings | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  
  const { 
    creatorEarnings,
    pendingPayouts,
    processingPayouts,
    completedPayouts,
    stripeAccounts,
    isLoading,
    error,
    fetchCreatorEarnings,
    handlePayoutAction
  } = useCreatorEarnings();

  useEffect(() => {
    fetchCreatorEarnings();
  }, [fetchCreatorEarnings]);

  const handleRefresh = () => {
    fetchCreatorEarnings();
  };

  const handleCreatorSelect = (creator: CreatorEarnings) => {
    setSelectedCreator(creator);
  };

  const handlePayoutProcess = async (payoutId: string, action: string) => {
    setProcessingAction(payoutId);
    await handlePayoutAction(payoutId, action as any);
    setProcessingAction(null);
  };

  if (isLoading && creatorEarnings.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Creator Earnings</CardTitle>
          <CardDescription>Loading monetization data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-800 text-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Monetization Surveillance</h2>
          <p className="text-sm text-gray-400">Monitor creator earnings, payouts, and Stripe accounts</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card mb-4">
          <TabsTrigger value="earnings">Creator Earnings</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Payouts
            {pendingPayouts.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingPayouts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing Payouts
            {processingPayouts.length > 0 && (
              <Badge variant="outline" className="ml-2">{processingPayouts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed Payouts</TabsTrigger>
          <TabsTrigger value="stripe">
            Stripe Accounts
            {stripeAccounts.filter(a => !a.is_verified).length > 0 && (
              <Badge variant="outline" className="ml-2">
                {stripeAccounts.filter(a => !a.is_verified).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="earnings">
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Creator Earnings</CardTitle>
                  <CardDescription>
                    Total earnings and payouts for verified creators
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {creatorEarnings.map(creator => (
                    <CreatorEarningsRow 
                      key={creator.id} 
                      creator={creator} 
                      onSelect={() => handleCreatorSelect(creator)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <PayoutsList 
            title="Pending Payouts" 
            description="Awaiting admin approval before processing"
            payouts={pendingPayouts}
            onAction={handlePayoutProcess}
            processingAction={processingAction}
            actions={[
              { id: 'approve', label: 'Approve', variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
              { id: 'reject', label: 'Reject', variant: 'destructive' }
            ]}
          />
        </TabsContent>
        
        <TabsContent value="processing">
          <PayoutsList 
            title="Processing Payouts" 
            description="Approved and awaiting transfer to creator"
            payouts={processingPayouts}
            onAction={handlePayoutProcess}
            processingAction={processingAction}
            actions={[
              { id: 'process', label: 'Mark as Processed', variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
              { id: 'reject', label: 'Reject', variant: 'destructive' }
            ]}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <PayoutsList 
            title="Completed Payouts" 
            description="Successfully processed creator payments"
            payouts={completedPayouts}
            showActions={false}
          />
        </TabsContent>
        
        <TabsContent value="stripe">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Stripe Connected Accounts</CardTitle>
              <CardDescription>
                Creators and their payment processor status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {stripeAccounts.map((account) => (
                    <StripeAccountRow 
                      key={account.id} 
                      account={account} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedCreator && (
        <CreatorDetailsDialog 
          creator={selectedCreator}
          open={!!selectedCreator}
          onOpenChange={(open) => !open && setSelectedCreator(null)}
        />
      )}
    </div>
  );
};

// Helper Components

interface CreatorEarningsRowProps {
  creator: CreatorEarnings;
  onSelect: () => void;
}

const CreatorEarningsRow = ({ creator, onSelect }: CreatorEarningsRowProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-[#161B22] rounded-lg border border-gray-800 hover:bg-[#1c232c] transition-colors cursor-pointer" onClick={onSelect}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-white/10">
          <AvatarImage src={creator.avatar_url || undefined} alt={creator.username} />
          <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium flex items-center">
            {creator.username}
            <Badge variant={creator.stripe_connected ? "outline" : "destructive"} className="ml-2 text-xs">
              {creator.stripe_connected ? "Stripe Connected" : "No Stripe Account"}
            </Badge>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            <span className="mr-3">
              {creator.subscription_count} subscriber{creator.subscription_count !== 1 ? 's' : ''}
            </span>
            <span className="mr-3">
              {creator.ppv_count} PPV
            </span>
            <span>
              {creator.tip_count} tips
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-gray-400">Gross Earnings</div>
          <div className="font-medium">${creator.gross_earnings.toFixed(2)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Platform Fee</div>
          <div className="font-medium text-red-400">${creator.platform_fee.toFixed(2)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Net Earnings</div>
          <div className="font-medium text-green-400">${creator.net_earnings.toFixed(2)}</div>
        </div>
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          Details
        </Button>
      </div>
    </div>
  );
};

interface PayoutsListProps {
  title: string;
  description: string;
  payouts: PayoutRequest[];
  onAction?: (payoutId: string, action: string) => void;
  processingAction?: string | null;
  actions?: { id: string; label: string; variant: "default" | "destructive" | "outline"; className?: string }[];
  showActions?: boolean;
}

const PayoutsList = ({ 
  title, 
  description, 
  payouts, 
  onAction, 
  processingAction,
  actions = [],
  showActions = true
}: PayoutsListProps) => {
  if (payouts.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <CheckCircle className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No payouts found</p>
            <p className="text-sm">All payouts have been processed</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {payouts.map((payoutItem) => (
              <div key={payoutItem.id} className="flex items-center justify-between p-3 bg-[#161B22] rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={payoutItem.creator_avatar_url || undefined} alt={payoutItem.creator_username} />
                    <AvatarFallback>{payoutItem.creator_username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{payoutItem.creator_username}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Requested: {format(new Date(payoutItem.requested_at), 'PPP')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Amount</div>
                    <div className="font-medium">${payoutItem.amount.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Platform Fee</div>
                    <div className="font-medium text-red-400">${payoutItem.platform_fee.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Final Amount</div>
                    <div className="font-medium text-green-400">${payoutItem.final_amount.toFixed(2)}</div>
                  </div>
                  
                  {showActions && onAction && (
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" disabled={processingAction === payoutItem.id}>
                            {processingAction === payoutItem.id ? (
                              <>Processing<RefreshCw className="h-3 w-3 ml-2 animate-spin" /></>
                            ) : (
                              <>Actions<ChevronsUpDown className="h-3 w-3 ml-2" /></>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {actions.map(action => (
                            <DialogTrigger key={action.id} asChild>
                              <DropdownMenuItem>
                                {action.label}
                              </DropdownMenuItem>
                            </DialogTrigger>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {actions.map(action => (
                        <Dialog key={action.id}>
                          <DialogTrigger asChild>
                            <span style={{ display: 'none' }}>{action.label}</span>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{action.label} Payout</DialogTitle>
                              <DialogDescription>
                                {action.id === 'approve' && 'Approve this payout request for processing.'}
                                {action.id === 'reject' && 'Reject this payout request. The creator will be notified.'}
                                {action.id === 'process' && 'Mark this payout as processed after completing the transfer.'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="mb-4">
                                Creator: <span className="font-medium">{payoutItem.creator_username}</span>
                              </p>
                              <p className="mb-4">
                                Amount: <span className="font-medium">${payoutItem.final_amount.toFixed(2)}</span> (after {(payoutItem.platform_fee / payoutItem.amount * 100).toFixed(0)}% platform fee)
                              </p>
                              <p>
                                Requested: <span className="font-medium">{format(new Date(payoutItem.requested_at), 'PPP')}</span>
                              </p>
                            </div>
                            <DialogFooter>
                              <Button 
                                variant={action.variant} 
                                className={action.className} 
                                onClick={() => {
                                  const handleAction = (action: string) => onAction(payoutItem.id, action);
                                  handleAction(action.id);
                                }}
                              >
                                Confirm {action.label}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface StripeAccountRowProps {
  account: StripeAccount;
}

const StripeAccountRow = ({ account }: StripeAccountRowProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-[#161B22] rounded-lg border border-gray-800">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-[#3C4EA0] rounded-lg flex items-center justify-center text-white font-bold">
          S
        </div>
        <div>
          <div className="font-medium">
            <span className="text-gray-500">acct_</span>
            {account.stripe_account_id.slice(5, 15)}...
          </div>
          <div className="text-xs text-gray-400">
            {account.is_verified ? 'Verified' : (account.status || 'Pending verification')}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-gray-400">Country</div>
          <div className="font-medium">{account.country}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Currency</div>
          <div className="font-medium">{account.currency || account.default_currency}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={account.is_verified ? "outline" : "secondary"}
            className={account.is_verified ? "bg-green-900/30 text-green-300" : ""}
          >
            {account.is_verified ? "Verified" : "Pending"}
          </Badge>
          <Button variant="outline" size="sm">Details</Button>
        </div>
      </div>
    </div>
  );
};

interface CreatorDetailsDialogProps {
  creator: CreatorEarnings;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatorDetailsDialog = ({ creator, open, onOpenChange }: CreatorDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={creator.avatar_url || undefined} alt={creator.username} />
              <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {creator.username} - Earnings Details
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown of this creator's earnings and statistics
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Gross Earnings</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline">
                <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-2xl font-bold">
                  ${creator.gross_earnings.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Platform Fee</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline">
                <DollarSign className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-2xl font-bold">
                  ${creator.platform_fee.toFixed(2)}
                </span>
                <span className="text-sm ml-2">
                  ({(creator.platform_fee / creator.gross_earnings * 100 || 0).toFixed(1)}%)
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Net Earnings</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline">
                <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-2xl font-bold">
                  ${creator.net_earnings.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold">
                {creator.subscription_count}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Banknote className="h-4 w-4 mr-2" />
                PPV Purchases
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold">
                {creator.ppv_count}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Tips Received
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold">
                {creator.tip_count}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Stripe Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Badge variant={creator.stripe_connected ? "outline" : "destructive"} className="text-xs">
                {creator.stripe_connected ? "Connected" : "Not Connected"}
              </Badge>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Last Payout Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {creator.last_payout_date ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span>{format(new Date(creator.last_payout_date), 'PP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span>${creator.last_payout_amount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge variant="outline">
                      {creator.payout_status || 'unknown'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No previous payouts</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Earnings Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Stripe Account
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <UserX className="h-4 w-4 mr-2" />
                  Suspend Monetization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
