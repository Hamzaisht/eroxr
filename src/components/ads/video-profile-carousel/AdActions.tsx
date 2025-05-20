
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { DatingAd } from '../types/dating';

interface AdActionsProps {
  ad: DatingAd;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AdActions = ({ ad, onEdit, onDelete }: AdActionsProps) => {
  const session = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if this ad belongs to the current user
  const isOwner = session?.user?.id === ad.user_id;
  
  if (!isOwner) {
    return null;
  }
  
  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="absolute top-3 left-3 z-30">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon"
            variant="ghost"
            className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black/90 border-luxury-primary/20 text-white backdrop-blur-lg">
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-luxury-primary/20"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-red-900/30 text-red-400"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
