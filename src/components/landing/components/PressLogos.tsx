
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const logos = [
  {
    name: "TechCrunch",
    logo: "/logos/techcrunch.svg",
    alt: "TechCrunch logo"
  },
  {
    name: "Forbes",
    logo: "/logos/forbes.svg",
    alt: "Forbes logo"
  },
  {
    name: "Wired",
    logo: "/logos/wired.svg",
    alt: "Wired logo"
  },
  {
    name: "The Verge",
    logo: "/logos/theverge.svg",
    alt: "The Verge logo"
  },
  {
    name: "Fast Company",
    logo: "/logos/fastcompany.svg",
    alt: "Fast Company logo"
  }
];

export const PressLogos = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-luxury-neutral/60 font-medium mb-8 text-sm uppercase tracking-wider"
        >
          Featured In
        </motion.p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-6">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
              className="h-6 sm:h-8"
            >
              <div className="text-luxury-neutral/60 font-semibold">{logo.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressLogos;
