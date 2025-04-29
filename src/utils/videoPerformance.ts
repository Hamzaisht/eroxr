
type PerformanceCallback = (metrics: VideoPerformanceMetrics) => void;

interface VideoPerformanceMetrics {
  buffering: number; // Time spent buffering in ms
  loadTime: number;  // Initial load time in ms
  droppedFrames: number;
  resolution: string;
  playbackRate: number;
  currentBitrate?: number;
  networkState: number;
  readyState: number;
}

/**
 * Monitor video performance metrics to help optimize playback
 */
export const monitorVideoPerformance = (
  videoElement: HTMLVideoElement, 
  callback?: PerformanceCallback
): (() => void) => {
  if (!videoElement) return () => {};
  
  let bufferingStartTime: number | null = null;
  let totalBufferingTime = 0;
  let loadStartTime = performance.now();
  let isFirstPlay = true;
  
  const getMetrics = (): VideoPerformanceMetrics => {
    // Get video resolution
    const width = videoElement.videoWidth || 0;
    const height = videoElement.videoHeight || 0;
    const resolution = `${width}x${height}`;
    
    // Create metrics object
    return {
      buffering: totalBufferingTime,
      loadTime: isFirstPlay ? performance.now() - loadStartTime : 0,
      droppedFrames: 0, // Not directly available in standard API
      resolution,
      playbackRate: videoElement.playbackRate,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState
    };
  };
  
  // Event handlers
  const handleWaiting = () => {
    if (bufferingStartTime === null) {
      bufferingStartTime = performance.now();
    }
  };
  
  const handlePlaying = () => {
    if (bufferingStartTime !== null) {
      totalBufferingTime += performance.now() - bufferingStartTime;
      bufferingStartTime = null;
    }
    
    if (isFirstPlay) {
      isFirstPlay = false;
      
      if (callback) {
        callback(getMetrics());
      }
    }
  };
  
  const handleTimeUpdate = () => {
    // Periodically report metrics
    if (!isFirstPlay && callback && videoElement.currentTime % 10 < 0.5) {
      callback(getMetrics());
    }
  };
  
  // Register event listeners
  videoElement.addEventListener('waiting', handleWaiting);
  videoElement.addEventListener('playing', handlePlaying);
  videoElement.addEventListener('timeupdate', handleTimeUpdate);
  
  // Return cleanup function
  return () => {
    videoElement.removeEventListener('waiting', handleWaiting);
    videoElement.removeEventListener('playing', handlePlaying);
    videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  };
};
