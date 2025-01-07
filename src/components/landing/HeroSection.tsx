import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Star } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate("/login");
    if (!session) {
      toast({
        title: "Join Our Community",
        description: "Create your account to get started!",
      });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-luxury-dark py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="absolute inset-0 bg-luxury-gradient opacity-30" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/20 blur-3xl"
      />
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-[64rem] text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-luxury-primary/20 bg-luxury-darker/50 px-4 py-2 backdrop-blur-sm"
          >
            <Star className="h-4 w-4 text-luxury-primary" />
            <span className="text-sm text-luxury-neutral">Join the Top 1% of Creators</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-r from-luxury-neutral via-luxury-primary to-luxury-accent bg-clip-text text-4xl font-bold text-transparent sm:text-6xl"
          >
            Connect with Your Fans
            <br />
            <span className="text-luxury-primary">Monetize Your Passion</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-luxury-neutral/80 sm:text-xl"
          >
            Join the exclusive platform where creators thrive. Share content,
            <br className="hidden sm:inline" />
            build your community, and earn what you deserve.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="group relative w-full overflow-hidden rounded-full bg-button-gradient px-8 sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Creating Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0.4 }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { value: "10K+", label: "Creators" },
              { value: "$1M+", label: "Earned" },
              { value: "2M+", label: "Fans" },
              { value: "150+", label: "Countries" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="rounded-xl border border-luxury-primary/10 bg-luxury-darker/50 p-4 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-luxury-primary">{stat.value}</div>
                <div className="text-sm text-luxury-neutral/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Preview Image */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 rounded-xl border border-luxury-primary/10 bg-luxury-darker/50 p-4 backdrop-blur-sm"
          >
            <img
              src="/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png"
              alt="Platform Preview"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};