
interface ShortsFeedProps {
  specificShortId?: string | null;
}

export const ShortsFeed = ({ specificShortId }: ShortsFeedProps) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Shorts Feed</h2>
        {specificShortId && (
          <p className="text-gray-400">Playing short: {specificShortId}</p>
        )}
        <p className="text-gray-400">Short videos will be displayed here</p>
      </div>
    </div>
  );
};
