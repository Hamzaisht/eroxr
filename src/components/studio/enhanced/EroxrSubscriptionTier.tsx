
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Heart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EroxrSubscriptionTierProps {
  profileId: string;
}

export const EroxrSubscriptionTier = ({ profileId }: EroxrSubscriptionTierProps) => {
  const tiers = [
    {
      name: 'Divine Supporter',
      price: '$4.99',
      period: '/month',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      features: ['Access to exclusive posts', 'Monthly divine message', 'Supporter badge'],
    },
    {
      name: 'Celestial Patron',
      price: '$9.99',
      period: '/month',
      icon: Star,
      color: 'from-purple-500 to-violet-500',
      features: ['Everything in Divine Supporter', 'Weekly live sessions', 'Custom content requests', 'Priority messaging'],
      popular: true,
    },
    {
      name: 'Olympian Elite',
      price: '$19.99',
      period: '/month',
      icon: Crown,
      color: 'from-yellow-500 to-amber-500',
      features: ['Everything in Celestial Patron', 'Daily interactions', 'Video calls', 'Exclusive merchandise'],
    },
  ];

  return (
    <div className="px-8 py-16 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl font-bold text-slate-100 mb-4 flex items-center justify-center gap-3">
            <Zap className="w-10 h-10 text-yellow-400" />
            Divine Subscription Tiers
          </h3>
          <p className="text-slate-400 text-xl">Support this divine creator and unlock exclusive content</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border-2 ${
                tier.popular ? 'border-purple-500/50' : 'border-slate-700/30'
              } group overflow-hidden`}
            >
              {tier.popular && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-bold px-4 py-2 rounded-bl-2xl rounded-tr-3xl">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tier.icon className="w-full h-full text-white" />
                </div>
                <h4 className="text-2xl font-bold text-slate-100 mb-2">{tier.name}</h4>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-100">{tier.price}</span>
                  <span className="text-slate-400">{tier.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-bold py-3 rounded-2xl`}>
                <Gift className="w-5 h-5 mr-2" />
                Subscribe Now
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
