
import { FilePreviewItem } from "./FilePreviewItem";

interface FilePreviewGridProps {
  selectedFiles: FileList;
  filePreviews: {[key: string]: string};
  uploadSuccess: boolean;
  uploadInProgress: boolean;
}

export const FilePreviewGrid = ({
  selectedFiles,
  filePreviews,
  uploadSuccess,
  uploadInProgress
}: FilePreviewGridProps) => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        {Array.from(selectedFiles).map((file, index) => {
          const previewKey = `${file.name}-${index}`;
          const preview = filePreviews[previewKey];
          
          return (
            <FilePreviewItem
              key={index}
              file={file}
              index={index}
              preview={preview}
              uploadSuccess={uploadSuccess}
              uploadInProgress={uploadInProgress}
            />
          );
        })}
      </div>
    </div>
  );
};
