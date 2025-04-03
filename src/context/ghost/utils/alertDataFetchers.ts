
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches flagged content from Supabase
 */
export const fetchFlaggedContent = async () => {
  return supabase
    .from('flagged_content')
    .select(`
      id, 
      content_id,
      content_type,
      reason,
      status,
      severity,
      flagged_at,
      user_id,
      profiles:user_id(username, avatar_url)
    `)
    .eq('status', 'flagged')
    .order('flagged_at', { ascending: false })
    .limit(50);
};

/**
 * Fetches reports from Supabase
 */
export const fetchReports = async () => {
  return supabase
    .from('reports')
    .select(`
      id,
      content_type,
      content_id,
      reason,
      description,
      status,
      created_at,
      is_emergency,
      reporter_id,
      reported_id,
      profiles:reporter_id(username, avatar_url)
    `)
    .eq('status', 'pending')
    .order('is_emergency', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);
};

/**
 * Fetches DMCA requests from Supabase
 */
export const fetchDmcaRequests = async () => {
  return supabase
    .from('dmca_requests')
    .select(`
      id,
      content_type,
      status,
      created_at,
      reporter_id,
      content_id,
      profiles:reporter_id(username, avatar_url)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20);
};
