
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

interface DebugInfoProps {
  uploadState: {
    isUploading: boolean;
    progress: number;
    error: string | null;
    isComplete: boolean;
  };
  fileInfo: {
    name?: string;
    type?: string;
    size?: number;
  } | null;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  uploadState,
  fileInfo
}) => {
  const [showDebug, setShowDebug] = useState(false);
  
  if (!showDebug) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground"
        onClick={() => setShowDebug(true)}
      >
        <Bug className="h-3 w-3 mr-1" />
        Debug
      </Button>
    );
  }
  
  return (
    <div className="mt-4 p-2 border rounded text-xs font-mono bg-muted/20">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Debug Info</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs h-5 px-1"
          onClick={() => setShowDebug(false)}
        >
          Hide
        </Button>
      </div>
      
      <div className="space-y-1">
        <p>Upload State: {uploadState.isUploading ? 'Uploading' : uploadState.isComplete ? 'Complete' : 'Idle'}</p>
        <p>Progress: {uploadState.progress}%</p>
        {uploadState.error && <p className="text-destructive">Error: {uploadState.error}</p>}
        {fileInfo && (
          <>
            <p>File: {fileInfo.name}</p>
            <p>Type: {fileInfo.type}</p>
            <p>Size: {fileInfo.size} bytes</p>
          </>
        )}
      </div>
    </div>
  );
};
