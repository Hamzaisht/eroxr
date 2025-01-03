import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-24 text-white">
      <div className="container relative z-10">
        <h1 className="text-center text-5xl font-bold leading-tight md:text-6xl">
          Connect with Your Favorite Creators
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xl text-white/90">
          Support amazing content creators and get exclusive access to their premium content.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
            Join Now
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Become a Creator
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};