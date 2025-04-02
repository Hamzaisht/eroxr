
import { VerificationRequests } from "@/components/admin/platform/VerificationRequests";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function Verification() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/platform">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Verification</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold">User Verification Requests</h1>
      <VerificationRequests />
    </div>
  );
}
