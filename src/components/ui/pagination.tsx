
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      <div className="text-sm">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}

// Adding these components to support the admin platform pagination
export const PaginationContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center ${className || ''}`}>{children}</div>
);

export const PaginationEllipsis = () => (
  <div className="px-1">
    <span className="text-sm">...</span>
  </div>
);

export const PaginationItem = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const PaginationLink = ({ 
  href,
  isActive,
  children,
  ...props
}: { 
  href?: string; 
  isActive?: boolean; 
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Button 
    variant={isActive ? "default" : "outline"}
    size="icon"
    asChild={!!href}
    {...props}
  >
    {href ? <a href={href}>{children}</a> : children}
  </Button>
);

export const PaginationNext = ({ href, ...props }: { href?: string; [key: string]: any }) => (
  <PaginationLink href={href} {...props}>
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next page</span>
  </PaginationLink>
);

export const PaginationPrevious = ({ href, ...props }: { href?: string; [key: string]: any }) => (
  <PaginationLink href={href} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous page</span>
  </PaginationLink>
);
