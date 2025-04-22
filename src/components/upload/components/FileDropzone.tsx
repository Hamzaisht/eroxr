
import { useDropzone, Accept } from 'react-dropzone';
import { FilePlus } from 'lucide-react';

interface FileDropzoneProps {
  onDrop: (files: File[]) => void;
  acceptTypes: Accept;
  maxSizeInBytes: number;
  maxFiles: number;
  maxSizeInMB: number;
}

export const FileDropzone = ({
  onDrop,
  acceptTypes,
  maxSizeInBytes,
  maxFiles,
  maxSizeInMB
}: FileDropzoneProps) => {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: acceptTypes,
    maxSize: maxSizeInBytes,
    multiple: true
  });

  return (
    <div 
      {...getRootProps()}
      className="relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
    >
      <input {...getInputProps()} />
      <FilePlus className="h-6 w-6 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        (Max {maxSizeInMB}MB per file, {maxFiles} files, {Object.keys(acceptTypes).map(type => type.split('/')[1]).join(', ')} allowed)
      </p>
    </div>
  );
};
