
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
    message_type: messageType,
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
    };
    
    // Function to handle error
    const onError = () => {
      queryClient.setQueryData(
        ["chat", userId, recipientId],
        (oldData: DirectMessage[] | undefined) => {
          if (!oldData) return [];
          // Mark as error or remove
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
