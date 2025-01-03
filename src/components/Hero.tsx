import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
      duration: 3000,
    });
    navigate("/login");
  };

  const handleBecomeCreator = () => {
    toast({
      title: "Creator Program",
      description: "Thanks for your interest in becoming a creator! We'll be in touch soon.",
      duration: 3000,
    });
  };

  if (!session) {
    return null;
  }

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
              onClick={handleSignOut}
            >
              <span className="relative z-10">Sign Out</span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass-effect border-2 border-primary/20 px-8 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/40 hover:bg-primary/10"
              onClick={handleBecomeCreator}
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