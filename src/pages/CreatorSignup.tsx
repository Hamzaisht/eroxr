
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, DollarSign, Users, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const CreatorSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    contentType: ""
  });

  const benefits = [
    {
      icon: DollarSign,
      title: "Only 7% Revenue Share",
      description: "Keep 93% of your earnings - industry's lowest rate",
      color: "text-green-400"
    },
    {
      icon: TrendingUp,
      title: "Instant Payouts",
      description: "Get paid immediately, no waiting periods",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Verified Audience",
      description: "All users are verified for premium interactions",
      color: "text-purple-400"
    },
    {
      icon: Shield,
      title: "Full Content Control",
      description: "Own your content, set your prices, your rules",
      color: "text-pink-400"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-luxury-primary to-luxury-accent">
              <Crown className="w-4 h-4 mr-2" />
              Creator Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Start Your Creator Journey
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of creators earning premium income through authentic connections
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Why Choose EROXR?</h2>
              
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <benefit.icon className={`w-8 h-8 ${benefit.color} flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}

              <div className="bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 p-6 rounded-xl border border-luxury-primary/30">
                <h3 className="text-2xl font-bold text-white mb-4">Earn More, Keep More</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">93%</div>
                    <div className="text-sm text-gray-300">You Keep</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-luxury-primary">7%</div>
                    <div className="text-sm text-gray-300">Platform Fee</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-luxury-primary" />
                    Create Your Account
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Start earning from day one with our creator-first platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="@yourcreatorname"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Create a strong password"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell your audience about yourself..."
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white font-semibold py-6 text-lg"
                    >
                      Start Creating Today
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      Already have an account?{" "}
                      <Link to="/login" className="text-luxury-primary hover:text-luxury-accent transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSignup;
