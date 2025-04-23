
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Trash2, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export const VoiceRecorder = ({ onSend, onCancel }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  
  // Clean up function
  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setIsRecording(false);
      };
      
      // Start the recorder
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Restart timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };
  
  const playRecording = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.play();
      setIsPlaying(true);
    }
  };
  
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const handleSendAudio = () => {
    if (audioBlob) {
      onSend(audioBlob);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-2 bg-luxury-dark-secondary border-t border-luxury-neutral/10">
      <div className="flex items-center space-x-2">
        {!audioBlob ? (
          // Recording state
          <>
            {isRecording ? (
              <>
                <div className="flex-1 flex items-center space-x-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    isPaused ? "bg-amber-500" : "bg-red-500 animate-pulse"
                  )}></div>
                  <span className="text-xs text-white/70">
                    {formatTime(recordingTime)}
                  </span>
                  <div className="flex-1 h-7 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full bg-gradient-to-r from-luxury-primary/40 to-luxury-primary/70",
                        !isPaused && "animate-pulse"
                      )}
                      style={{ width: `${Math.min((recordingTime / 120) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {isPaused ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={resumeRecording}
                      className="h-8 w-8 rounded-full"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={pauseRecording}
                      className="h-8 w-8 rounded-full"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    onClick={stopRecording}
                    className="h-8 w-8 bg-luxury-primary text-white rounded-full hover:bg-luxury-primary/80"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 flex items-center">
                  <span className="text-sm text-white/70">
                    Record voice message
                  </span>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={startRecording}
                  className="h-8 w-8 rounded-full"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={onCancel}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          // Playback state
          <>
            <div className="flex-1 flex items-center space-x-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={isPlaying ? stopPlayback : playRecording}
                className="h-8 w-8 rounded-full"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <span className="text-xs text-white/70">
                {formatTime(recordingTime)}
              </span>
              <div className={cn(
                "flex-1 h-4 bg-black/20 rounded-full overflow-hidden voice-waveform",
                isPlaying && "playing"
              )}></div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  setAudioBlob(null);
                  setRecordingTime(0);
                  stopPlayback();
                }}
                className="h-8 w-8 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                onClick={handleSendAudio}
                className="h-8 w-8 bg-luxury-primary text-white rounded-full hover:bg-luxury-primary/80"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
