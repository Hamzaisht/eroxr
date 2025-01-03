export const Hero = () => {
  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-soft-purple via-soft-pink to-soft-blue">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      <div className="container relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4">
        <div className="animate-fade-in space-y-6 text-center">
          <h1 className="max-w-4xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
            Connect with Your Favorite Creators
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-foreground/80 md:text-xl">
            Support amazing content creators and get exclusive access to their premium content.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary px-8 transition-all hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass-effect border-2 border-primary/20 px-8 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/40 hover:bg-primary/10"
            >
              Become a Creator
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};