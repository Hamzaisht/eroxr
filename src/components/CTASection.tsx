import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CTASection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate("/login");
    toast({
      title: "Welcome!",
      description: "Let's begin your creator journey!",
    });
  };

  const handleContactSales = () => {
    toast({
      title: "Thanks for your interest!",
      description: "Our team will contact you shortly.",
    });
  };

  return (
    <section className="py-20 lg:py-32 bg-luxury-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg border border-luxury-neutral/10 bg-luxury-gradient p-8 text-center backdrop-blur-xl sm:p-16"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="absolute inset-0 bg-luxury-primary/5 rounded-lg blur-xl"
          />
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center gap-2 mb-4"
            >
              <Sparkles className="w-6 h-6 text-luxury-primary animate-pulse" />
              <span className="text-luxury-primary font-semibold">Limited Time Offer</span>
            </motion.div>

            <h2 className="text-3xl font-bold text-luxury-neutral sm:text-4xl mb-4">
              Start Your Success Story Today!
            </h2>
            <p className="mt-4 text-luxury-neutral/80 sm:text-lg max-w-2xl mx-auto">
              Join now and get <span className="text-luxury-primary font-semibold">30 days free</span> access 
              to premium creator tools. Build your community, share your passion, and start earning!
            </p>
            
            <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-button-gradient hover:bg-hover-gradient text-white group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Star className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                  Get Started Now
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
                onClick={handleContactSales}
                className="border-luxury-neutral text-luxury-neutral hover:bg-luxury-neutral/10"
              >
                Talk to Sales
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-luxury-neutral/60"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-luxury-primary" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-luxury-primary" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-luxury-primary" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};