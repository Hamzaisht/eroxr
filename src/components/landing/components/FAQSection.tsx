
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I start earning?",
    answer: "Sign up, complete your profile, and start creating content. Our platform provides multiple monetization options including subscriptions, tips, and exclusive content sales."
  },
  {
    question: "What are the platform fees?",
    answer: "We maintain competitive rates with a simple, transparent fee structure. Creators keep up to 85% of their earnings."
  },
  {
    question: "How do payouts work?",
    answer: "Payouts are processed automatically every week, with multiple payout options including bank transfer and cryptocurrency."
  },
  {
    question: "Can I migrate my existing audience?",
    answer: "Yes! We provide tools to help you seamlessly transition your existing audience to our platform."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border border-luxury-primary/20 rounded-xl overflow-hidden bg-luxury-dark/50 backdrop-blur-lg">
                <AccordionTrigger className="px-4 py-4 hover:bg-luxury-darker/30 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4 text-luxury-neutral">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
