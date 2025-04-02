
import { ModerateContent } from "@/components/admin/platform/ModerateContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaggedContent } from "@/components/admin/platform/FlaggedContent";

export default function Moderation() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Moderation</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">Content Moderation</h1>
      
      <Tabs defaultValue="moderate">
        <TabsList>
          <TabsTrigger value="moderate">Moderation Panel</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
        </TabsList>
        <TabsContent value="moderate">
          <ModerateContent />
        </TabsContent>
        <TabsContent value="flagged">
          <FlaggedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
