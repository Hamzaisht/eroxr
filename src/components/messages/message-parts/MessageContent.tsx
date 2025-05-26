
import React from 'react';
import { Message } from "@/integrations/supabase/types/messages";

interface MessageContentProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageContent = ({ message, isCurrentUser }: MessageContentProps) => {
  return (
    <div className="flex flex-col w-full">
      {message.text && (
        <p className="text-sm text-gray-100 break-words">{message.text}</p>
      )}
    </div>
  );
};
