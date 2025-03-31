
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./types";

export const useShortActions = (setShorts: React.Dispatch<React.SetStateAction<Post[]>>) => {
  const { toast } = useToast();

  const handleDelete = async (shortId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', shortId);
        
      if (error) throw error;
      
      setShorts(prev => prev.filter(short => short.id !== shortId));
      toast({
        title: "Short deleted",
        description: "Your short has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting short:', error);
      toast({
        title: "Error",
        description: "Failed to delete short",
        variant: "destructive",
      });
    }
  };

  return { handleDelete };
};
