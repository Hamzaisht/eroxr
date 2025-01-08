import { usePostLikes } from "./hooks/usePostLikes";
import { usePostDeletion } from "./hooks/usePostDeletion";

export const usePostActions = () => {
  const { handleLike } = usePostLikes();
  const { handleDelete } = usePostDeletion();

  return {
    handleLike,
    handleDelete,
  };
};