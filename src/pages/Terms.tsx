import { MainNav } from "@/components/MainNav";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2>2. User Account</h2>
          <p>To use certain features of the website, you must register for an account. You agree to provide accurate information and keep it updated.</p>

          <h2>3. Privacy Policy</h2>
          <p>Your use of the website is also governed by our Privacy Policy.</p>

          <h2>4. Content</h2>
          <p>Users are responsible for the content they post and share on the platform.</p>

          <h2>5. Prohibited Activities</h2>
          <ul>
            <li>Violating laws or regulations</li>
            <li>Harassing or discriminating against other users</li>
            <li>Spreading malware or viruses</li>
            <li>Attempting to gain unauthorized access</li>
          </ul>

          <h2>6. Termination</h2>
          <p>We reserve the right to terminate or suspend your account at our discretion.</p>

          <h2>7. Changes to Terms</h2>
          <p>We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>

          <h2>Contact</h2>
          <p>For questions about these Terms, please contact us at support@example.com</p>
        </div>
      </main>
    </div>
  );
};

export default Terms;