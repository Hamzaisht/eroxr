
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { Video } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { Post as SupabasePost } from "@/integrations/supabase/types/post";
import { ShortsGrid } from "./shorts/ShortsGrid";
import { ShortPreviewDialog } from "./shorts/ShortPreviewDialog";
import { useFetchShorts } from "./shorts/useFetchShorts";
import { useShortActions } from "./shorts/useShortActions";
import { Post } from "./shorts/types";

interface ShortsListProps {
  shorts?: SupabasePost[] | Post[];
}

export const ShortsList = ({ shorts: propShorts }: ShortsListProps = {}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = useSession();
  const [selectedShort, setSelectedShort] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const isOwner = session?.user?.id === id;
  const { shorts, loading, setShorts } = useFetchShorts(propShorts);
  const { handleDelete } = useShortActions(setShorts);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
        ))}
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <EmptyState
        title="No Shorts Yet"
        description={isOwner ? "Upload your first short to get started!" : "This user hasn't uploaded any shorts yet."}
        icon={Video}
        actionLabel={isOwner ? "Upload Short" : undefined}
        onAction={isOwner ? () => navigate("/shorts/upload") : undefined}
      />
    );
  }

  return (
    <>
      <ShortsGrid 
        shorts={shorts}
        isOwner={isOwner}
        onSelectShort={(short) => {
          setSelectedShort(short);
          setIsPreviewOpen(true);
        }}
        onDeleteShort={handleDelete}
      />
      
      <ShortPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        selectedShort={selectedShort}
      />
    </>
  );
};
