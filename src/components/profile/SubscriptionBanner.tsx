import { Button } from "@/components/ui/button";

interface SubscriptionBannerProps {
  username: string;
  price: number;
}

export const SubscriptionBanner = ({ username, price }: SubscriptionBannerProps) => {
  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-luxury-dark/80 to-luxury-primary/20 backdrop-blur-lg border border-luxury-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Subscribe to {username}</h3>
          <p className="text-luxury-neutral/70">Get exclusive access to premium content</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-luxury-primary mb-1">
            ${price}<span className="text-sm text-luxury-neutral/70">/month</span>
          </div>
          <Button className="bg-luxury-primary hover:bg-luxury-secondary">
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};