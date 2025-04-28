
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  {
    name: "Custom Branding",
    eroxr: true,
    others: false,
    description: "Full control over your brand appearance"
  },
  {
    name: "Multiple Revenue Streams",
    eroxr: true,
    others: false,
    description: "Diversify your income sources"
  },
  {
    name: "Analytics Dashboard",
    eroxr: true,
    others: true,
    description: "Track your performance and growth"
  },
  {
    name: "Direct Fan Messaging",
    eroxr: true,
    others: false,
    description: "Build stronger connections"
  }
];

export const FeatureComparisonTable = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-luxury-primary">EROXR</span>
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-luxury-primary/20">
            <div className="grid grid-cols-3 bg-luxury-dark/70 p-4">
              <div className="text-lg font-semibold">Feature</div>
              <div className="text-lg font-semibold text-center text-luxury-primary">EROXR</div>
              <div className="text-lg font-semibold text-center text-luxury-neutral">Others</div>
            </div>
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="grid grid-cols-3 p-4 border-t border-luxury-primary/10 hover:bg-luxury-darker/30 transition-colors"
              >
                <div>
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-luxury-neutral">{feature.description}</p>
                </div>
                <div className="flex justify-center items-center">
                  {feature.eroxr ? (
                    <Check className="text-green-500 w-6 h-6" />
                  ) : (
                    <X className="text-red-500 w-6 h-6" />
                  )}
                </div>
                <div className="flex justify-center items-center">
                  {feature.others ? (
                    <Check className="text-green-500 w-6 h-6" />
                  ) : (
                    <X className="text-red-500 w-6 h-6" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
