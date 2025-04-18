
import { useState, useRef, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { DirectMessage } from '@/integrations/supabase/types/message';
import { useToast } from './use-toast';

export function useMessageEdit(message: DirectMessage) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();
  
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditedContent(message.content || '');
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [message.content]);
  
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  const handleEdit = useCallback(async () => {
    if (!session?.user?.id || session.user.id !== message.sender_id || !editedContent.trim()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({
          content: editedContent.trim(),
          original_content: message.original_content || message.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', message.id);
        
      if (error) {
        throw error;
      }
      
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating message:', err);
      toast({
        title: "Failed to update message",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [session, message, editedContent, toast]);
  
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
