
import React from "react";

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark opacity-90" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
    </div>
  );
};
