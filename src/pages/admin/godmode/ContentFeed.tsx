
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaggedContent } from "@/components/admin/platform/FlaggedContent";
import { DeletedContent } from "@/components/admin/platform/DeletedContent";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";

export default function ContentFeed() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Content Moderation Feed" section="Content Feed" />
      
      <Tabs defaultValue="flagged">
        <TabsList>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Content</TabsTrigger>
        </TabsList>
        <TabsContent value="flagged">
          <FlaggedContent />
        </TabsContent>
        <TabsContent value="deleted">
          <DeletedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
