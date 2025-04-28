
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I start earning?",
    answer: "Sign up, complete your profile, and start creating content. Our platform provides multiple monetization options including subscriptions, tips, and exclusive content sales. Our dedicated success team will guide you through the setup process."
  },
  {
    question: "What are the platform fees?",
    answer: "We maintain competitive rates with a simple, transparent fee structure. Creators keep up to 85% of their earnings. There are no hidden fees or charges - what you see is what you get."
  },
  {
    question: "How do payouts work?",
    answer: "Payouts are processed automatically every week, with multiple payout options including bank transfer and cryptocurrency. You can set your preferred payment method in your account settings."
  },
  {
    question: "Can I migrate my existing audience?",
    answer: "Yes! We provide tools to help you seamlessly transition your existing audience to our platform. Our audience migration toolkit makes it easy to bring your followers along."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide 24/7 creator support through live chat, email, and phone. Our dedicated account managers are available for all premium creators to help optimize your strategy and earnings."
  },
  {
    question: "Is my content protected?",
    answer: "Absolutely. We employ industry-leading DRM technology, watermarking, and anti-piracy measures to ensure your content remains secure and is only accessible to paying subscribers."
  }
];

export const FAQSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-luxury-primary/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-luxury-accent/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-luxury-primary/5 rounded-full blur-[150px] opacity-20" />
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-luxury-neutral/80 max-w-2xl mx-auto text-lg">
            Everything you need to know about creating on EROXR
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
                className="group"
              >
                <AccordionItem value={`item-${index}`} className="premium-card overflow-hidden border border-luxury-primary/20 group-hover:shadow-premium transition-all duration-500">
                  <AccordionTrigger className="px-6 py-5 hover:bg-luxury-darker/30 transition-colors text-lg font-display font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-5 text-luxury-neutral bg-gradient-to-r from-transparent via-luxury-primary/5 to-transparent">
                    <p className="leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        {/* Contact section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-luxury-neutral/90">
            Still have questions? <a href="#contact" className="text-luxury-primary hover:text-luxury-accent underline">Contact our support team</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
