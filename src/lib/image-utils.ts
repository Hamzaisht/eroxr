export const getImageStyles = (minWidth?: number, minHeight?: number) => ({
  imageRendering: "crisp-edges" as const,
  minWidth: minWidth ? `${minWidth}px` : undefined,
  minHeight: minHeight ? `${minHeight}px` : undefined,
  objectFit: "cover" as const,
});

export const getEnlargedImageStyles = () => ({
  imageRendering: "crisp-edges" as const,
});