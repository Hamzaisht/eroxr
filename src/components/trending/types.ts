export interface TrendingCreator {
  creator_id: string;
  creator_username: string;
  creator_avatar: string | null;
  likes: number;
  comments: number;
  media_interactions: number;
  trending_rank: number;
}