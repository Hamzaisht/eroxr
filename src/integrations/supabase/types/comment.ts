import { Creator } from './profile';

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  creator: Creator;
};

export type CommentInsert = {
  id?: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export type CommentUpdate = {
  id?: string;
  post_id?: string;
  user_id?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
};