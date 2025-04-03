
import { PayoutRequest } from "../types";
import { formatCurrency, formatPayoutDate, getPayoutStatusBadge } from "../hooks/utils/payoutFormatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface ProcessedPayoutsTableProps {
  payouts: PayoutRequest[];
  isLoading: boolean;
}

export function ProcessedPayoutsTable({ payouts, isLoading }: ProcessedPayoutsTableProps) {
  return (
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
          ) : payouts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No processed payouts found
              </TableCell>
            </TableRow>
          ) : (
            payouts.map((payout) => (
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
                  <Badge variant={getPayoutStatusBadge(payout.status).variant as "default" | "destructive" | "outline" | "secondary"}>
                    {getPayoutStatusBadge(payout.status).label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
