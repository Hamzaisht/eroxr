import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Shield, DollarSign, Users, Zap } from "lucide-react";

const faqs = [
  {
    icon: DollarSign,
    question: "How much can I really earn on EROXR?",
    answer: "Creators on EROXR earn anywhere from $500 to $50,000+ per month. Your earnings depend on your content quality, audience engagement, and consistency. Our top creators average $15,000/month, with many exceeding $25,000. With our 85% revenue share, you keep more of what you earn compared to other platforms."
  },
  {
    icon: Shield,
    question: "Is my content and personal information safe?",
    answer: "Absolutely. We use bank-grade 256-bit SSL encryption and AI-powered content protection. Your personal information is never shared, and we offer advanced privacy controls including geo-blocking and watermarking. All payments are processed through secure, PCI-compliant systems."
  },
  {
    icon: Zap,
    question: "How quickly do I get paid?",
    answer: "EROXR offers the fastest payouts in the industry. You can request daily payouts and receive your earnings within 24 hours. We support multiple payment methods including bank transfers, digital wallets, and cryptocurrency. Minimum payout is just $20."
  },
  {
    icon: Users,
    question: "Do I need a large following to start?",
    answer: "No! Many successful creators started with zero followers on EROXR. Our algorithm promotes quality content regardless of follower count. We provide built-in discovery tools, promotional support, and marketing guidance to help you grow your audience organically."
  },
  {
    icon: HelpCircle,
    question: "What kind of content performs best?",
    answer: "Authentic, consistent content performs best. This includes behind-the-scenes content, tutorials, personal stories, exclusive photos/videos, and interactive live streams. Our analytics show that creators who post 3-5 times per week see 300% higher engagement."
  },
  {
    icon: Shield,
    question: "What if I want to leave the platform?",
    answer: "You own your content and can download all your data at any time. There are no contracts or penalties for leaving. You can also temporarily pause your account without losing your subscriber base. We believe in creator freedom and transparency."
  }
];

export const FAQSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden py-20 px-4">
      {/* Premium Cinematic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/50 to-black" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/3 via-transparent to-black" />
        <div className="neural-mesh opacity-10" />
        
        {/* Elegant floating elements */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-600/6 to-pink-600/6 rounded-full liquid-bg" />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gradient-to-r from-blue-600/4 to-purple-600/4 rounded-full liquid-bg" style={{ animationDelay: '6s' }} />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Your Questions Answered
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Everything you need to know about starting your creator journey
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="glass-card-heavy morphing-card border border-gray-800/50 hover:border-purple-500/50 px-8 transition-all duration-700 overflow-hidden magnetic-hover glow-cinematic"
                >
                  <AccordionTrigger className="text-white hover:text-purple-300 py-6 text-left [&[data-state=open]]:text-purple-300 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <faq.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-lg font-semibold">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 leading-relaxed pb-6 pl-14">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Still Have Questions CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our creator success team is here to help you succeed
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ 24/7 Live Support</span>
              <span>✓ 1-on-1 Onboarding</span>
              <span>✓ Creator Community</span>
              <span>✓ Success Coaching</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};