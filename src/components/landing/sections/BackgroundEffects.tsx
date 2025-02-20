
export const BackgroundEffects = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/20 blur-[100px] animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/80 via-luxury-dark/50 to-luxury-dark/80" />
    </>
  );
};
