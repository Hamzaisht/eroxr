import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { RightSidebar } from "@/components/home/RightSidebar";
import { CreatePostSection } from "@/components/home/CreatePostSection";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-luxury-dark">
      <LeftSidebar />
      
      <main className="flex-1 ml-64 border-x border-white/10">
        <div className="max-w-[600px] mx-auto py-8 px-4">
          <CreatePostSection 
            isPayingCustomer={isPayingCustomer}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onFileSelect={(files) => {
              setSelectedFiles(files);
              setIsCreatePostOpen(true);
            }}
          />
          <CreatorsFeed />
        </div>
      </main>

      <RightSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </div>
  );
};

export default Home;