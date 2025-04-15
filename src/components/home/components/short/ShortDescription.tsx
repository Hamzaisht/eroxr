
import { memo } from "react";

interface ShortDescriptionProps {
  content: string;
  username: string;
}

export const ShortDescription = memo(({ content, username }: ShortDescriptionProps) => {
  if (!content) return null;
  
  return (
    <div className="mb-4">
      <p className="text-white">
        <span className="font-bold mr-1">{username}</span>
        <span>{content}</span>
      </p>
    </div>
  );
});

ShortDescription.displayName = "ShortDescription";
