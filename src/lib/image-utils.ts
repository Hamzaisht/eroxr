import { CSSProperties } from 'react';

type AspectRatio = '1:1' | '4:5' | '9:16';

interface ImageDimensions {
  width: number;
  height: number;
}

const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, ImageDimensions> = {
  '1:1': { width: 1080, height: 1080 },   // Square - optimal for profile pictures and grid views
  '4:5': { width: 1080, height: 1350 },   // Vertical portrait - Instagram's preferred ratio
  '9:16': { width: 1080, height: 1920 },  // Vertical full - Stories/TikTok style
};

export const getImageStyles = (aspectRatio: AspectRatio = '4:5'): CSSProperties => {
  const dimensions = ASPECT_RATIO_DIMENSIONS[aspectRatio];
  return {
    imageRendering: "auto" as const,
    width: '100%',
    height: '100%',
    objectFit: "cover" as const,
  };
};

export const getEnlargedImageStyles = (): CSSProperties => ({
  imageRendering: "auto" as const,
  maxWidth: "95vw",
  maxHeight: "95vh",
  objectFit: "contain" as const,
});

export const generateSrcSet = (url: string, aspectRatio: AspectRatio = '4:5') => {
  if (!url) return undefined;
  
  const dimensions = ASPECT_RATIO_DIMENSIONS[aspectRatio];
  const widths = [dimensions.width, dimensions.width * 1.5, dimensions.width * 2];
  
  return widths
    .map((w) => {
      const srcUrl = new URL(url);
      srcUrl.searchParams.set('width', w.toString());
      srcUrl.searchParams.set('quality', '100');
      return `${srcUrl.toString()} ${w}w`;
    })
    .join(', ');
};

export const getResponsiveSizes = (aspectRatio: AspectRatio = '4:5') => {
  const dimensions = ASPECT_RATIO_DIMENSIONS[aspectRatio];
  return `(max-width: ${dimensions.width}px) 100vw, ${dimensions.width}px`;
};

export const getAspectRatioFromDimensions = (width: number, height: number): AspectRatio => {
  const ratio = width / height;
  if (ratio === 1) return '1:1';
  if (Math.abs(ratio - 4/5) < 0.1) return '4:5';
  if (Math.abs(ratio - 9/16) < 0.1) return '9:16';
  return '4:5'; // Default to 4:5 for social feed optimization
};