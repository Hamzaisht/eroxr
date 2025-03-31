
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart, MessageSquare, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Post } from "@/components/profile/shorts/types";

interface ShortItemProps {
  short: Post;
  isOwner: boolean;
  onSelect: (short: Post) => void;
  onDelete: (shortId: string) => void;
}

export const ShortItem = ({ short, isOwner, onSelect, onDelete }: ShortItemProps) => {
  return (
    <motion.div
      key={short.id}
      className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(short)}
    >
      <img 
        src={short.video_thumbnail_url || short.video_urls?.[0] || "/placeholder.svg"} 
        alt={short.content}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Play className="w-12 h-12 text-white" fill="white" />
        </div>
        
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-sm">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>{short.likes_count}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>{short.comments_count}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{short.view_count || 0}</span>
          </div>
        </div>
      </div>
      
      {isOwner && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 rounded-full">
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete(short.id);
              }}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </motion.div>
  );
};
