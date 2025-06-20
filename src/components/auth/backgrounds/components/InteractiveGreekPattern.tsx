
import { useState, useCallback } from "react";
import { PatternSVG } from "./PatternSVG";
import { usePatternInteractions } from "./PatternInteractions";
import { BackgroundPattern } from "./BackgroundPattern";
import { GlowEffect } from "./GlowEffect";

export const InteractiveGreekPattern = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const handleScaleChange = useCallback((newScale: number) => {
    setScale(newScale);
  }, []);

  const handleMousePositionChange = useCallback((position: { x: number; y: number }) => {
    setMousePosition(position);
  }, []);

  const { isPressed, handleMouseDown, handleMouseUp, handleMouseLeave } = usePatternInteractions({
    onScaleChange: handleScaleChange,
    onMousePositionChange: handleMousePositionChange
  });

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto overflow-hidden flex items-center justify-center">
      {/* Main central pattern that circles around the login container */}
      <PatternSVG
        scale={scale}
        mousePosition={mousePosition}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />

      {/* Larger background pattern for depth - 2x size with subtler animation */}
      <BackgroundPattern />

      {/* Elegant glow effect when pressed */}
      <GlowEffect isPressed={isPressed} />
    </div>
  );
};
