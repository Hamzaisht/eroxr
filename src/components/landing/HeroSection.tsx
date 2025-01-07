import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (session) {
      navigate("/profile");
    } else {
      navigate("/login");
      toast({
        title: "Welcome!",
        description: "Create your account to get started.",
      });
    }
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-luxury-gradient py-20 lg:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative">
        <div className="mx-auto max-w-[64rem] text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-luxury-neutral to-luxury-primary bg-clip-text text-4xl font-bold text-transparent sm:text-6xl"
          >
            Turn Your Passion Into a Thriving Business
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-luxury-neutral/80 sm:text-xl"
          >
            Join thousands of successful creators who are building their empire, 
            connecting with passionate fans, and earning from what they love.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row justify-center"
          >
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-button-gradient hover:bg-hover-gradient text-white group relative overflow-hidden"
            >
              <span className="relative z-10">Get Started Now</span>
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
              onClick={handleLearnMore}
              className="border-luxury-neutral text-luxury-neutral hover:bg-luxury-neutral/10"
            >
              Learn More
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50 p-8 backdrop-blur-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Platform Preview"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};