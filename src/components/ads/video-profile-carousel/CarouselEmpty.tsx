
import { Video } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CarouselEmptyProps {
  message: string;
}

export const CarouselEmpty = ({ message }: CarouselEmptyProps) => {
  return (
    <Card className="flex flex-col items-center justify-center p-10 h-[300px] bg-gray-900 text-gray-400 rounded-lg">
      <Video className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-center">{message}</p>
    </Card>
  );
};
