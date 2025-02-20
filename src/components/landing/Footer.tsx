
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    creators: [
      { label: "Podcasters", href: "/creators/podcasters" },
      { label: "Video Creators", href: "/creators/video" },
      { label: "Musicians", href: "/creators/musicians" },
      { label: "Visual Artists", href: "/creators/artists" },
      { label: "Writers", href: "/creators/writers" },
    ],
    features: [
      { label: "Create on Your Terms", href: "/features/terms" },
      { label: "Build Your Community", href: "/features/community" },
      { label: "Business Tools", href: "/features/business" },
      { label: "Monetization", href: "/features/monetization" },
      { label: "Start Membership", href: "/start" },
    ],
    resources: [
      { label: "Creator Hub", href: "/resources/hub" },
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "Partners & Integrations", href: "/partners" },
      { label: "Mobile App", href: "/mobile" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  };

  return (
    <footer className="bg-luxury-darker text-luxury-neutral/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-luxury-neutral font-semibold mb-4">Creators</h3>
            <ul className="space-y-2">
              {footerLinks.creators.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-neutral font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-neutral font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-neutral font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-luxury-neutral/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="https://twitter.com" className="hover:text-luxury-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="hover:text-luxury-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="hover:text-luxury-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="hover:text-luxury-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/app-store" className="hover:opacity-80 transition-opacity">
                <img src="/app-store-badge.png" alt="Download on App Store" className="h-10" />
              </Link>
              <Link to="/play-store" className="hover:opacity-80 transition-opacity">
                <img src="/play-store-badge.png" alt="Get it on Google Play" className="h-10" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-luxury-neutral/60">
            <p>© 2024 Eroxr. All rights reserved.</p>
            <p className="mt-2">1234 Creator Street, Suite 100 | San Francisco, CA 94103, USA</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
