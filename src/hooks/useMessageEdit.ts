
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DirectMessage } from "@/integrations/supabase/types/message";

interface MessageUpdateData {
  content: string;
  updated_at: string;
  original_content?: string;
}

export const useMessageEdit = (message: DirectMessage) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setIsEditing(true);
    setEditedContent(message.content || "");
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleEdit = async () => {
    if (!editedContent.trim()) return;
    
    try {
      setIsUpdating(true);
      
      const updateData: MessageUpdateData = {
        content: editedContent.trim(),
        updated_at: new Date().toISOString()
      };

      if (!message.original_content) {
        updateData.original_content = message.content;
      }

      const { error } = await supabase
        .from('direct_messages')
        .update(updateData)
        .eq('id', message.id);

      if (error) throw error;

      setIsEditing(false);
      
      toast({
        description: "Message updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        description: "Failed to update message",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditing,
    editedContent,
    isUpdating,
    inputRef,
    setEditedContent,
    startEditing,
    cancelEditing,
    handleEdit
  };
};
