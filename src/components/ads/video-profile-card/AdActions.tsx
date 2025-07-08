
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmDialog } from "@/components/feed/DeleteConfirmDialog";
import { DatingAd } from "../types/dating";

interface AdActionsProps {
  ad: DatingAd;
}

export const AdActions = ({ ad }: AdActionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const isOwner = session?.user?.id === ad.user_id;
  
  if (!isOwner) return null;
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // Delete the ad from the database
      const { error } = await supabase
        .from('dating_ads')
        .delete()
        .eq('id', ad.id)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Ad deleted",
        description: "Your ad has been successfully removed.",
      });
      
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["dating_ads"] });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError("Failed to delete ad. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // For now, show a toast indicating edit functionality will be available
    toast({
      title: "Edit functionality",
      description: "Edit functionality will be available soon!",
    });
  };

  const handleRetryDelete = () => {
    setDeleteError(null);
    handleDelete();
  };

  return (
    <>
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70">
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-luxury-darker/95 backdrop-blur-md border-luxury-primary/20">
            <DropdownMenuItem onClick={handleEdit} className="text-luxury-neutral hover:text-white">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-400 hover:text-red-300">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        error={deleteError}
        onRetry={handleRetryDelete}
      />
    </>
  );
};
