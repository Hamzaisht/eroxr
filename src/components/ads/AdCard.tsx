import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, User, Calendar } from "lucide-react";
import { type DatingAd } from "./types";

interface AdCardProps {
  ad: DatingAd;
}

export const AdCard = ({ ad }: AdCardProps) => {
  return (
    <Card className="bg-[#403E43] border-none text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold mb-2 text-[#1EAEDB]">{ad.title}</h3>
            <Badge
              variant="secondary"
              className="capitalize bg-[#221F26] text-[#1EAEDB]"
            >
              {ad.relationship_status}
            </Badge>
          </div>
        </div>
        <p className="text-gray-300 mb-4">{ad.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="h-4 w-4 text-[#1EAEDB]" />
            {ad.city}, {ad.country}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <User className="h-4 w-4 text-[#1EAEDB]" />
            Looking for: {ad.looking_for.join(", ")}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="h-4 w-4 text-[#1EAEDB]" />
            Age range: {ad.age_range.lower} - {ad.age_range.upper}
          </div>
        </div>
        <Button className="w-full bg-[#1EAEDB] hover:bg-[#33C3F0]">
          <Heart className="w-4 h-4 mr-2" />
          Contact
        </Button>
      </div>
    </Card>
  );
};