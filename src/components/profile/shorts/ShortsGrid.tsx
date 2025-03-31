
import { ShortItem } from "./ShortItem";
import { Post } from "./types";

interface ShortsGridProps {
  shorts: Post[];
  isOwner: boolean;
  onSelectShort: (short: Post) => void;
  onDeleteShort: (shortId: string) => void;
}

export const ShortsGrid = ({ shorts, isOwner, onSelectShort, onDeleteShort }: ShortsGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {shorts.map((short) => (
        <ShortItem
          key={short.id}
          short={short}
          isOwner={isOwner}
          onSelect={onSelectShort}
          onDelete={onDeleteShort}
        />
      ))}
    </div>
  );
};
