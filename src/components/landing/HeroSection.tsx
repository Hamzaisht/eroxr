import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Shield, Users, Lock } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (!session) {
      navigate("/login");
      toast({
        title: "Join Our Community",
        description: "Create your account to get started!",
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-luxury-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark opacity-90" />
      
      {/* Animated Background Orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/20 blur-3xl"
      />

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-32">
        <div className="mx-auto max-w-[64rem] text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="bg-gradient-to-r from-luxury-neutral via-luxury-primary to-luxury-accent bg-clip-text text-5xl font-bold text-transparent sm:text-7xl md:text-8xl">
              Connect with Verified Members
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-luxury-neutral/80">
              A secure and private platform for open-minded adults to connect and meet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                className="w-full rounded-full border-luxury-primary/20 px-8 py-6 text-lg backdrop-blur-sm sm:w-auto"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {[
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your privacy and security are our top priorities."
              },
              {
                icon: Lock,
                title: "Verified Members",
                description: "All members are verified for your safety."
              },
              {
                icon: Users,
                title: "Active Community",
                description: "Connect with like-minded individuals."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-primary/10 to-luxury-accent/5 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-luxury-primary/10">
                    <feature.icon className="h-6 w-6 text-luxury-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-luxury-neutral">
                    {feature.title}
                  </h3>
                  <p className="text-luxury-neutral/60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};