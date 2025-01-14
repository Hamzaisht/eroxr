interface LiveStreamsProps {
  onGoLive: () => void;
}

export const LiveStreams = ({ onGoLive }: LiveStreamsProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Live Streams</h2>
        <button
          onClick={onGoLive}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Live
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center text-gray-500">No live streams at the moment</div>
      </div>
    </div>
  );
};