
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const PayoutRequests = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>
            Manage creator payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Payout requests will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
