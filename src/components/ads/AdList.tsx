import { AdCard } from "./AdCard";
import { type DatingAd } from "./types";

interface AdListProps {
  ads: DatingAd[] | undefined;
  isLoading: boolean;
}

export const AdList = ({ ads, isLoading }: AdListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1EAEDB]"></div>
      </div>
    );
  }

  if (!ads?.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-gray-400">
        No ads found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};