import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Star, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const { user } = useAuth();
  const { hasPremium, status, currentPeriodEnd, createPlatformSubscription, isLoading, refreshSubscription } = usePlatformSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleSubscribe = async () => {
    try {
      await createPlatformSubscription();
      toast({
        title: "Redirecting to checkout",
        description: "You'll be redirected to complete your premium subscription.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: <Crown className="w-5 h-5" />,
      title: "Premium Access",
      description: "Full access to all platform features"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Direct Messaging",
      description: "Send and receive messages with creators"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Media Viewing",
      description: "View all photos, videos and exclusive content"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Tip Creators",
      description: "Support your favorite creators with tips"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Ad-Free Experience",
      description: "Enjoy the platform without any advertisements"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Priority Support",
      description: "Get priority customer support when you need help"
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-darker via-luxury-dark to-luxury-darker p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Crown className="w-12 h-12 text-amber-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Premium Subscription</h1>
          <p className="text-xl text-slate-300">
            Unlock the full potential of the platform
          </p>
        </motion.div>

        {/* Current Status */}
        {hasPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-green-500/20">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Premium Active</h3>
                <p className="text-green-400">
                  {currentPeriodEnd ? `Renews on ${new Date(currentPeriodEnd).toLocaleDateString()}` : 'Active subscription'}
                </p>
              </div>
            </div>
            <Button
              onClick={refreshSubscription}
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              Refresh Status
            </Button>
          </motion.div>
        )}

        {/* Pricing Card */}
        {!hasPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
              
              <CardHeader className="relative z-10 text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30">
                    <Crown className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  Premium Access
                </CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  Everything you need to enjoy the platform
                </CardDescription>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-amber-400">49 SEK</div>
                  <div className="text-slate-400">per month</div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{feature.title}</h4>
                        <p className="text-sm text-slate-400">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      Subscribe Now
                    </div>
                  )}
                </Button>
                
                <p className="text-center text-xs text-slate-400">
                  Cancel anytime • Secure payment via Stripe • No hidden fees
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-luxury-card/50 backdrop-blur-xl border border-luxury-primary/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;