
import { AdCard } from "./AdCard";
import { type DatingAd } from "./types/dating";

interface AdListProps {
  ads: DatingAd[] | undefined;
  isLoading: boolean;
}

export const AdList = ({ ads, isLoading }: AdListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[100px] text-gray-400 text-sm">
        No ads found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};
