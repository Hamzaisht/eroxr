
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(1);
  
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Jessica R.",
      role: "Fashion Creator",
      avatar: "/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png",
      content: "Eroxr completely transformed my content creation business. The platform's ease of use and direct connection with fans helped me triple my monthly income within just 3 months.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael T.",
      role: "Fitness Instructor",
      avatar: "/lovable-uploads/680a4cbf-2252-4c48-9aab-c7385de5b32d.png",
      content: "As a fitness instructor, I needed a platform that gives me ownership of my content while making monetization simple. Eroxr's payment system is seamless, and the engagement tools keep my subscribers coming back.",
      rating: 5
    },
    {
      id: 3,
      name: "Sarah K.",
      role: "Digital Artist",
      avatar: "/lovable-uploads/3afb027b-f83e-477f-b9aa-ee70f156546f.png",
      content: "The security features on Eroxr give me peace of mind that my artwork is protected. The subscription model has allowed me to focus on creating quality content rather than quantity.",
      rating: 4
    },
    {
      id: 4,
      name: "David L.",
      role: "Music Producer",
      avatar: "/lovable-uploads/e754d33f-d841-445d-bc8a-537e1694f818.png",
      content: "I've tried several creator platforms, and Eroxr stands out with its superior video quality and streaming capabilities. My fans love the exclusive content, and I love the reliable payment system.",
      rating: 5
    }
  ];
  
  const handleTestimonialClick = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <section 
      ref={containerRef}
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      <div ref={ref} className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{ y }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Trusted by </span>
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Creators Worldwide
            </span>
          </h2>
          <p className="text-luxury-neutral text-lg max-w-2xl mx-auto">
            Hear what content creators are saying about their experience with Eroxr
          </p>
        </motion.div>
        
        {/* Testimonials */}
        <div className="relative flex flex-col items-center">
          {/* Main Testimonial Display */}
          <motion.div
            className="w-full max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className={`bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/20 p-8 rounded-xl relative ${activeIndex === index ? "block" : "hidden"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={activeIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20, zIndex: -1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Quote marks */}
                <div className="absolute -top-6 -left-6 text-6xl text-luxury-primary/20 font-serif">"</div>
                <div className="absolute -bottom-6 -right-6 text-6xl text-luxury-primary/20 font-serif rotate-180">"</div>
                
                {/* Content */}
                <p className="text-xl text-luxury-neutral mb-8 relative z-10">
                  {testimonial.content}
                </p>
                
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-luxury-neutral/30"}`}
                    />
                  ))}
                </div>
                
                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-luxury-primary">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-luxury-primary">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-luxury-primary/5 rounded-xl blur-2xl -z-10"></div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Testimonial Avatars for Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                className={`relative rounded-full overflow-hidden w-16 h-16 border-2 transition-all duration-300 ${
                  activeIndex === index 
                    ? "border-luxury-primary scale-110 shadow-[0_0_20px_rgba(155,135,245,0.5)]" 
                    : "border-luxury-primary/20 opacity-70"
                }`}
                onClick={() => handleTestimonialClick(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
                {activeIndex === index && (
                  <motion.div 
                    className="absolute inset-0 border-2 border-luxury-primary rounded-full"
                    animate={{ 
                      boxShadow: ["0 0 10px rgba(155,135,245,0.5)", "0 0 20px rgba(155,135,245,0.7)", "0 0 10px rgba(155,135,245,0.5)"] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-luxury-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-luxury-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
