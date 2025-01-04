import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, User, Calendar, Shield, Crown } from "lucide-react";
import { type DatingAd } from "./types";

interface AdCardProps {
  ad: DatingAd;
}

export const AdCard = ({ ad }: AdCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-[#1A1F2C]/50 backdrop-blur-sm border-none text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {ad.is_premium && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-none text-xs py-0.5">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
      
      {ad.is_verified && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-none text-xs py-0.5">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      )}

      <div className="p-3">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold mb-1 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent line-clamp-1">
              {ad.title}
            </h3>
            <Badge variant="secondary" className="capitalize bg-[#2D2A34]/50 text-[#9b87f5] border-none text-xs">
              {ad.relationship_status}
            </Badge>
          </div>

          <p className="text-gray-300 text-sm line-clamp-2">{ad.description}</p>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <MapPin className="h-3 w-3 text-[#9b87f5]" />
              <span className="capitalize">{ad.city}, {ad.country}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <User className="h-3 w-3 text-[#9b87f5]" />
              <span className="capitalize">Looking for: {ad.looking_for.join(", ")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Calendar className="h-3 w-3 text-[#9b87f5]" />
              Age range: {ad.age_range.lower} - {ad.age_range.upper}
            </div>
          </div>

          <Button size="sm" className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] border-none transition-all duration-300 text-xs">
            <Heart className="w-3 h-3 mr-1.5" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
};