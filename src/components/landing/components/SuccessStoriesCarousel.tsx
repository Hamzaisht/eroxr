
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion } from "framer-motion";

interface SuccessStory {
  name: string;
  image: string;
  earnings: string;
  niche: string;
  quote: string;
}

const successStories: SuccessStory[] = [
  {
    name: "Sarah Chen",
    image: "https://placehold.co/400x400",
    earnings: "$45,000/month",
    niche: "Digital Art",
    quote: "This platform transformed my passion into a thriving business."
  },
  {
    name: "Marcus Rodriguez",
    image: "https://placehold.co/400x400",
    earnings: "$32,000/month",
    niche: "Fitness & Wellness",
    quote: "I've built a community that supports my vision."
  },
  {
    name: "Emily Turner",
    image: "https://placehold.co/400x400",
    earnings: "$28,000/month",
    niche: "Music Production",
    quote: "The tools here helped me monetize my creativity."
  }
];

export const SuccessStoriesCarousel = () => {
  return (
    <section className="py-20 bg-luxury-darker/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Success Stories
        </h2>
        <Carousel className="mx-auto max-w-5xl">
          <CarouselContent>
            {successStories.map((story, index) => (
              <CarouselItem key={story.name}>
                <motion.div 
                  className="p-6 bg-luxury-dark/50 rounded-2xl border border-luxury-primary/20 backdrop-blur-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">{story.name}</h3>
                      <p className="text-luxury-neutral mb-2">{story.niche}</p>
                      <p className="text-luxury-primary font-bold mb-4">{story.earnings}</p>
                      <blockquote className="text-lg italic text-luxury-neutral/80">
                        "{story.quote}"
                      </blockquote>
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
