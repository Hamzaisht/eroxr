
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PayoutRequest } from "../types";
import { formatCurrency, formatPayoutDate, getPayoutStatusBadge } from "../hooks/utils/payoutFormatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface PendingPayoutsTableProps {
  payouts: PayoutRequest[];
  isLoading: boolean;
  onProcessPayout: (payoutIds: string[]) => Promise<void>;
}

export const PendingPayoutsTable = ({ 
  payouts, 
  isLoading,
  onProcessPayout
}: PendingPayoutsTableProps) => {
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayouts(payouts.map(p => p.id));
    } else {
      setSelectedPayouts([]);
    }
  };

  const handleSelectPayout = (payoutId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayouts([...selectedPayouts, payoutId]);
    } else {
      setSelectedPayouts(selectedPayouts.filter(id => id !== payoutId));
    }
  };

  const handleProcessSelected = async () => {
    if (selectedPayouts.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onProcessPayout(selectedPayouts);
      setSelectedPayouts([]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedPayouts.length > 0 && (
        <div className="flex justify-between items-center p-2 bg-secondary/20 rounded-md">
          <span>{selectedPayouts.length} payout(s) selected</span>
          <Button 
            onClick={handleProcessSelected} 
            disabled={isProcessing}
            size="sm"
          >
            {isProcessing ? "Processing..." : "Process Selected"}
          </Button>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={payouts.length > 0 && selectedPayouts.length === payouts.length}
                  onCheckedChange={handleSelectAll}
                  disabled={payouts.length === 0}
                />
              </TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Requested</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No pending payouts
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout) => {
                const statusBadge = getPayoutStatusBadge(payout.status);
                
                return (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedPayouts.includes(payout.id)}
                        onCheckedChange={(checked) => handleSelectPayout(payout.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{payout.creator_username?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{payout.creator_username || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{payout.creator_id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(payout.final_amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        Fee: {formatCurrency(payout.platform_fee)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatPayoutDate(payout.requested_at)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={statusBadge.variant as any}>{statusBadge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => onProcessPayout([payout.id])}
                        disabled={isProcessing || selectedPayouts.includes(payout.id)}
                      >
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
