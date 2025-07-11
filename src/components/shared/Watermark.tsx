import { Link } from "react-router-dom";

interface WatermarkProps {
  username: string;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function Watermark({ 
  username, 
  className = "",
  position = "bottom-right" 
}: WatermarkProps) {
  const positionClasses = {
    "bottom-right": "bottom-2 right-2",
    "bottom-left": "bottom-2 left-2", 
    "top-right": "top-2 right-2",
    "top-left": "top-2 left-2"
  };

  const watermarkText = `www.eroxr.com/@${username}`;

  return (
    <div 
      className={`absolute ${positionClasses[position]} px-2 py-1 text-white/40 text-xs bg-black/20 backdrop-blur-sm rounded-md pointer-events-auto z-50 hover:text-white/60 hover:bg-black/30 transition-all duration-200 ${className}`}
      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
    >
      <Link 
        to={`/@${username}`}
        className="hover:underline font-medium"
        title="Visit Creator Profile"
      >
        {watermarkText}
      </Link>
    </div>
  );
}