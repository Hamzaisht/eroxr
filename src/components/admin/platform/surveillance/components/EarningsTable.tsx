import { CreatorEarnings } from "../types";
import { formatCurrency, formatPayoutDate } from "../hooks/utils/payoutFormatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EarningsTableProps {
  earnings: CreatorEarnings[];
  isLoading: boolean;
}

// Utility function to determine the badge variant based on status
const getVariantForStatus = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status.toLowerCase()) {
    case "flagged":
      return "destructive";
    case "pending":
      return "secondary";
    case "warning":
      return "outline";
    default:
      return "default";
  }
};

export function EarningsTable({ earnings, isLoading }: EarningsTableProps) {
  return (
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
          ) : earnings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No earnings data found
              </TableCell>
            </TableRow>
          ) : (
            earnings.map((earning) => (
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
                  <Badge variant={getVariantForStatus(earning.status || "default")}>
                    {earning.status || "Active"}
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
