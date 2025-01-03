import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-soft-purple py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
      <div className="container relative z-10 flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="max-w-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-5xl font-bold leading-tight text-transparent md:text-7xl">
          Connect with Your Favorite Creators
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xl text-foreground/80">
          Support amazing content creators and get exclusive access to their premium content.
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary px-8 transition-all hover:scale-105"
          >
            <span className="relative z-10">Join Now</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary px-8 text-primary transition-all hover:scale-105 hover:bg-primary hover:text-white"
          >
            Become a Creator
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
  );
};