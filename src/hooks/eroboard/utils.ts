
import { format } from "date-fns";

export const calculateEngagementRate = (posts: any[] = []) => {
  if (!posts || posts.length === 0) return 0;
  
  const totalEngagements = posts.reduce((sum, post) => {
    return sum + (post.likes_count || 0) + (post.comments_count || 0);
  }, 0);
  
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
  
  return totalViews > 0 
    ? Math.round((totalEngagements / totalViews) * 100) 
    : 0;
};

export const calculateTimeOnPlatform = (userId: string) => {
  // This is currently a placeholder function that returns a random number
  // In a real implementation, this would calculate actual time based on user data
  return Math.floor(Math.random() * 365) + 30;
};

export const generateMockEngagementData = (startDate: Date, endDate: Date) => {
  const data = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      count: Math.floor(Math.random() * 100) + 20
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};
