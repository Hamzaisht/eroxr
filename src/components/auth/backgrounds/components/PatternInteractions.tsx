
import { useState, useCallback, useEffect } from "react";

interface PatternInteractionsProps {
  onScaleChange: (scale: number) => void;
  onMousePositionChange: (position: { x: number; y: number }) => void;
}

export const usePatternInteractions = ({ onScaleChange, onMousePositionChange }: PatternInteractionsProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [holdDuration, setHoldDuration] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    onMousePositionChange({ x: e.clientX, y: e.clientY });
  }, [onMousePositionChange]);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
    setPressStartTime(Date.now());
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    setPressStartTime(null);
    setHoldDuration(0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
    setPressStartTime(null);
    setHoldDuration(0);
  }, []);

  // Update hold duration while pressed
  useEffect(() => {
    if (isPressed && pressStartTime) {
      const interval = setInterval(() => {
        setHoldDuration(Date.now() - pressStartTime);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPressed, pressStartTime]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Calculate scale based on hold duration (max 2.5x scale after 2 seconds)
  const scale = isPressed 
    ? Math.min(1 + (holdDuration / 1500), 2.5) 
    : 1;

  useEffect(() => {
    onScaleChange(scale);
  }, [scale, onScaleChange]);

  return {
    isPressed,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave
  };
};
