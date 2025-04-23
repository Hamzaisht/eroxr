
import React, { useState, useEffect } from 'react';
import { Mic, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
  const [recording, setRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // Start recording when component mounts
  useEffect(() => {
    startRecording();
    
    // Clean up on component unmount
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Update recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (recording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Clear previous audio chunks
      setAudioChunks([]);
      
      // Start recording
      recorder.start();
      setRecording(true);
      
      // Handle data available event
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      });
      
      // Handle recording stop event
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Don't auto-send here, wait for user to click send
      });
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      onCancel();
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const handleSend = () => {
    stopRecording();
    
    // Create audio blob from chunks
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    onSend(audioBlob);
  };
  
  const handleCancel = () => {
    stopRecording();
    onCancel();
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center space-x-2 bg-muted/30 rounded-full px-3 py-1">
      <div className="flex items-center">
        <Mic className="h-5 w-5 text-red-500 animate-pulse" />
        <span className="ml-2 text-sm font-medium">{formatTime(recordingDuration)}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-red-500/20"
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-green-500/20"
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
