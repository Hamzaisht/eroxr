
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaggedContent } from "@/components/admin/platform/FlaggedContent";
import { DeletedContent } from "@/components/admin/platform/DeletedContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function ContentFeed() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/godmode">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/godmode">Godmode</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Content Feed</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">Content Moderation Feed</h1>
      
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
