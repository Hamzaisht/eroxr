import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlaggedItem {
  id: string;
  content_id: string;
  content_type: string;
  reason: string;
  status: string;
  flagged_at: string;
  severity: string;
  user_id?: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
}

export const FlaggedContent = () => {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFlaggedContent = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('flagged_content')
        .select(`
          *,
          user:user_id(username, avatar_url)
        `);
      
      if (activeTab !== "all") {
        query = query.eq('status', activeTab);
      }
      
      const { data, error } = await query.order('flagged_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const typedItems: FlaggedItem[] = data.map(item => ({
          id: item.id,
          content_id: item.content_id,
          content_type: item.content_type,
          reason: item.reason,
          status: item.status,
          flagged_at: item.flagged_at,
          severity: item.severity,
          user_id: item.user_id,
          user: item.user ? {
            username: item.user.username,
            avatar_url: item.user.avatar_url
          } : undefined
        }));
        
        setItems(typedItems);
      }
    } catch (error) {
      console.error("Error fetching flagged content:", error);
      toast({
        title: "Error",
        description: "Could not load flagged content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedContent();
  }, [activeTab]);

  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      ));

      toast({
        title: "Success",
        description: `Content status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating content status:", error);
      toast({
        title: "Error",
        description: "Could not update content status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Flagged Content</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="removed">Removed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-luxury-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="ml-2">Loading flagged content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.length === 0 ? (
            <Card className="p-4 text-center">
              No flagged content found.
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{item.content_type}</h3>
                    <p className="text-sm text-muted-foreground">
                      Reason: {item.reason}
                    </p>
                    {item.user && (
                      <p className="text-sm text-muted-foreground">
                        User: {item.user.username}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {item.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(item.id, "reviewed")}
                        >
                          Mark as Reviewed
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusUpdate(item.id, "removed")}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                    {item.status === "reviewed" && (
                      <Badge variant="secondary">Reviewed</Badge>
                    )}
                    {item.status === "removed" && (
                      <Badge variant="destructive">Removed</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FlaggedContent;
