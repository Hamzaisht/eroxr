import { supabase } from '@/integrations/supabase/client';

export const assignCurrentUserAsSuperAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    // Check if user is already a super admin
    const { data: isSuperAdmin } = await supabase
      .rpc('is_super_admin', { user_id: user.id });

    if (isSuperAdmin) {
      console.log('User is already a super admin');
      return true;
    }

    const { data, error } = await supabase
      .rpc('assign_super_admin', { target_user_id: user.id });

    if (error) {
      console.error('Error assigning super admin role:', error);
      console.error('This function now requires existing super admin privileges for security');
      return false;
    }

    console.log('✅ Successfully assigned super admin role to user:', user.id);
    return true;
  } catch (error) {
    console.error('Error in assignCurrentUserAsSuperAdmin:', error);
    return false;
  }
};