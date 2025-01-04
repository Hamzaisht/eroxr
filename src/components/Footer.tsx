export const Footer = () => {
  return (
    <footer className="border-t border-luxury-neutral/10 bg-luxury-dark py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-luxury-neutral mb-4">Product</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Roadmap</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-luxury-neutral mb-4">Company</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-luxury-neutral mb-4">Resources</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li>Documentation</li>
              <li>Help Center</li>
              <li>Community</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-luxury-neutral mb-4">Connect</h3>
            <ul className="space-y-2 text-luxury-neutral/60">
              <li>Twitter</li>
              <li>Discord</li>
              <li>Instagram</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-luxury-neutral/10 pt-8 text-center text-luxury-neutral/60">
          <p>© 2024 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};