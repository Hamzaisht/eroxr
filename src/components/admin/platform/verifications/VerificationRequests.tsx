
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const VerificationRequests = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            Review and approve user verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Verification requests will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
