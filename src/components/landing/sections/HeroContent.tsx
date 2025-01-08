import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

export const HeroContent = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (session) {
      navigate("/home");
    } else {
      navigate("/login");
      toast({
        title: "Welcome!",
        description: "Create your account to get started.",
      });
    }
  };

  return (
    <div className="relative z-10 mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[64rem] text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-2 mb-4"
        >
          <span className="px-4 py-2 rounded-full bg-luxury-primary/10 text-luxury-primary text-sm font-medium">
            Join Our Community
          </span>
        </motion.div>

        <h1 className="bg-gradient-to-r from-luxury-neutral via-luxury-primary to-luxury-accent bg-clip-text text-4xl font-bold text-transparent sm:text-6xl md:text-7xl">
          Connect with Amazing Creators
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-luxury-neutral/80 md:text-xl">
          Join a thriving community of passionate creators and their dedicated fans.
          Share exclusive content, engage with your audience, and grow your following.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="group relative w-full overflow-hidden rounded-full bg-button-gradient px-8 py-6 text-lg sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/about")}
            className="w-full rounded-full border-luxury-primary/20 px-8 py-6 text-lg backdrop-blur-sm sm:w-auto"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};