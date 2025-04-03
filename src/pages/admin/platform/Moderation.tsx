
import { ModerateContent } from "@/components/admin/platform/ModerateContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaggedContentList } from "@/components/admin/platform/FlaggedContent";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";

export default function Moderation() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Content Moderation" section="Moderation" />
      
      <Tabs defaultValue="moderate">
        <TabsList>
          <TabsTrigger value="moderate">Moderation Panel</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
        </TabsList>
        <TabsContent value="moderate">
          <ModerateContent />
        </TabsContent>
        <TabsContent value="flagged">
          <FlaggedContentList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
