
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const CreatorShowcase = () => {
  return (
    <section className="py-20 bg-luxury-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-luxury-neutral mb-4">
            Success Stories
          </h2>
          <p className="text-luxury-neutral/60 max-w-2xl mx-auto">
            Join our community of successful creators
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="md:basis-1/3 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="rounded-xl overflow-hidden border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl p-4">
                  <div className="h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-luxury-darker/50">
                    <span className="text-luxury-neutral/40">Creator showcase</span>
                  </div>
                  <div className="text-luxury-primary font-semibold">
                    Join and grow your audience
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default CreatorShowcase;
