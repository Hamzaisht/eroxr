import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash2 } from "lucide-react";

const ShortsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load video data based on ID
    const loadVideo = async () => {
      setIsLoading(true);
      // Fetch video data implementation
      setTimeout(() => {
        setTitle("Sample Video Title");
        setDescription("Sample video description");
        setIsLoading(false);
      }, 1000);
    };

    if (id) {
      loadVideo();
    }
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    // Save changes implementation
    setTimeout(() => {
      setIsSaving(false);
      navigate('/shorts');
    }, 2000);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this video?")) {
      // Delete implementation
      navigate('/shorts');
    }
  };

  if (isLoading) {
    return (
      <>
        <InteractiveNav />
        <div className="md:ml-20 p-4">
          <BackButton />
        </div>
        <div className="min-h-screen bg-background md:ml-20 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading video...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-background md:ml-20 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Edit className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Edit Short</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your video..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving || !title.trim()}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  
                  <Button 
                    onClick={handleDelete}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ShortsEdit;