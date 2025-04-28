
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const CSSParticlesBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Don't render particles if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Simple CSS particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-luxury-primary/10"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 8 + 4}s infinite ease-in-out ${Math.random() * 2}s`,
            opacity: Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default CSSParticlesBackground;
