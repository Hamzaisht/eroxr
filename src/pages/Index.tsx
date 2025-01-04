import { useSession } from "@supabase/auth-helpers-react";
import { Hero } from "@/components/Hero";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { SubscribedCreators } from "@/components/SubscribedCreators";

const Index = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Hero />
      
      {session?.user && (
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-soft-purple/50 to-soft-pink/30" />
          <div className="container relative z-10">
            <div className="animate-fade-in space-y-6 text-center">
              <h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Your Subscriptions
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-foreground/70">
                Stay updated with your favorite creators
              </p>
            </div>
            <div className="mt-16">
              <SubscribedCreators />
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        </section>
      )}

      <FeaturedCreators />
    </div>
  );
};

export default Index;