
import React from "react";

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Lightweight gradient background only */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark opacity-90" />
    </div>
  );
};
