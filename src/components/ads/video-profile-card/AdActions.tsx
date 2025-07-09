
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
import { useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmDialog } from "@/components/feed/DeleteConfirmDialog";
import { EditAdDialog } from "../create-ad/EditAdDialog";
import { DatingAd } from "../types/dating";
import { useInstantFeedback } from "@/hooks/useInstantFeedback";

interface AdActionsProps {
  ad: DatingAd;
}

export const AdActions = ({ ad }: AdActionsProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { withInstantFeedback } = useInstantFeedback();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const isOwner = session?.user?.id === ad.user_id;
  
  if (!isOwner) return null;
  
  const handleDelete = async () => {
    await withInstantFeedback(
      async () => {
        // Optimistic update - remove from UI immediately
        queryClient.setQueryData(['dating_ads'], (oldData: DatingAd[] = []) => {
          return oldData.filter(item => item.id !== ad.id);
        });

        // Perform actual deletion
        const { error } = await supabase
          .from('dating_ads')
          .delete()
          .eq('id', ad.id)
          .eq('user_id', session?.user?.id);
        
        if (error) throw error;
        
        // Invalidate queries to sync with server
        queryClient.invalidateQueries({ queryKey: ["dating_ads"] });
      },
      {
        successMessage: "Your ad has been deleted successfully",
        errorMessage: "Failed to delete ad. Please try again.",
        showInstantSuccess: true,
        onError: () => {
          // Revert optimistic update on error
          queryClient.invalidateQueries({ queryKey: ["dating_ads"] });
        }
      }
    );
    
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["dating_ads"] });
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
        isDeleting={false}
        error={deleteError}
        onRetry={handleDelete}
      />

      <EditAdDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        ad={ad}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};
