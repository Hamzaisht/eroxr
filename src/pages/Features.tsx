
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Zap, 
  Heart, 
  MessageCircle, 
  Video, 
  Camera, 
  BarChart3, 
  Shield, 
  Clock,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: DollarSign,
      title: "7% Transaction Revenue Share Only",
      description: "Industry's lowest fee structure. Keep 93% of your earnings with transparent pricing and no hidden costs.",
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      icon: Zap,
      title: "Ad Spend & Share on Live streams",
      description: "Revolutionary revenue sharing model like Kick. Earn from ads during your live streams automatically.",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      icon: Heart,
      title: "Dating Integration",
      description: "Connect with your audience on a deeper level through our integrated dating features for verified users.",
      color: "text-pink-400",
      bgColor: "bg-pink-400/10"
    },
    {
      icon: Users,
      title: "Fan Monetization",
      description: "Multiple revenue streams: subscriptions, tips, custom content, private messages, and exclusive access.",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      icon: MessageCircle,
      title: "Chat, Messages & Live Streams",
      description: "Complete communication suite with real-time chat, private messaging, and high-quality live streaming.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10"
    },
    {
      icon: Camera,
      title: "Eros Shorts - Snackable Videos",
      description: "Create and monetize short-form content with our TikTok-style video platform built for adult creators.",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Dashboard",
      description: "Track earnings, audience engagement, content performance, and growth metrics in one powerful dashboard.",
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10"
    },
    {
      icon: Shield,
      title: "All Verified Users",
      description: "Safe, secure platform with mandatory verification for all users. No fake accounts or underage users.",
      color: "text-red-400",
      bgColor: "bg-red-400/10"
    },
    {
      icon: Clock,
      title: "Instant Payouts",
      description: "Get paid immediately after each transaction. No waiting periods, no payment delays, just instant access to your earnings.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    }
  ];

  const stats = [
    { value: "93%", label: "Revenue Share", color: "text-green-400" },
    { value: "24/7", label: "Support", color: "text-blue-400" },
    { value: "100%", label: "Verified", color: "text-purple-400" },
    { value: "0sec", label: "Payout Delay", color: "text-yellow-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-luxury-primary to-luxury-accent">
            <Star className="w-4 h-4 mr-2" />
            Platform Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Everything You Need to Succeed
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            EROXR provides the most comprehensive creator platform with industry-leading features, 
            transparent pricing, and instant payouts.
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
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-2xl p-12 backdrop-blur-sm border border-luxury-primary/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already earning more with EROXR's 
            industry-leading platform and features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
            >
              <Link to="/creator-signup">Start Creating Now</Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-luxury-primary/50 text-luxury-primary hover:bg-luxury-primary/10"
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
