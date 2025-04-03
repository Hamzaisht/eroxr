
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CreatorEarnings } from "../types";
import { formatCurrency, formatPayoutDate } from "../hooks/utils/payoutFormatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface EarningsTableProps {
  earnings: CreatorEarnings[];
  isLoading: boolean;
}

export const EarningsTable = ({ earnings, isLoading }: EarningsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
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
            <TableHead>Total Earnings</TableHead>
            <TableHead className="hidden md:table-cell">Subscription</TableHead>
            <TableHead className="hidden md:table-cell">Tips</TableHead>
            <TableHead className="hidden md:table-cell">PPV</TableHead>
            <TableHead className="hidden md:table-cell">Last Payout</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {earnings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No earnings data available
              </TableCell>
            </TableRow>
          ) : (
            earnings.map((earning) => (
              <TableRow key={earning.creator_id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={earning.avatar_url} alt={earning.username} />
                      <AvatarFallback>{earning.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{earning.username}</div>
                      <div className="text-xs text-muted-foreground">{earning.creator_id.substring(0, 8)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(earning.total_earnings)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatCurrency(earning.subscription_earnings)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatCurrency(earning.tip_earnings)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatCurrency(earning.ppv_earnings)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {earning.last_payout_date ? (
                    <div className="flex flex-col">
                      <span>{formatPayoutDate(earning.last_payout_date)}</span>
                      {earning.last_payout_amount && (
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(earning.last_payout_amount)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline">No Payouts</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
