
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const DeletedContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deleted Content</CardTitle>
          <CardDescription>
            View and restore deleted content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Deleted content will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
