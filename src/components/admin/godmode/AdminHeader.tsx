
import { GhostModeToggle } from "../platform/GhostModeToggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  section: string;
  actionButton?: ReactNode;
}

export const AdminHeader = ({ title, section, actionButton }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/godmode">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/godmode">{section}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {actionButton}
        {!actionButton && <GhostModeToggle />}
      </div>
    </div>
  );
};
