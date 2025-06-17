
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EroxrSubscriptionTierProps {
  profileId: string;
}

export const EroxrSubscriptionTier = ({ profileId }: EroxrSubscriptionTierProps) => {
  const subscriptionTiers = [
    {
      name: 'Divine Follower',
      price: 'Free',
      icon: Heart,
      color: 'from-slate-500 to-gray-500',
      features: ['View public content', 'Like and comment', 'Basic profile access'],
      description: 'Join the divine realm'
    },
    {
      name: 'Sacred Devotee',
      price: '$9.99/month',
      icon: Star,
      color: 'from-slate-600 to-gray-600',
      features: ['All free features', 'Exclusive content', 'Direct messaging', 'Priority support'],
      description: 'Unlock divine mysteries',
      isPopular: true
    },
    {
      name: 'Celestial Champion',
      price: '$29.99/month',
      icon: Crown,
      color: 'from-slate-700 to-gray-700',
      features: ['All previous features', 'Custom requests', 'Video calls', 'Personalized content'],
      description: 'Ascend to divine status'
    }
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-8 py-12 bg-slate-800/30 backdrop-blur-xl border-y border-slate-700/20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-slate-300" />
            <h2 className="text-4xl font-bold text-slate-200">Divine Subscription Tiers</h2>
            <Zap className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 text-lg">
            Choose your level of divine access
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
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border ${
                  tier.isPopular ? 'border-slate-500/50' : 'border-slate-700/30'
                } hover:border-slate-500/40 transition-all duration-300 group overflow-hidden`}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-slate-500 to-gray-500 text-white px-4 py-1 text-sm font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-2xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Tier Name */}
                  <h3 className="text-2xl font-bold text-slate-200 text-center mb-2">
                    {tier.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-center mb-4">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-slate-300">
                      {tier.price}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-400">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <Button
                    className={`w-full ${
                      tier.isPopular
                        ? 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200 border border-slate-600/30'
                    } py-3 rounded-2xl font-semibold text-lg transition-all duration-300`}
                  >
                    {tier.price === 'Free' ? 'Follow' : 'Subscribe'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
