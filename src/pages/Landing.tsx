import { motion } from "framer-motion";
import { Hero3D } from "@/components/landing/Hero3D";
import { Features3D } from "@/components/landing/Features3D";

const Landing = () => {
  return (
    <div className="min-h-screen bg-luxury-dark overflow-hidden">
      <Hero3D />
      <Features3D />
      
      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-20 bg-luxury-dark"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "10K+", label: "Creators" },
              { number: "1M+", label: "Community Members" },
              { number: "100K+", label: "Content Pieces" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-luxury-primary mb-2">
                  {stat.number}
                </h3>
                <p className="text-luxury-neutral text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="py-20 bg-gradient-to-t from-luxury-dark to-luxury-dark/95"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Start Your Journey?
          </h2>
          <p className="text-luxury-neutral text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of creators who are already building their future with us.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-luxury-primary to-luxury-secondary rounded-full text-white font-semibold text-lg"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;