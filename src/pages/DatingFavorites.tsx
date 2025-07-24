import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Calendar } from "lucide-react";

const DatingFavorites = () => {
  const { user } = useAuth();
  const [favorites] = useState([]);

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-background md:ml-20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
          </div>
          
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
                <p className="text-muted-foreground text-center">
                  Start browsing dating profiles to add them to your favorites
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Favorite profiles will be rendered here */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DatingFavorites;