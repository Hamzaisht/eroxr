
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-mobile";

interface PostMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PostMenu = ({ onEdit, onDelete }: PostMenuProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size={isMobile ? "icon" : "sm"} 
                className="hover:bg-luxury-neutral/10 rounded-full"
              >
                <MoreHorizontal className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-luxury-darker/95 backdrop-blur-md border-luxury-primary/20"
            >
              <DropdownMenuItem 
                onClick={onEdit}
                className="text-luxury-neutral hover:text-white cursor-pointer py-2.5 px-3 focus:bg-luxury-primary/10"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                <span className={isMobile ? "text-sm" : "text-base"}>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-red-500 hover:text-red-300 focus:text-red-300 cursor-pointer py-2.5 px-3 focus:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span className={isMobile ? "text-sm" : "text-base"}>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
        >
          <p>Post options</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
