
import { UniversalUploader } from '@/components/upload/UniversalUploader';
import { MediaAccessLevel } from '@/utils/media/types';

interface MediaUploadSectionProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  defaultAccessLevel?: MediaAccessLevel;
  showAccessSelector?: boolean;
  maxFiles?: number;
  className?: string;
}

export const MediaUploadSection = ({
  onUploadComplete,
  defaultAccessLevel = MediaAccessLevel.PUBLIC,
  showAccessSelector = true,
  maxFiles = 10,
  className = ""
}: MediaUploadSectionProps) => {
  return (
    <UniversalUploader
      onUploadComplete={onUploadComplete}
      maxFiles={maxFiles}
      acceptedTypes={['image/*', 'video/*']}
      defaultAccessLevel={defaultAccessLevel}
      showAccessSelector={showAccessSelector}
      showPPV={true}
      category="posts"
      className={className}
    />
  );
};
