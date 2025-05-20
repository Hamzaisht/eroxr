
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types/database.types';

/**
 * Type-safe function for creating post entries
 */
export const createPost = async (postData: Database['public']['Tables']['posts']['Insert']) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Type-safe function for updating profile status
 */
export const updateProfileStatus = async (
  userId: string, 
  status: Database['public']['Tables']['profiles']['Update']['status']
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId as string);

  if (error) throw error;
  return data;
};

/**
 * Type-safe function for updating profile fields
 */
export const updateProfileFields = async (
  userId: string,
  updateData: Database['public']['Tables']['profiles']['Update']
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId as string);

  if (error) throw error;
  return data;
};

/**
 * Type-safe function for fetching user profile
 */
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId as string)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Type-safe function for updating reports
 */
export const updateReportStatus = async (
  reportId: string,
  status: 'pending' | 'resolved' | 'rejected'
) => {
  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId as string);

  if (error) throw error;
  return data;
};

/**
 * Type-safe way to extract data from query results
 */
export function extractData<T>(queryResult: { data: T | null, error: any }): T | null {
  if (queryResult.error) {
    console.error('Database query error:', queryResult.error);
    return null;
  }
  return queryResult.data;
}
