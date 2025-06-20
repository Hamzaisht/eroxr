
import { useEffect, useState } from "react";
import { BackgroundGradients } from "./components/BackgroundGradients";
import { MouseFollowingGlow } from "./components/MouseFollowingGlow";
import { GreekPatternSVG } from "./components/GreekPatternSVG";
import { ErosSymbols } from "./components/ErosSymbols";
import { FloatingGeometrics } from "./components/FloatingGeometrics";
import { PulsingRings } from "./components/PulsingRings";
import { ParticleSystem } from "./components/ParticleSystem";
import { AmbientLightStreaks } from "./components/AmbientLightStreaks";

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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <BackgroundGradients />
      <MouseFollowingGlow mousePosition={mousePosition} />
      <GreekPatternSVG />
      <ErosSymbols />
      <FloatingGeometrics />
      <PulsingRings />
      <ParticleSystem />
      <AmbientLightStreaks />
    </div>
  );
};
