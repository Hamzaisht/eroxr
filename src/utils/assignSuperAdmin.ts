import { supabase } from '@/integrations/supabase/client';

export const assignCurrentUserAsSuperAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    const { data, error } = await supabase
      .rpc('assign_super_admin', { target_user_id: user.id });

    if (error) {
      console.error('Error assigning super admin role:', error);
      return false;
    }

    console.log('✅ Successfully assigned super admin role to user:', user.id);
    return true;
  } catch (error) {
    console.error('Error in assignCurrentUserAsSuperAdmin:', error);
    return false;
  }
};