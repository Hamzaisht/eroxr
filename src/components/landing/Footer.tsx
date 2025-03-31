
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile";

const Footer = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const footerLinks = {
    creators: [{
      label: "Podcasters",
      href: "/creators/podcasters"
    }, {
      label: "Video Creators",
      href: "/creators/video"
    }, {
      label: "Musicians",
      href: "/creators/musicians"
    }, {
      label: "Visual Artists",
      href: "/creators/artists"
    }, {
      label: "Writers",
      href: "/creators/writers"
    }],
    features: [{
      label: "Create on Your Terms",
      href: "/features/terms"
    }, {
      label: "Build Your Community",
      href: "/features/community"
    }, {
      label: "Business Tools",
      href: "/features/business"
    }, {
      label: "Monetization",
      href: "/features/monetization"
    }, {
      label: "Start Membership",
      href: "/start"
    }],
    resources: [{
      label: "Creator Hub",
      href: "/resources/hub"
    }, {
      label: "Blog",
      href: "/blog"
    }, {
      label: "Help Center",
      href: "/help"
    }, {
      label: "Partners & Integrations",
      href: "/partners"
    }, {
      label: "Mobile App",
      href: "/mobile"
    }],
    company: [{
      label: "About",
      href: "/about"
    }, {
      label: "Careers",
      href: "/careers"
    }, {
      label: "Privacy Policy",
      href: "/privacy"
    }, {
      label: "Terms of Service",
      href: "/terms"
    }, {
      label: "Accessibility",
      href: "/accessibility"
    }]
  };
  
  return (
    <footer className="bg-luxury-darker text-luxury-neutral/80 py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          <div>
            <h3 className="text-luxury-neutral font-semibold mb-3 md:mb-4 text-sm md:text-base">Creators</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              {footerLinks.creators.map(link => <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-neutral font-semibold mb-3 md:mb-4 text-sm md:text-base">Features</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              {footerLinks.features.map(link => <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-neutral font-semibold mb-3 md:mb-4 text-sm md:text-base">Resources</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              {footerLinks.resources.map(link => <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-luxury-neutral font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              {footerLinks.company.map(link => <li key={link.href}>
                  <Link to={link.href} className="hover:text-luxury-primary transition-colors">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        <div className="border-t border-luxury-neutral/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 md:space-x-6 mb-4 md:mb-0">
              {/* Social Media Buttons with Hover Animation */}
              <a href="https://twitter.com" className="group relative inline-block overflow-hidden px-2 py-2 text-white hover:text-luxury-primary transition-colors">
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  <Twitter className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
                <span className="absolute left-0 top-0 h-full w-full flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  <Twitter className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
              </a>

              <a href="https://facebook.com" className="group relative inline-block overflow-hidden px-2 py-2 text-white hover:text-luxury-primary transition-colors">
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  <Facebook className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
                <span className="absolute left-0 top-0 h-full w-full flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  <Facebook className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
              </a>

              <a href="https://instagram.com" className="group relative inline-block overflow-hidden px-2 py-2 text-white hover:text-luxury-primary transition-colors">
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  <Instagram className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
                <span className="absolute left-0 top-0 h-full w-full flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  <Instagram className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
              </a>

              <a href="https://youtube.com" className="group relative inline-block overflow-hidden px-2 py-2 text-white hover:text-luxury-primary transition-colors">
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  <Youtube className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
                <span className="absolute left-0 top-0 h-full w-full flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  <Youtube className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </span>
              </a>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              <Link to="/app-store" className="hover:opacity-80 transition-opacity">
                <img src="/app-store-badge.png" alt="Download on App Store" className="h-8 md:h-10" />
              </Link>
              <Link to="/play-store" className="hover:opacity-80 transition-opacity">
                <img src="/play-store-badge.png" alt="Get it on Google Play" className="h-8 md:h-10" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 md:mt-8 text-xs md:text-sm text-luxury-neutral/60">
            <p>© 2025 Eroxr. All rights reserved.</p>
            <p className="mt-1 md:mt-2">Hades IO | Sweden | <a href="https://www.eroxr.se" className="hover:text-luxury-primary transition-colors">www.eroxr.se</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
