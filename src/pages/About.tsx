import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-luxury-dark py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-12">About Us</h1>
        
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-white/80 leading-relaxed">
            We're dedicated to creating a safe and inclusive space for creators and their audiences to connect, share, and grow together. Our platform empowers creative individuals to monetize their content while building meaningful relationships with their supporters.
          </p>
        </Card>
        
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Privacy & Security",
                description: "We prioritize the safety and privacy of our users above all else."
              },
              {
                title: "Transparency",
                description: "We believe in clear, honest communication with our community."
              },
              {
                title: "Innovation",
                description: "We continuously evolve to provide the best possible experience."
              },
              {
                title: "Community",
                description: "We foster a supportive environment for creators and fans alike."
              }
            ].map((value, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-medium text-white">{value.title}</h3>
                <p className="text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-white/80">
            Have questions or feedback? We'd love to hear from you. Reach out to our support team at support@example.com
          </p>
        </Card>
      </div>
    </div>
  );
};

export default About;