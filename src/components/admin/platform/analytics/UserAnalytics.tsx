
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const UserAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
          <CardDescription>
            View platform usage and user engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Analytics dashboard will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
