import { MainNav } from "@/components/MainNav";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Update your profile</li>
            <li>Communicate with other users</li>
            <li>Contact our support team</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and updates</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties.</p>

          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>

          <h2>6. Changes to Privacy Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

          <h2>Contact</h2>
          <p>For questions about this Privacy Policy, please contact us at privacy@example.com</p>
        </div>
      </main>
    </div>
  );
};

export default Privacy;