
export const BackgroundEffects = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-10" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-luxury-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-luxury-accent/20 blur-[120px] animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/90 via-luxury-dark/70 to-luxury-dark/90" />
    </>
  );
};
