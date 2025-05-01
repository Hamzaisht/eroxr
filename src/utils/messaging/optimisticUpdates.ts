
import { DirectMessage } from "@/integrations/supabase/types/message";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates an optimistic message object for immediate UI updates
 */
export const createOptimisticMessage = (
  senderId: string,
  recipientId: string,
  content?: string,
  mediaUrls?: string[],
  messageType: string = "text"
): DirectMessage => {
  const now = new Date().toISOString();
  const optimisticId = `optimistic-${uuidv4()}`;
  
  return {
    id: optimisticId,
    sender_id: senderId,
    recipient_id: recipientId,
    content: content || null,
    media_url: mediaUrls || null,
    message_type: messageType as any,
    delivery_status: "sending",
    created_at: now,
    updated_at: now,
    viewed_at: null,
    is_optimistic: true, // Custom flag to identify optimistic updates
  } as DirectMessage;
};

/**
 * Adds an optimistic message to the cache and returns functions to handle success/error
 */
export const useOptimisticMessaging = () => {
  const queryClient = useQueryClient();
  
  const addOptimisticMessage = (
    userId: string,
    recipientId: string, 
    message: DirectMessage
  ) => {
    console.log('Adding optimistic message to UI:', message.id);
    
    // Add to chat query
    queryClient.setQueryData(
      ["chat", userId, recipientId],
      (oldData: DirectMessage[] | undefined) => {
        if (!oldData) return [message];
        return [...oldData, message];
      }
    );
    
    // Update the conversations list too
    queryClient.invalidateQueries({
      queryKey: ["conversations", userId],
    });
    
    // Function to handle success
    const onSuccess = (newMessage: DirectMessage) => {
      console.log('Replacing optimistic message with real one:', message.id, '->', newMessage.id);
      
      queryClient.setQueryData(
        ["chat", userId, recipientId],
        (oldData: DirectMessage[] | undefined) => {
          if (!oldData) return [newMessage];
          // Replace optimistic message with real one
          return oldData.map((msg) => 
            msg.id === message.id ? newMessage : msg
          );
        }
      );
      
      // Also invalidate to ensure we're in sync with the server
      queryClient.invalidateQueries({
        queryKey: ["chat", userId, recipientId],
      });
    };
    
    // Function to handle error
    const onError = () => {
      console.log('Marking optimistic message as failed:', message.id);
      
      queryClient.setQueryData(
        ["chat", userId, recipientId],
        (oldData: DirectMessage[] | undefined) => {
          if (!oldData) return [];
          // Mark as error
          return oldData.map((msg) => 
            msg.id === message.id 
              ? { ...msg, delivery_status: "failed" } 
              : msg
          );
        }
      );
    };
    
    return { onSuccess, onError };
  };
  
  return { addOptimisticMessage };
};
