
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isQueryError } from "@/utils/supabase/typeSafeOperations";

// Define types for database tables
type FlaggedContentRow = Database['public']['Tables']['flagged_content']['Row'];
type FlaggedContentKey = keyof FlaggedContentRow;

// Define safe interfaces for flagged content
interface FlaggedItem {
  id: string;
  content_id: string;
  content_type: string;
  reason: string;
  severity: string;
  status: string;
  reporter_name?: string;
  reporter_avatar?: string;
}

export const FlaggedContent = () => {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch flagged content with safe typing
  const fetchFlaggedContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if flagged_content table exists in schema
      const { data, error } = await supabase
        .from('flagged_content')
        .select(`
          id,
          content_id,
          content_type,
          reason,
          severity,
          status,
          flagged_by,
          profiles:flagged_by(username, avatar_url)
        `)
        .eq('status' as FlaggedContentKey, 'flagged' as any)
        .order('flagged_at' as FlaggedContentKey, { ascending: false });
      
      if (error) {
        console.error("Error fetching flagged content:", error);
        setError("Failed to load flagged content. The table might not exist or there was a query error.");
        setLoading(false);
        return;
      }

      // Check if data is valid
      if (!data) {
        console.error("Invalid data returned from flagged content query");
        setError("Failed to load flagged content: Invalid data format");
        setLoading(false);
        return;
      }
      
      // Safely transform data with proper type checking
      const safeItems: FlaggedItem[] = [];
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          // Skip if item is null or not an object
          if (!item || typeof item !== 'object') return;
          
          try {
            // Create safe item with type checking
            const flaggedItem: FlaggedItem = {
              id: String(item.id || ''),
              content_id: String(item.content_id || ''),
              content_type: String(item.content_type || ''),
              reason: String(item.reason || ''),
              severity: String(item.severity || 'medium'),
              status: String(item.status || 'flagged'),
              reporter_name: 'Anonymous',
              reporter_avatar: undefined
            };
            
            // Safely access profile data for the reporter
            if (item.profiles) {
              const profile = item.profiles;
              
              // Handle if profiles is an array
              if (Array.isArray(profile) && profile.length > 0) {
                flaggedItem.reporter_name = String(profile[0]?.username || 'Anonymous');
                flaggedItem.reporter_avatar = String(profile[0]?.avatar_url || undefined);
              } 
              // Handle if profiles is a direct object
              else if (typeof profile === 'object' && profile !== null) {
                flaggedItem.reporter_name = String((profile as any).username || 'Anonymous');
                flaggedItem.reporter_avatar = String((profile as any).avatar_url || undefined);
              }
            }
            
            safeItems.push(flaggedItem);
          } catch (e) {
            console.error("Error processing flagged content item:", e);
            // Skip problematic items but continue processing others
          }
        });
      }
      
      setFlaggedItems(safeItems);
    } catch (e) {
      console.error("Exception fetching flagged content:", e);
      setError("An unexpected error occurred while fetching flagged content.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ status: 'resolved' as FlaggedContentRow['status'] })
        .eq('id' as FlaggedContentKey, id as any);
      
      if (error) throw error;
      
      toast({
        title: "Content Resolved",
        description: "This flagged content has been marked as resolved."
      });
      
      fetchFlaggedContent();
    } catch (err) {
      console.error("Error resolving flagged content:", err);
      toast({
        title: "Error",
        description: "Failed to resolve flagged content.",
        variant: "destructive"
      });
    }
  };

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
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-luxury-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-8">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchFlaggedContent} 
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : flaggedItems.length === 0 ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">No flagged content to review at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedItems.map(item => (
                <Card key={item.id} className="bg-slate-800/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">Content Type: {item.content_type}</h4>
                        <p className="text-xs text-muted-foreground mt-1">ID: {item.content_id}</p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.severity === 'high' ? 'bg-red-900/30 text-red-300' : 
                            item.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-300' : 
                            'bg-blue-900/30 text-blue-300'
                          }`}>
                            {item.severity.toUpperCase()} Severity
                          </span>
                        </div>
                        <p className="mt-3 text-sm">Reason: {item.reason}</p>
                        <div className="flex items-center mt-3">
                          <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden mr-2">
                            {item.reporter_avatar ? (
                              <img src={item.reporter_avatar} alt="Reporter" className="w-6 h-6 object-cover" />
                            ) : null}
                          </div>
                          <span className="text-xs">Reported by: {item.reporter_name}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolve(item.id)}
                        >
                          Mark Resolved
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // View content implementation
                            toast({
                              title: "View Content",
                              description: `Viewing content with ID: ${item.content_id}`,
                            });
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
