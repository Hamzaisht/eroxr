
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const FlaggedContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Flagged Content</CardTitle>
          <CardDescription>
            Review content that has been flagged by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Flagged content will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
