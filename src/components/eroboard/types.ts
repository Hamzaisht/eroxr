
import { MediaType } from "@/utils/media/types";

export interface Creator {
  id: string;
  name: string;
  avatar?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  creator: Creator;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  description?: string;
  tags?: string[];
}
