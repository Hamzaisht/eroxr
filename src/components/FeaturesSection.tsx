import { motion } from "framer-motion";

const features = [
  {
    title: "Exclusive Content",
    description: "Share premium content with your most dedicated supporters.",
    icon: "🎭",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    title: "Community Building",
    description: "Create and nurture a passionate community around your content.",
    icon: "👥",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    title: "Monetization Tools",
    description: "Multiple revenue streams to support your creative journey.",
    icon: "💰",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-luxury-dark">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-luxury-neutral to-luxury-primary bg-clip-text text-transparent sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-luxury-neutral/80">
            Powerful tools and features to help you grow and engage with your audience
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-luxury-primary/10 to-luxury-secondary/10 rounded-lg blur-xl transition-all group-hover:blur-2xl" />
              <div className="relative p-6 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
                  {feature.title}
                </h3>
                <p className="text-luxury-neutral/80">
                  {feature.description}
                </p>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="mt-4 rounded-lg w-full h-48 object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};