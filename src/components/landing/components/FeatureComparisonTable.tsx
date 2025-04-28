
import { motion } from "framer-motion";
import { Check, X, Zap, Shield, Star, BarChart, MessageSquare, Layers, Settings } from "lucide-react";

const features = [
  {
    name: "Custom Branding",
    icon: Star,
    eroxr: true,
    others: false,
    description: "Full control over your brand appearance"
  },
  {
    name: "Multiple Revenue Streams",
    icon: BarChart,
    eroxr: true,
    others: false,
    description: "Diversify your income sources"
  },
  {
    name: "Analytics Dashboard",
    icon: Layers,
    eroxr: true,
    others: true,
    description: "Track your performance and growth"
  },
  {
    name: "Direct Fan Messaging",
    icon: MessageSquare,
    eroxr: true,
    others: false,
    description: "Build stronger connections"
  },
  {
    name: "Advanced Security",
    icon: Shield,
    eroxr: true,
    others: true,
    description: "Best-in-class data protection"
  },
  {
    name: "Premium Performance",
    icon: Zap,
    eroxr: true,
    others: false,
    description: "Lightning-fast speeds for creators & fans"
  },
  {
    name: "Advanced Settings",
    icon: Settings,
    eroxr: true,
    others: false,
    description: "Customize every aspect of your experience"
  }
];

export const FeatureComparisonTable = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Why Choose <span className="gradient-text">EROXR</span>
          </h2>
          <p className="text-luxury-neutral/80 max-w-2xl mx-auto text-lg">
            See how we compare to other platforms in the industry
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Background glow effect */}
          <div className="absolute -inset-4 bg-premium-gradient opacity-20 rounded-3xl blur-xl" />
          
          <div className="rounded-2xl overflow-hidden border border-luxury-primary/30 relative z-10">
            <div className="grid grid-cols-3 bg-luxury-dark/90 backdrop-blur-lg p-6">
              <div className="text-xl font-display font-semibold">Feature</div>
              <div className="text-xl font-display font-semibold text-center text-luxury-primary">EROXR</div>
              <div className="text-xl font-display font-semibold text-center text-luxury-neutral/70">Others</div>
            </div>
            
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="grid grid-cols-3 p-6 border-t border-luxury-primary/10 hover:bg-luxury-darker/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-luxury-primary" />
                  <div>
                    <p className="font-display font-medium group-hover:text-white transition-colors">{feature.name}</p>
                    <p className="text-sm text-luxury-neutral/70">{feature.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-center items-center">
                  {feature.eroxr ? (
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-luxury-primary/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="text-green-500 w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="text-red-500 w-6 h-6" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-center items-center">
                  {feature.others ? (
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="text-green-400 w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="text-red-500 w-6 h-6" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Bottom highlight */}
            <div className="bg-gradient-to-r from-luxury-primary/60 via-luxury-accent/40 to-luxury-primary/60 h-1" />
          </div>
          
          {/* CTA Below Table */}
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white py-3 px-8 rounded-full font-medium hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
              Join EROXR Today
            </button>
            <p className="mt-4 text-luxury-neutral/70 text-sm">
              No contracts. No hidden fees. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
