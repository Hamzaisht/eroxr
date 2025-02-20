
import { motion } from "framer-motion";
import { Shield, Users, CreditCard, MessageSquare, Palette, Trophy, Zap, Heart, Star } from "lucide-react";

const features = [
  {
    title: "Secure Platform",
    description: "Advanced encryption and privacy protection for all users",
    icon: Shield,
    gradient: "from-blue-500/10 to-indigo-500/10"
  },
  {
    title: "Community First",
    description: "Build and grow your dedicated fan community",
    icon: Users,
    gradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    title: "Smart Payments",
    description: "Flexible monetization with instant payouts",
    icon: CreditCard,
    gradient: "from-emerald-500/10 to-teal-500/10"
  },
  {
    title: "Live Interaction",
    description: "Real-time messaging and content sharing",
    icon: MessageSquare,
    gradient: "from-orange-500/10 to-amber-500/10"
  },
  {
    title: "Creative Tools",
    description: "Professional tools to showcase your content",
    icon: Palette,
    gradient: "from-rose-500/10 to-red-500/10"
  },
  {
    title: "Achievements",
    description: "Reward system for engagement and growth",
    icon: Trophy,
    gradient: "from-violet-500/10 to-purple-500/10"
  },
  {
    title: "Fast Performance",
    description: "Optimized for speed and reliability",
    icon: Zap,
    gradient: "from-cyan-500/10 to-blue-500/10"
  },
  {
    title: "Support System",
    description: "24/7 dedicated customer support",
    icon: Heart,
    gradient: "from-pink-500/10 to-rose-500/10"
  },
  {
    title: "Premium Quality",
    description: "High-quality content delivery system",
    icon: Star,
    gradient: "from-yellow-500/10 to-orange-500/10"
  }
];

export const Features3D = () => {
  return (
    <section className="py-20 lg:py-32 bg-luxury-dark overflow-hidden">
      <div className="container relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-luxury-gradient opacity-30 blur-3xl" />
        <div className="absolute -inset-x-40 -top-40 h-[500px] bg-gradient-to-r from-luxury-primary/20 to-luxury-secondary/20 blur-3xl rounded-full" />
        
        {/* Content */}
        <div className="relative">
          <div className="text-center mb-16 space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-luxury-neutral to-luxury-primary bg-clip-text text-transparent sm:text-5xl"
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto text-luxury-neutral/80 text-lg"
            >
              Everything you need to create, grow, and monetize your content
            </motion.p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl`} />
                  <div className="relative h-full p-6 rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl transition-all duration-300 hover:border-luxury-primary/20">
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-luxury-primary/10">
                      <Icon className="w-6 h-6 text-luxury-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-luxury-neutral/80">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
