
import React, { useState } from "react";
import { SurveillanceContentItem } from "@/types/surveillance";
import { ModerationAction } from "@/types/moderation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchFilterBar, SearchFilter } from "./SearchFilterBar";
import { FileText, Video, Music, Image, Clock, Info, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SessionModerationActions } from "../components/moderation/ModerationActions";

interface ContentSurveillanceListProps {
  contentItems: SurveillanceContentItem[];
  isLoading: boolean;
  error: Error | null;
  onShowPreview?: (content: SurveillanceContentItem) => void;
  onModerate?: (content: SurveillanceContentItem, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress?: string | null;
  contentType: string;
}

export const ContentSurveillanceList = ({
  contentItems = [],
  isLoading,
  error,
  onShowPreview,
  onModerate,
  actionInProgress,
  contentType
}: ContentSurveillanceListProps) => {
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({ query: '' });
  
  const getContentTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'post':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'video':
        return <Video className="h-4 w-4 text-red-400" />;
      case 'audio':
        return <Music className="h-4 w-4 text-purple-400" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-400" />;
      case 'story':
        return <Clock className="h-4 w-4 text-amber-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const handleSearch = (filter: SearchFilter) => {
    setSearchFilter(filter);
  };
  
  const handleRefresh = () => {
    // Refresh functionality would be added here
    console.log('Refreshing content surveillance list');
  };
  
  // Format timestamp to readable date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get truncated text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
        </h2>
        <SearchFilterBar
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          placeholder={`Search ${contentType}...`}
        />
      </div>
      
      <Card className="p-0 bg-black/20 border-white/10">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Creator</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-500">
                    Error loading content: {error.message}
                  </TableCell>
                </TableRow>
              ) : contentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No {contentType} found
                  </TableCell>
                </TableRow>
              ) : (
                contentItems.map(item => (
                  <TableRow key={item.id} className="hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.creator_avatar_url || item.avatar_url} />
                          <AvatarFallback>
                            {(item.creator_username || item.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {item.creator_username || item.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {getContentTypeIcon(item.content_type)}
                        <div>
                          <p className="text-sm font-medium line-clamp-1">
                            {item.title || truncateText(item.content, 20)}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {truncateText(item.description || item.content, 30)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">
                        {formatDate(item.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.visibility === 'public' ? 'default' : 
                        item.visibility === 'private' ? 'secondary' : 
                        'outline'
                      }>
                        {item.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onShowPreview && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => onShowPreview(item)}
                          >
                            Preview
                          </Button>
                        )}
                        
                        {onModerate && (
                          <SessionModerationActions session={item} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
