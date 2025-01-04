import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign } from "lucide-react";

const promotedAds = [
  {
    title: "Looking for Creative Photographer",
    category: "Photography",
    location: "Remote / Worldwide",
    budget: "$500-1000",
    deadline: "2 weeks",
    description: "Seeking a talented photographer for a fashion brand campaign...",
  },
  {
    title: "Music Producer Needed",
    category: "Music",
    location: "Los Angeles, CA",
    budget: "$2000-3000",
    deadline: "1 month",
    description: "Professional music producer needed for upcoming album...",
  },
  {
    title: "Digital Artist for NFT Project",
    category: "Digital Art",
    location: "Remote",
    budget: "$1500-2500",
    deadline: "3 weeks",
    description: "Looking for an experienced digital artist to create unique NFTs...",
  },
];

export const PromotedAds = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Promoted Opportunities</h2>
            <p className="text-muted-foreground">
              Find exciting opportunities to collaborate and grow
            </p>
          </div>
          <Button>Post an Ad</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotedAds.map((ad) => (
            <Card key={ad.title} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold mb-2">{ad.title}</h3>
                  <Badge variant="secondary">{ad.category}</Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{ad.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {ad.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  {ad.budget}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {ad.deadline}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="w-full">Apply Now</Button>
                <Button variant="outline" className="w-full">
                  Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};