
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Gift, PlayCircle, Zap } from "lucide-react";

export const ExplainerSection = () => {
  const [containerRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  const steps = [
    {
      icon: <PlayCircle className="w-12 h-12 text-luxury-primary" />,
      title: "Set Up Your Profile",
      description:
        "Create your personalized space in minutes. Upload your best content and set your subscription tiers to engage with your audience.",
    },
    {
      icon: <Zap className="w-12 h-12 text-luxury-accent" />,
      title: "Upload & Engage",
      description:
        "Share exclusive photos, videos, livestreams, and interact with your fans through private messaging and stories.",
    },
    {
      icon: <Gift className="w-12 h-12 text-luxury-secondary" />,
      title: "Monetize Instantly",
      description:
        "Start earning immediately with multiple revenue streams - subscriptions, tips, pay-per-view content, and direct sales.",
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-4 sm:px-6"
    >
      <div ref={sectionRef} className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            How Eroxr Works
          </h2>
          <p className="text-luxury-neutral text-lg max-w-2xl mx-auto">
            Three simple steps to start creating, connecting, and earning on your terms
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative bg-gradient-to-br from-luxury-darker to-luxury-dark border border-luxury-primary/10 p-8 rounded-xl hover:shadow-[0_0_30px_rgba(155,135,245,0.15)] transition-all duration-500 group"
              variants={itemVariants}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ y: y }}
            >
              <motion.div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-luxury-darker p-4 rounded-full border border-luxury-primary/20 shadow-luxury group-hover:shadow-luxury-hover transition-all duration-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {step.icon}
              </motion.div>
              <div className="pt-8">
                <h3 className="text-xl md:text-2xl font-bold mt-4 text-white">
                  {step.title}
                </h3>
                <p className="text-luxury-neutral mt-4">
                  {step.description}
                </p>
              </div>

              {/* Step indicator */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-luxury-primary/20 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-luxury-primary/5 blur-3xl -z-10"
        style={{ y }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
    </section>
  );
};
