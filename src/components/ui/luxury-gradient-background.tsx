import { memo } from 'react';

interface LuxuryGradientBackgroundProps {
  className?: string;
}

export const LuxuryGradientBackground = memo(({ className = "" }: LuxuryGradientBackgroundProps) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* Static gradient background - no animation to improve performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
      
      {/* CSS-only animated gradient orbs for better performance */}
      <div className="absolute inset-0 animate-pulse">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: "radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: "radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-8"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
          }}
        />
      </div>
      
      {/* Static luxury mesh pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
});