
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, Heart, MessageSquare, DollarSign, Video, Image as ImageIcon } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'video' | 'photo';
  created_at: string;
  views: number;
  likes: number;
  comments: number;
  earnings: number;
  engagement: number;
}

interface ContentPerformanceProps {
  data: ContentItem[];
  isLoading: boolean;
}

export const ContentPerformance = ({ data, isLoading }: ContentPerformanceProps) => {
  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>See which of your content is performing best</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({length: 5}).map((_, i) => (
              <div 
                key={i} 
                className="h-12 bg-luxury-darker/50 rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by engagement (sum of likes, comments and views)
  const sortedData = [...data].sort((a, b) => b.engagement - a.engagement).slice(0, 5);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Top Performing Content</CardTitle>
        <CardDescription>See which of your content is performing best</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No content data available
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.type === 'video' ? (
                        <Video size={16} className="text-luxury-primary" />
                      ) : (
                        <ImageIcon size={16} className="text-luxury-accent" />
                      )}
                      <Badge variant={item.type === 'video' ? 'default' : 'secondary'}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(item.created_at), 'PP')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {item.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="text-red-500" />
                        {item.likes.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} className="text-blue-500" />
                        {item.comments.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 font-medium">
                      <DollarSign size={14} className="text-green-500" />
                      {item.earnings.toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
