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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#2A1F3D] border-none text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Premium Badge */}
      {ad.is_premium && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-none">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
      
      {/* Verified Badge */}
      {ad.is_verified && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-none">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#1EAEDB] to-[#33C3F0] bg-clip-text text-transparent">
              {ad.title}
            </h3>
            <Badge variant="secondary" className="capitalize bg-[#2D2A34] text-[#1EAEDB] border-none">
              {ad.relationship_status}
            </Badge>
          </div>

          <p className="text-gray-300 line-clamp-3">{ad.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="h-4 w-4 text-[#1EAEDB]" />
              <span className="capitalize">{ad.city}, {ad.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User className="h-4 w-4 text-[#1EAEDB]" />
              <span className="capitalize">Looking for: {ad.looking_for.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="h-4 w-4 text-[#1EAEDB]" />
              Age range: {ad.age_range.lower} - {ad.age_range.upper}
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-[#1EAEDB] to-[#33C3F0] hover:from-[#33C3F0] hover:to-[#1EAEDB] border-none transition-all duration-300">
            <Heart className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
};