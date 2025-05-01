
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DirectMessage } from "@/integrations/supabase/types/message";

export function useMessageEdit(message: DirectMessage) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditedContent(message.content || "");
    // Focus the input after it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [message.content]);
  
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditedContent(message.content || "");
  }, [message.content]);
  
  const handleEdit = useCallback(async () => {
    if (!editedContent.trim() || !message.id) return;
    
    // Don't update if content didn't change
    if (editedContent === message.content) {
      setIsEditing(false);
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({
          content: editedContent.trim(),
          original_content: message.content || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', message.id);
      
      if (error) throw error;
      
      // Update successful
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error editing message:', error);
      toast({
        title: "Failed to edit message",
        description: error.message || "An error occurred while editing your message",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  }, [editedContent, message.content, message.id, toast]);
  
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
}
