
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SurveillanceContentItem } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionModerationActions } from "./moderation/ModerationActions";
import { formatDistanceToNow } from "date-fns";

export interface ContentSurveillanceListProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  onViewContent: (content: SurveillanceContentItem) => void;
  emptyMessage?: string;
  error?: any;
  title?: string;
}

export const ContentSurveillanceList = ({ 
  items, 
  isLoading, 
  onViewContent,
  emptyMessage = "No content found",
  error,
  title = "Content"
}: ContentSurveillanceListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading content: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={content.creator_avatar_url} alt={content.creator_username} />
                        <AvatarFallback>{content.creator_username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{content.creator_username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {content.title ? (
                        <span className="font-medium">{content.title}</span>
                      ) : (
                        <span className="text-sm">{content.content}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 text-xs text-muted-foreground">
                      <span>{content.views || 0} views</span>
                      <span>•</span>
                      <span>{content.likes || 0} likes</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewContent(content)}
                      >
                        View
                      </Button>
                      <SessionModerationActions session={content} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
