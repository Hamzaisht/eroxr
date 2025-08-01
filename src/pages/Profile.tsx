
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { QuantumProfileViewer } from "@/components/profile/modern/QuantumProfileViewer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, ArrowLeft } from "lucide-react";

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Handle both /profile/:userId and /new-profile/:userId routes
  const isNewProfileRoute = window.location.pathname.includes('/new-profile');

  console.log('Profile - userId:', userId);
  console.log('Profile - user:', user?.id);

  // Function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Handle redirect for /profile route without userId
  useEffect(() => {
    if (!userId && !isNewProfileRoute && user?.id) {
      navigate(`/profile/${user.id}`);
    }
  }, [userId, isNewProfileRoute, user?.id, navigate]);

  // Determine the profile ID to use
  let profileId: string | null = null;
  
  if (userId) {
    // If userId is a valid UUID, use it directly
    if (isValidUUID(userId)) {
      profileId = userId;
    } else {
      // If it's not a UUID, show helpful error with navigation options
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Invalid Profile ID</h3>
              <p className="text-muted-foreground mb-4">
                "{userId}" is not a valid user identifier
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/profile')} className="w-full">
                  View Your Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')} 
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Profile IDs must be valid UUIDs
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  } else {
    // No identifier provided, use current user's ID (only for new-profile route)
    if (isNewProfileRoute) {
      profileId = user?.id || null;
    } else {
      // For /profile route without userId, will be handled by useEffect redirect
      if (!user?.id) {
        profileId = null;
      } else {
        // Show loading while redirect happens
        return null;
      }
    }
  }

  if (!profileId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to view profiles
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full">
                Login to Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <QuantumProfileViewer 
      profileId={profileId}
      onBack={() => navigate('/')}
    />
  );
}
