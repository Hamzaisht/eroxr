import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Reply, Forward, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface MessageActionsProps {
  messageId: string;
  messageContent: string;
  isOwnMessage: boolean;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

export const MessageActions = ({ 
  messageId, 
  messageContent, 
  isOwnMessage,
  onEdit,
  onDelete 
}: MessageActionsProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageContent);
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    });
  };

  const handleEdit = () => {
    onEdit(messageId, messageContent);
  };

  const handleDelete = () => {
    onDelete(messageId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all duration-200">
          <MoreVertical className="w-4 h-4 text-white/60 hover:text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/10 backdrop-blur-xl border border-white/20 text-white min-w-40"
      >
        <DropdownMenuItem 
          onClick={handleCopy}
          className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </DropdownMenuItem>
        
        {isOwnMessage && (
          <>
            <DropdownMenuItem 
              onClick={handleEdit}
              className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};