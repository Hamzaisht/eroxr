import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CTASection = () => {
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
          <div className="relative">
            <h2 className="text-3xl font-bold text-luxury-neutral sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-luxury-neutral/80 sm:text-lg">
              Join thousands of creators who are building their communities and earning from their passion.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
              <Button size="lg" className="bg-button-gradient hover:bg-hover-gradient text-white">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="border-luxury-neutral text-luxury-neutral hover:bg-luxury-neutral/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};