
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PayoutRequest } from "../types";
import { formatCurrency, formatPayoutDate, getPayoutStatusBadge } from "../hooks/utils/payoutFormatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ProcessedPayoutsTableProps {
  payouts: PayoutRequest[];
  isLoading: boolean;
}

export const ProcessedPayoutsTable = ({ 
  payouts, 
  isLoading
}: ProcessedPayoutsTableProps) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Requested</TableHead>
            <TableHead className="hidden md:table-cell">Processed</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No processed payouts
              </TableCell>
            </TableRow>
          ) : (
            payouts.map((payout) => {
              const statusBadge = getPayoutStatusBadge(payout.status);
              
              return (
                <TableRow key={payout.id}>
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
                    {payout.processed_at ? formatPayoutDate(payout.processed_at) : 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={statusBadge.variant as any}>{statusBadge.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
