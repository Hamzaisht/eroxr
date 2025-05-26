
import { UniversalUploader } from '@/components/upload/UniversalUploader';
import { MediaAccessLevel } from '@/utils/media/types';

interface ProfileMediaUploaderProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  type: 'avatar' | 'media';
  className?: string;
}

export const ProfileMediaUploader = ({
  onUploadComplete,
  type,
  className = ""
}: ProfileMediaUploaderProps) => {
  const isAvatar = type === 'avatar';

  return (
    <UniversalUploader
      onUploadComplete={onUploadComplete}
      maxFiles={isAvatar ? 1 : 20}
      acceptedTypes={isAvatar ? ['image/*'] : ['image/*', 'video/*']}
      defaultAccessLevel={isAvatar ? MediaAccessLevel.PUBLIC : MediaAccessLevel.SUBSCRIBERS}
      showAccessSelector={!isAvatar}
      showPPV={!isAvatar}
      category={isAvatar ? 'avatars' : 'profile_media'}
      className={className}
    />
  );
};
