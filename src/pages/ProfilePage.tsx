
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileContainer } from "@/components/profile/container/ProfileContainer";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    if (!username) {
      // If no username provided and user is logged in, redirect to their profile
      if (session?.user) {
        redirectToUserProfile();
      } else {
        setLoading(false);
        setProfileId(null);
      }
      return;
    }

    fetchProfileId();
  }, [username, session]);

  const redirectToUserProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        const defaultUsername = session.user.email?.split('@')[0] || `user_${session.user.id.slice(0, 8)}`;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            username: defaultUsername,
            bio: null,
            location: null
          })
          .select('username')
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: "Error",
            description: "Failed to create profile",
            variant: "destructive"
          });
          return;
        }

        profileData = newProfile;
      }

      if (profileData?.username) {
        navigate(`/profile/${profileData.username}`, { replace: true });
      }
    } catch (error) {
      console.error('Error redirecting to user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileId = async () => {
    if (!username) return;

    try {
      setLoading(true);
      console.log('Fetching profile for username:', username);
      
      // First try to find by username
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', username)
        .single();

      // If not found by username, try by ID (fallback)
      if (error && error.code === 'PGRST116') {
        const { data: profileByIdData, error: idError } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', username)
          .single();
        
        profileData = profileByIdData;
        error = idError;
      }

      if (error) {
        console.error('Profile not found:', error);
        setProfileId(null);
        setLoading(false);
        return;
      }

      console.log('Profile found:', profileData);
      setProfileId(profileData.id);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
      setProfileId(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-luxury-gradient relative flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-luxury-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profileId) {
    return (
      <div className="min-h-screen w-screen bg-luxury-gradient relative flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-8"
        >
          <h1 className="text-4xl font-bold text-luxury-neutral mb-4">Profile Not Found</h1>
          <p className="text-luxury-muted text-xl mb-8">The user you're looking for doesn't exist.</p>
          <div className="space-y-4">
            {session?.user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => redirectToUserProfile()}
                className="px-8 py-4 bg-button-gradient text-white rounded-2xl font-semibold hover:shadow-button-hover transition-all duration-300 mr-4 text-lg"
              >
                Go to My Profile
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-luxury-primary/10 text-luxury-neutral rounded-2xl font-semibold hover:bg-luxury-primary/20 transition-all duration-300 text-lg backdrop-blur-sm"
            >
              Go to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ProfileContainer 
      id={profileId} 
      isEditing={isEditing} 
      setIsEditing={setIsEditing} 
    />
  );
}
