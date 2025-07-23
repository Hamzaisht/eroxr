
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Users, TrendingUp, Shield, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Crown,
      title: "Creator First",
      description: "We put creators at the center of everything we do. Your success is our success."
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Premium security measures and verified users ensure a safe environment for all."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Constantly evolving platform with cutting-edge features and technology."
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building authentic connections between creators and their audiences."
    }
  ];

  const stats = [
    { value: "47K+", label: "Active Creators" },
    { value: "2.3M+", label: "Platform Users" },
    { value: "$12.8M", label: "Paid to Creators" },
    { value: "93%", label: "Revenue Share" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-luxury-primary to-luxury-accent">
            About EROXR
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Revolutionizing Creator Economy
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            EROXR is the Nordic's leading creator platform, empowering content creators 
            with the tools, community, and earning potential they deserve.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-luxury-primary mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm p-8">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                To create the most creator-friendly platform in the world, where content creators 
                can build sustainable businesses, connect authentically with their audiences, and 
                retain the maximum value from their work. We believe creators deserve more than 
                just a platform - they deserve a partner in their success.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-full flex items-center justify-center">
                <value.icon className="w-8 h-8 text-luxury-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
              <p className="text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-2xl p-12 backdrop-blur-sm border border-luxury-primary/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Become part of the creator revolution and start building your sustainable 
            content business today.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
          >
            <Link to="/creator-signup">Start Creating</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
