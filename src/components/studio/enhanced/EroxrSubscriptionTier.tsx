
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EroxrSubscriptionTierProps {
  profileId: string;
}

export const EroxrSubscriptionTier = ({ profileId }: EroxrSubscriptionTierProps) => {
  const subscriptionTiers = [
    {
      name: 'Mortal Admirer',
      price: 9.99,
      icon: Heart,
      color: 'from-pink-400 to-red-500',
      features: ['Access to exclusive photos', 'Weekly updates', 'Community access']
    },
    {
      name: 'Divine Follower',
      price: 19.99,
      icon: Star,
      color: 'from-purple-400 to-blue-500',
      features: ['Everything from Mortal tier', 'HD video content', 'Direct messaging', 'Monthly video calls']
    },
    {
      name: 'Olympian VIP',
      price: 39.99,
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      features: ['Everything from previous tiers', 'Custom content requests', 'Priority support', 'Exclusive livestreams']
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-8 py-12 bg-luxury-darker/20 backdrop-blur-xl border-y border-yellow-400/10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Crown className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          <h2 className="text-4xl font-bold text-luxury-neutral mb-4">
            Choose Your Divine Experience
          </h2>
          <p className="text-luxury-muted text-xl max-w-2xl mx-auto">
            Unlock exclusive content and connect with this divine creator on a deeper level
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="bg-luxury-darker/50 backdrop-blur-xl rounded-3xl p-8 border border-luxury-primary/20 hover:border-yellow-400/40 transition-all duration-300 relative overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Most Popular Badge */}
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-luxury-neutral mb-2 text-center">
                      {tier.name}
                    </h3>
                    
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-luxury-neutral">${tier.price}</span>
                      <span className="text-luxury-muted text-lg">/month</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-luxury-muted">
                          <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all duration-300`}>
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
