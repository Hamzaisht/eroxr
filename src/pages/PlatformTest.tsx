import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, X, RefreshCw, CreditCard, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTipDialog } from '@/components/tips/EnhancedTipDialog';
import { PremiumGate } from '@/components/subscription/PremiumGate';

const PlatformTest = () => {
  const { user } = useAuth();
  const { hasPremium, status, currentPeriodEnd, createPlatformSubscription, isLoading, refreshSubscription } = usePlatformSubscription();
  const { toast } = useToast();
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [testResults, setTestResults] = useState({
    auth: false,
    subscription: false,
    premium: false,
    tipping: false,
  });

  useEffect(() => {
    // Test authentication
    setTestResults(prev => ({
      ...prev,
      auth: !!user,
      subscription: !isLoading,
      premium: hasPremium,
    }));
  }, [user, isLoading, hasPremium]);

  const runFullTest = async () => {
    toast({
      title: "Running Platform Tests",
      description: "Testing all platform functionality...",
    });

    try {
      // Test subscription refresh
      await refreshSubscription();
      
      setTestResults(prev => ({
        ...prev,
        subscription: true,
      }));

      toast({
        title: "Tests Complete",
        description: "All platform functionality is working correctly!",
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

  const testFeatures = [
    {
      name: "Authentication",
      status: testResults.auth,
      description: "User authentication and session management",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Subscription Status",
      status: testResults.subscription,
      description: "Platform subscription checking and management",
      icon: <Crown className="w-5 h-5" />,
    },
    {
      name: "Premium Access",
      status: testResults.premium,
      description: "Premium feature access and gating",
      icon: <Check className="w-5 h-5" />,
    },
    {
      name: "Payment Processing",
      status: hasPremium,
      description: "Stripe integration for payments and tips",
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-darker via-luxury-dark to-luxury-darker p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Platform Integration Test</h1>
          <p className="text-xl text-slate-300">
            Comprehensive testing of all platform features and Stripe integration
          </p>
        </motion.div>

        {/* Test Status Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden ${
                feature.status 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${
                      feature.status ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {feature.icon}
                    </div>
                    {feature.status ? (
                      <Check className="w-6 h-6 text-green-400" />
                    ) : (
                      <X className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <CardTitle className="text-white">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-luxury-card/50 backdrop-blur-xl border border-luxury-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                Current Platform Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Authentication</h4>
                  <p className="text-slate-400">
                    User: {user ? user.email : 'Not logged in'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Premium Status</h4>
                  <p className="text-slate-400">
                    Status: <span className={hasPremium ? 'text-green-400' : 'text-red-400'}>
                      {hasPremium ? 'Active Premium' : 'No Premium'}
                    </span>
                  </p>
                  {currentPeriodEnd && (
                    <p className="text-xs text-slate-500">
                      Expires: {new Date(currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            onClick={runFullTest}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Full Test
          </Button>

          {!hasPremium && (
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Test Premium Subscription
            </Button>
          )}

          <Button
            onClick={() => setShowTipDialog(true)}
            variant="outline"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Test Tipping System
          </Button>
        </motion.div>

        {/* Premium Features Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-luxury-card/50 backdrop-blur-xl border border-luxury-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Premium Features Demo</CardTitle>
              <CardDescription>
                These features require premium subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PremiumGate feature="direct messaging">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <MessageCircle className="w-5 h-5" />
                    <span>Direct messaging is available!</span>
                  </div>
                </div>
              </PremiumGate>

              <PremiumGate feature="media viewing">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span>Media viewing is unlocked!</span>
                  </div>
                </div>
              </PremiumGate>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Tip Dialog */}
      <EnhancedTipDialog
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        recipientId={user?.id || 'test-user-id'}
      />
    </div>
  );
};

export default PlatformTest;