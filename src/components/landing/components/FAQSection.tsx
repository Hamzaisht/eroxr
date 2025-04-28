
import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const faqs = [
  {
    question: "How do I get started on EROXR?",
    answer: "Getting started is easy! Sign up for a free account, set up your profile, and start creating exclusive content for your subscribers. Our onboarding process will guide you through each step."
  },
  {
    question: "What are the fees for creators?",
    answer: "EROXR takes a small percentage of your earnings to maintain the platform. Creators keep 80% of all subscription revenue, which is among the highest payout rates in the industry."
  },
  {
    question: "How often do creators get paid?",
    answer: "Creators are paid monthly, with payments processed within the first 5 business days of each month for the previous month's earnings. We offer multiple payout methods for your convenience."
  },
  {
    question: "Can I offer different subscription tiers?",
    answer: "Yes! You can create multiple subscription tiers with different pricing and perks to give your fans options that match their budget and level of interest in your content."
  },
  {
    question: "Is my content protected on the platform?",
    answer: "Absolutely. We implement robust DRM measures, watermarking, and anti-piracy technologies to help protect your content from unauthorized distribution."
  },
  {
    question: "Can I migrate my audience from other platforms?",
    answer: "Yes, we provide tools to help you transition your audience from other platforms. Our team can also provide personalized support for larger creators making the switch."
  }
];

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-luxury-neutral/80 max-w-2xl mx-auto text-lg">
            Get answers to the most common questions about EROXR
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="border border-luxury-primary/20 rounded-lg overflow-hidden premium-card"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <span className="text-luxury-primary ml-2 transform transition-transform duration-300">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {activeIndex === index && (
                <motion.div 
                  initial={prefersReducedMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                  animate={prefersReducedMotion ? { opacity: 1, height: "auto" } : { opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-luxury-neutral/80">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
