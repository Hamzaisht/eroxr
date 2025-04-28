
import { motion } from "framer-motion";

export const PressLogos = () => {
  const logos = [
    { name: "TechCrunch", src: "https://placehold.co/200x80" },
    { name: "Forbes", src: "https://placehold.co/200x80" },
    { name: "Wired", src: "https://placehold.co/200x80" },
    { name: "VentureBeat", src: "https://placehold.co/200x80" },
  ];

  return (
    <div className="py-12 bg-luxury-darker/30">
      <div className="container mx-auto">
        <p className="text-center text-luxury-neutral/60 mb-8 text-sm uppercase tracking-wider">
          Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-32 md:w-40 grayscale hover:grayscale-0 transition-all"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="w-full h-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
