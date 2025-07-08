import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AnimatedBackground } from './components/AnimatedBackground';
import { StepIndicator } from './components/StepIndicator';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { useCreateAdForm } from './hooks/useCreateAdForm';
import { CreateAdDialogProps } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const CreateAdDialog = ({ open, onOpenChange, onSuccess }: CreateAdDialogProps) => {
  const {
    currentStep,
    formData,
    isSubmitting,
    updateData,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    getProgress,
  } = useCreateAdForm();

  const totalSteps = 4;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  const stepProps = {
    data: formData,
    updateData,
    onNext: nextStep,
    onPrevious: previousStep,
    isFirstStep,
    isLastStep,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep {...stepProps} />;
      case 1:
        return <div className="text-white text-center py-20">Preferences Step - Coming Soon</div>;
      case 2:
        return <div className="text-white text-center py-20">Media Step - Coming Soon</div>;
      case 3:
        return <div className="text-white text-center py-20">Review Step - Coming Soon</div>;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-transparent border-none overflow-hidden">
        <div className="relative min-h-[90vh] w-full">
          {/* Animated Background */}
          <AnimatedBackground />
          
          {/* Main Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-8 pb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Create Your Dating Profile
                </h1>
                <p className="text-white/60 mt-1">Step {currentStep + 1} of {totalSteps}</p>
              </div>
              
              <motion.button
                onClick={handleClose}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              className="px-8 pb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress()}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-white/50">
                <span>Getting Started</span>
                <span>{getProgress()}% Complete</span>
                <span>Ready to Launch</span>
              </div>
            </motion.div>

            {/* Step Indicator */}
            <div className="px-8">
              <StepIndicator 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                onStepClick={goToStep} 
              />
            </div>

            {/* Step Content */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <motion.div 
              className="flex items-center justify-between p-8 pt-4 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={previousStep}
                disabled={isFirstStep}
                className="px-6 py-3 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={!isFirstStep ? { scale: 1.05 } : undefined}
                whileTap={!isFirstStep ? { scale: 0.95 } : undefined}
              >
                ← Previous
              </motion.button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i <= currentStep ? 'bg-purple-400' : 'bg-white/20'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={isLastStep ? () => submitForm(handleSuccess) : nextStep}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Creating...' : isLastStep ? 'Create Profile' : 'Next →'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};