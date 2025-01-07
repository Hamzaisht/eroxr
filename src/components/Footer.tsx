import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="border-t border-luxury-neutral/10 bg-luxury-dark py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-luxury-neutral mb-4">Product</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Features</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Security</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Roadmap</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-luxury-neutral mb-4">Company</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">About</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Contact</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-luxury-neutral mb-4">Resources</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Community</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-luxury-neutral mb-4">Connect</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Discord</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-luxury-primary cursor-pointer transition-colors">LinkedIn</li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 border-t border-luxury-neutral/10 pt-8 text-center text-luxury-neutral/60"
        >
          <p>© 2024 All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};