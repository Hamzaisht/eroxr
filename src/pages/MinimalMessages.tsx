import { useState, memo, useCallback, useMemo } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { InteractiveNav } from '@/components/layout/InteractiveNav';
import { LuxuryGradientBackground } from '@/components/ui/luxury-gradient-background';
import { LuxuryGlassCard } from '@/components/ui/luxury-glass-card';
import { motion } from 'framer-motion';

const MinimalMessages = memo(() => {
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <>
        <InteractiveNav />
        <LuxuryGradientBackground />
        <div className="min-h-screen flex items-center justify-center p-8">
          <LuxuryGlassCard variant="accent" className="max-w-md w-full p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-6xl mb-6"
              >
                💎
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Luxury Access Required
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Please sign in to experience our premium messaging suite
              </p>
            </div>
          </LuxuryGlassCard>
        </div>
      </>
    );
  }

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20">
        <LuxuryGradientBackground />
        <div className="min-h-screen relative z-10">
          <div className="flex min-h-screen">
            <LuxuryGlassCard 
              variant="secondary" 
              className="w-96 m-4 mr-2 flex flex-col border-slate-700/30"
              intensity="heavy"
            >
              <div className="p-6">
                <h3 className="text-white text-lg font-semibold">Messages</h3>
                <p className="text-white/60">Testing minimal version</p>
              </div>
            </LuxuryGlassCard>

            <div className="flex-1 flex m-4 ml-2 gap-4">
              <LuxuryGlassCard 
                variant="primary" 
                className="flex-1 flex flex-col"
                intensity="heavy"
              >
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">
                      Minimal Messages Test
                    </h1>
                    <p className="text-white/70">
                      This is a minimal version to test for component issues
                    </p>
                  </div>
                </div>
              </LuxuryGlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

MinimalMessages.displayName = 'MinimalMessages';

export default MinimalMessages;