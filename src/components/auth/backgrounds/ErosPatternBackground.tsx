
import { useEffect, useState } from "react";
import { BackgroundGradients } from "./components/BackgroundGradients";
import { InteractiveGreekPattern } from "./components/InteractiveGreekPattern";

export const ErosPatternBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Background gradients layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <BackgroundGradients />
      </div>
      
      {/* Interactive Greek pattern layer - covers entire viewport */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <InteractiveGreekPattern />
      </div>
    </>
  );
};
