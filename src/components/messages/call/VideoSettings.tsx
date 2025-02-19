
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, CameraOff, Camera } from "lucide-react";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoSettingsProps {
  onCameraSwitch: () => void;
  onFrameRateChange: (fps: number) => void;
  onBitrateChange: (bitrate: number) => void;
  availableCameras: MediaDeviceInfo[];
  currentCamera: string;
  onCameraSelect: (deviceId: string) => void;
}

export function VideoSettings({
  onCameraSwitch,
  onFrameRateChange,
  onBitrateChange,
  availableCameras,
  currentCamera,
  onCameraSelect
}: VideoSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const frameRates = [30, 60];
  const bitrates = [1000, 2000, 4000, 6000, 8000];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-all duration-300 hover:scale-110 hover:bg-luxury-primary/20"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-luxury-dark text-white">
        <DialogHeader>
          <DialogTitle>Video Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Camera</label>
            <div className="flex gap-2">
              <select
                className="flex-1 bg-luxury-darker rounded-md p-2 text-sm"
                value={currentCamera}
                onChange={(e) => onCameraSelect(e.target.value)}
              >
                {availableCameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId}`}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="icon"
                onClick={onCameraSwitch}
                className="hover:bg-luxury-primary/20"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frame Rate (FPS)</label>
            <select
              className="w-full bg-luxury-darker rounded-md p-2 text-sm"
              onChange={(e) => onFrameRateChange(Number(e.target.value))}
              defaultValue={30}
            >
              {frameRates.map((fps) => (
                <option key={fps} value={fps}>
                  {fps} FPS
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bitrate (Kbps)</label>
            <select
              className="w-full bg-luxury-darker rounded-md p-2 text-sm"
              onChange={(e) => onBitrateChange(Number(e.target.value))}
              defaultValue={4000}
            >
              {bitrates.map((rate) => (
                <option key={rate} value={rate}>
                  {rate} Kbps
                </option>
              ))}
            </select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
