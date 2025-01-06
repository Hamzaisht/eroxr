import { Card } from "@/components/ui/card";

interface ContentPreviewProps {
  content: string;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  if (!content) return null;
  
  return (
    <Card className="p-4 bg-luxury-dark/30 border-luxury-neutral/10">
      <h3 className="text-sm font-medium mb-2">Preview</h3>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </Card>
  );
};