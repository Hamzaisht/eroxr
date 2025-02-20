import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Zap,
  Shield,
  Users,
  Globe,
  TrendingUp,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Payouts",
    description: "Get paid instantly when your fans subscribe or tip",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Platform",
    description: "Enterprise-grade security for your content and earnings",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Tools",
    description: "Build and engage with your community effectively",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Reach",
    description: "Connect with fans worldwide with multi-currency support",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Analytics",
    description: "Detailed insights to grow your audience and revenue",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Direct Messaging",
    description: "Personal connection with your biggest supporters",
  },
];

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
      >
        <Card className="p-6 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-neutral/10 hover:border-luxury-primary/50 transition-all duration-300">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="h-12 w-12 rounded-lg bg-luxury-primary/10 flex items-center justify-center mb-4"
          >
            <div className="text-luxury-primary">{feature.icon}</div>
          </motion.div>
          <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
            {feature.title}
          </h3>
          <p className="text-luxury-neutral/60">{feature.description}</p>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export const InteractiveFeatures = () => {
  return (
    <section className="py-20 bg-luxury-dark relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-luxury-neutral mb-4">
            Powerful Features
          </h2>
          <p className="text-luxury-neutral/60 max-w-2xl mx-auto">
            Everything you need to succeed as a creator
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;
