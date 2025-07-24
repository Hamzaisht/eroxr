import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Star, 
  Check, 
  ArrowLeft,
  Shield,
  Zap,
  Heart,
  Video,
  MessageCircle,
  Users,
  Sparkles
} from "lucide-react";

const Subscription = () => {
  const { user } = useAuth();
  const { hasPremium, isLoading } = usePlatformSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    { icon: Crown, text: "Premium creator badge", premium: true },
    { icon: Video, text: "Unlimited content uploads", premium: true },
    { icon: MessageCircle, text: "Priority messaging", premium: true },
    { icon: Users, text: "Advanced analytics", premium: true },
    { icon: Shield, text: "Enhanced security", premium: true },
    { icon: Star, text: "Early access to features", premium: true },
    { icon: Heart, text: "Premium dating features", premium: true },
    { icon: Sparkles, text: "Custom profile themes", premium: true }
  ];

  const plans = {
    monthly: {
      price: 49,
      period: "month",
      description: "Perfect for getting started",
      popular: false
    },
    yearly: {
      price: 390,
      period: "year",
      description: "Best value - 2 months free!",
      popular: true,
      savings: "20% off"
    }
  };

  const handleUpgrade = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    toast({
      title: "Upgrade to Premium",
      description: "Redirecting to secure checkout...",
    });
    
    // This would integrate with Stripe in production
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Welcome to EROXR Premium! 🎉",
      });
    }, 2000);
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancel Subscription",
      description: "Please contact support to cancel your subscription.",
      variant: "destructive"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <div className="text-white">Loading subscription status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Subscription</h1>
          {hasPremium && (
            <Badge className="bg-gradient-to-r from-luxury-primary to-luxury-accent">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </motion.div>

        {hasPremium ? (
          /* Current Subscription */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 border-luxury-primary/30 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Crown className="h-6 w-6 text-luxury-primary" />
                  EROXR Premium Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Your Benefits</h3>
                    <div className="grid gap-3">
                      {features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="p-1 bg-luxury-primary/20 rounded">
                            <feature.icon className="h-4 w-4 text-luxury-primary" />
                          </div>
                          <span className="text-white/90">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
                    <div className="space-y-2 text-white/90">
                      <p>Plan: <span className="text-luxury-primary font-semibold">Premium Monthly</span></p>
                      <p>Next billing: <span className="text-white">January 24, 2025</span></p>
                      <p>Amount: <span className="text-white font-semibold">49 SEK/month</span></p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleCancelSubscription}
                      className="mt-4 border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Upgrade Plans */
          <div>
            {/* Plan Toggle */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-black/40 p-1 rounded-lg backdrop-blur-sm">
                <Button
                  variant={selectedPlan === 'monthly' ? 'default' : 'ghost'}
                  onClick={() => setSelectedPlan('monthly')}
                  className={selectedPlan === 'monthly' ? 'bg-luxury-primary' : 'text-white hover:bg-white/10'}
                >
                  Monthly
                </Button>
                <Button
                  variant={selectedPlan === 'yearly' ? 'default' : 'ghost'}
                  onClick={() => setSelectedPlan('yearly')}
                  className={selectedPlan === 'yearly' ? 'bg-luxury-primary' : 'text-white hover:bg-white/10'}
                >
                  Yearly
                  <Badge className="ml-2 bg-green-500 text-white text-xs">Save 20%</Badge>
                </Button>
              </div>
            </motion.div>

            {/* Premium Plan Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 border-luxury-primary/30 backdrop-blur-sm relative overflow-hidden">
                {plans[selectedPlan].popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Crown className="h-12 w-12 text-luxury-primary" />
                  </div>
                  <CardTitle className="text-2xl text-white">EROXR Premium</CardTitle>
                  <p className="text-white/70">{plans[selectedPlan].description}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-white">{plans[selectedPlan].price}</span>
                      <span className="text-white/70">SEK/{plans[selectedPlan].period}</span>
                    </div>
                    {selectedPlan === 'yearly' && (
                      <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                        20% off
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/90">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white font-semibold py-3 text-lg"
                    size="lg"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade to Premium
                  </Button>

                  <p className="text-center text-white/60 text-sm mt-4">
                    Cancel anytime. No hidden fees. 30-day money-back guarantee.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* FAQ Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-white/70 text-sm">Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-white/70 text-sm">We accept all major credit cards, PayPal, and local payment methods through our secure payment processor.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;