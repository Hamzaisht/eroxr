
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayoutsManagement } from "@/components/admin/platform/PayoutsManagement";
import { CreatorEarningsSurveillance } from "@/components/admin/platform/surveillance/CreatorEarningsSurveillance";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function Payouts() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Payouts</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">Creator Earnings & Payouts</h1>
      
      <Tabs defaultValue="payouts">
        <TabsList>
          <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
          <TabsTrigger value="earnings">Creator Earnings</TabsTrigger>
        </TabsList>
        <TabsContent value="payouts">
          <PayoutsManagement />
        </TabsContent>
        <TabsContent value="earnings">
          <CreatorEarningsSurveillance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
