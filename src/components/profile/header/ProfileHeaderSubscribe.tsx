
import { ProfileHeaderProps } from '../types';

export const ProfileHeaderSubscribe = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  if (isOwnProfile) return null;

  return (
    <button className="w-full py-2 bg-luxury-primary text-white rounded-md hover:bg-luxury-primary/90">
      Subscribe for Premium Content
    </button>
  );
};
