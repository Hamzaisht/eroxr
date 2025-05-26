
interface MainFeedProps {
  userId: string;
  isPayingCustomer: boolean;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList) => void;
  onOpenGoLive: () => void;
}

export const MainFeed = ({ 
  userId, 
  isPayingCustomer, 
  onOpenCreatePost, 
  onFileSelect, 
  onOpenGoLive 
}: MainFeedProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <button
          onClick={onOpenCreatePost}
          className="w-full bg-luxury-primary text-white py-2 px-4 rounded-md hover:bg-luxury-primary/90"
        >
          Create Post
        </button>
      </div>
      
      {isPayingCustomer && (
        <div className="bg-gray-800 rounded-lg p-4">
          <button
            onClick={onOpenGoLive}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Go Live
          </button>
        </div>
      )}
      
      <div className="text-center text-gray-400">
        <p>No posts to show yet</p>
      </div>
    </div>
  );
};
