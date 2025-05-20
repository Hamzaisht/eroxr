
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { SurveillanceContentItem, ContentType } from "@/types/surveillance";
import { ContentDetailDialog } from "./ContentDetailDialog";

interface ContentSurveillanceListProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  contentType: ContentType;
  error?: string | null;
  onRefresh?: () => void;
}

export function ContentSurveillanceList({
  items,
  isLoading,
  contentType,
  error,
  onRefresh
}: ContentSurveillanceListProps) {
  const [selectedItem, setSelectedItem] = useState<SurveillanceContentItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };
  
  // Open detail dialog
  const handleOpenDetail = (item: SurveillanceContentItem) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
  };
  
  // Get severity badge variant
  const getSeverityVariant = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  // Get status badge variant
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'reviewed':
        return 'secondary';
      case 'removed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="ml-2">Loading content...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        {onRefresh && <Button onClick={onRefresh}>Try Again</Button>}
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No {contentType} content found</p>
        {onRefresh && <Button onClick={onRefresh} className="mt-4">Refresh</Button>}
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 relative hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-4">
              {/* Creator Avatar */}
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage src={item.creator_avatar} alt={item.creator_username || "User"} />
                <AvatarFallback>{(item.creator_username || "U")[0]}</AvatarFallback>
              </Avatar>
              
              {/* Content Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.flagged && (
                    <Badge variant="destructive">Flagged</Badge>
                  )}
                  {item.severity && (
                    <Badge variant={getSeverityVariant(item.severity)}>
                      {item.severity}
                    </Badge>
                  )}
                  {item.status && (
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="line-clamp-1">
                    {item.description || `${contentType} content`}
                  </p>
                  <div className="flex items-center text-xs space-x-2">
                    <span>By {item.creator_username || "Anonymous"}</span>
                    <span className="inline-flex items-center">
                      <span className="mx-1">•</span>
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenDetail(item)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Detail Dialog */}
      <ContentDetailDialog 
        item={selectedItem} 
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />
    </>
  );
}
