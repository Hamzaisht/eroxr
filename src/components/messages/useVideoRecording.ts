import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVideoRecording = (recipientId: string, onSuccess: () => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

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
            sender_id: (await supabase.auth.getUser()).data.user?.id,
            recipient_id: recipientId,
            video_url: publicUrl,
            message_type: 'video',
            duration: Math.ceil(blob.size / 75000),
          },
        ]);

      if (messageError) throw messageError;

      onSuccess();
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

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};