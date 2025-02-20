import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const creators = [
  {
    name: "Sarah Chen",
    category: "Digital Artist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    earnings: "$50K+",
  },
  {
    name: "Michael Rodriguez",
    category: "Fitness Coach",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    earnings: "$75K+",
  },
  {
    name: "Emma Thompson",
    category: "Content Creator",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    earnings: "$100K+",
  },
  // Add more creators as needed
];

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
            Join our community of successful creators who are making it big
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
            {creators.map((creator, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="rounded-xl overflow-hidden border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl p-4">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="font-semibold">{creator.name}</div>
                        <div className="text-sm opacity-80">{creator.category}</div>
                      </div>
                    </div>
                    <div className="text-luxury-primary font-semibold">
                      Monthly Earnings: {creator.earnings}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default CreatorShowcase;
