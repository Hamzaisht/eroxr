
import { UniversalUploader } from '@/components/upload/UniversalUploader';
import { MediaAccessLevel } from '@/utils/media/types';

interface MediaUploadFieldProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  className?: string;
}

export const MediaUploadField = ({
  onUploadComplete,
  className = ""
}: MediaUploadFieldProps) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-luxury-neutral mb-2 block">
        Photos (Optional)
      </label>
      <UniversalUploader
        onUploadComplete={onUploadComplete}
        maxFiles={5}
        acceptedTypes={['image/*']}
        defaultAccessLevel={MediaAccessLevel.PUBLIC}
        showAccessSelector={false}
        showPPV={false}
        category="dating_ads"
      />
    </div>
  );
};
