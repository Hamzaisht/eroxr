
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, X, Mic, Pause, Play, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
  maxDuration?: number; // In seconds
}

export const VoiceRecorder = ({ 
  onSend, 
  onCancel,
  maxDuration = 60 // Default max duration: 60 seconds 
}: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle recording start
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks after recording
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(200);
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Handle recording stop
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  // Handle recording pause
  const togglePause = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    if (isPaused) {
      // Resume recording
      mediaRecorderRef.current.resume();
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      // Pause recording
      mediaRecorderRef.current.pause();
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    setIsPaused(!isPaused);
  };
  
  // Handle audio playback
  const togglePlayback = () => {
    if (!audioRef.current || !audioBlob) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle send button click
  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Stop any tracks if component unmounts during recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);
  
  // Handle audio playback ended event
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      audioElement.addEventListener('ended', handleEnded);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current]);
  
  // Start recording automatically when component mounts
  useEffect(() => {
    startRecording();
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {/* Hidden audio element for playback */}
      {audioBlob && (
        <audio 
          ref={audioRef} 
          src={audioBlob ? URL.createObjectURL(audioBlob) : undefined} 
        />
      )}
      
      {/* Recording UI */}
      {isRecording && (
        <div className="flex items-center space-x-2 py-1.5 px-3 bg-luxury-primary/20 rounded-full">
          <div className={`h-2 w-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-xs whitespace-nowrap">{formatTime(recordingTime)}</span>
          
          {/* Pause/Resume button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-white/10"
            onClick={togglePause}
          >
            {isPaused ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </Button>
          
          {/* Stop button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-white/10"
            onClick={stopRecording}
          >
            <StopCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      
      {/* Playback UI */}
      {!isRecording && audioBlob && (
        <div className="flex items-center space-x-2 py-1.5 px-3 bg-luxury-primary/20 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-white/10"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          <span className="text-xs">{formatTime(recordingTime)}</span>
        </div>
      )}
      
      {/* Action buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-white/10"
        onClick={onCancel}
      >
        <X className="h-5 w-5" />
      </Button>
      
      {!isRecording && audioBlob && (
        <Button
          variant="default"
          size="icon"
          className="h-9 w-9 rounded-full bg-luxury-primary hover:bg-luxury-primary/90"
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
