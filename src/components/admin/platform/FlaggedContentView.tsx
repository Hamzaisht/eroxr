import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pagination } from "./components/Pagination";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { FlaggedContent, SurveillanceContentItem } from "./surveillance/types";
import { SessionModerationActions } from "./surveillance/components/moderation/ModerationActions";

const PAGE_SIZE = 10;

export const FlaggedContentView = () => {
  const [flaggedContent, setFlaggedContent] = useState<SurveillanceContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchFlaggedContent();
  }, [currentPage, searchQuery]);
  
  const fetchFlaggedContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('flagged_content')
        .select('*, profiles(username, avatar_url)', { count: 'exact' })
        .eq('status', 'flagged')
        .order('flagged_at', { ascending: false });
        
      if (searchQuery) {
        query = query.ilike('reason', `%${searchQuery}%`);
      }
      
      const { data, error, count } = await query
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setTotalCount(count || 0);
      
      // Transform the data to SurveillanceContentItem
      const transformedData = (data || []).map(item => transformToSurveillanceItem(item));
      setFlaggedContent(transformedData);
      
    } catch (err: any) {
      console.error("Error fetching flagged content:", err.message);
      setError(err.message);
      toast({
        title: "Error fetching flagged content",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Fix the transformation to include all required SurveillanceContentItem fields
  const transformToSurveillanceItem = (item: any): SurveillanceContentItem => {
    return {
      id: item.id,
      content_type: item.content_type,
      created_at: item.created_at,
      user_id: item.user_id,
      creator_id: item.creator_id || item.user_id,
      username: item.username,
      creator_username: item.username || 'Unknown',
      avatar_url: item.avatar_url,
      creator_avatar_url: item.avatar_url,
      content: item.content,
      title: item.title || '',
      description: item.description || '',
      media_url: item.media_url || [],
      visibility: item.visibility || 'flagged',
      location: item.location || '',
      tags: item.tags || [],
      views: item.views || 0,
      likes: item.likes || 0,
      comments: item.comments || 0
    };
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Flagged Content</h1>
      
      <SearchFilterBar 
        placeholder="Search flagged content by reason..."
        onSearch={handleSearch}
      />
      
      {isLoading ? (
        <div className="text-center">Loading flagged content...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Content ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Flagged At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.id}</TableCell>
                    <TableCell>{content.content_type}</TableCell>
                    <TableCell>{content.description}</TableCell>
                    <TableCell>{new Date(content.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <SessionModerationActions session={content} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
