
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PostMenu = ({ onEdit, onDelete }: PostMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-luxury-neutral/10">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-luxury-darker/95 backdrop-blur-md border-luxury-primary/20">
        <DropdownMenuItem 
          onClick={onEdit}
          className="text-luxury-neutral hover:text-white cursor-pointer"
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete} 
          className="text-red-500 hover:text-red-300 focus:text-red-300 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
