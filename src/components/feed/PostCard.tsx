
export interface PostCardProps {
  post: any;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        <div>
          <p className="text-white font-semibold">{post.creator?.username || 'Anonymous'}</p>
          <p className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      {post.content && (
        <p className="text-gray-300">{post.content}</p>
      )}
      
      <div className="flex items-center space-x-4 pt-2 border-t border-gray-700">
        <button
          onClick={() => onLike(post.id)}
          className="text-gray-400 hover:text-red-500 flex items-center space-x-1"
        >
          <span>♥</span>
          <span>{post.likes_count || 0}</span>
        </button>
        
        {currentUserId === post.creator_id && (
          <button
            onClick={() => onDelete(post.id, post.creator_id)}
            className="text-gray-400 hover:text-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
