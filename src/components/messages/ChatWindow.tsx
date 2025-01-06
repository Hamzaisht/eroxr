import { useState, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Video, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VideoMessage } from "./VideoMessage";

interface ChatWindowProps {
  recipientId: string;
}

export const ChatWindow = ({ recipientId }: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ['chat', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(username, avatar_url)
        `)
        .or(`and(sender_id.eq.${session?.user?.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session?.user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!recipientId,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([
          {
            sender_id: session?.user?.id,
            recipient_id: recipientId,
            content,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendVideoMessage = async (blob: Blob) => {
    try {
      const fileName = `${crypto.randomUUID()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      const { error: messageError } = await supabase
        .from('direct_messages')
        .insert([
          {
            sender_id: session?.user?.id,
            recipient_id: recipientId,
            video_url: publicUrl,
            message_type: 'video',
            duration: Math.ceil(blob.size / 75000), // Rough estimate of duration in seconds
          },
        ]);

      if (messageError) throw messageError;

      queryClient.invalidateQueries({ queryKey: ['chat', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });

      toast({
        title: "Success",
        description: "Video message sent successfully",
      });
    } catch (error) {
      console.error('Error sending video message:', error);
      toast({
        title: "Error",
        description: "Failed to send video message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        stream.getTracks().forEach(track => track.stop());
        sendVideoMessage(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Automatically stop recording after 60 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 60000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to access camera. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === session?.user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender_id === session?.user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.message_type === 'video' ? (
                  <VideoMessage
                    messageId={msg.id}
                    videoUrl={msg.video_url}
                    isViewed={!!msg.viewed_at}
                    onView={() => {}}
                  />
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Camera className="h-4 w-4 animate-pulse" />
            ) : (
              <Video className="h-4 w-4" />
            )}
          </Button>
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};