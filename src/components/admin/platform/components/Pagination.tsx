
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <div>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>

          {pages.map((page, i) => {
            if (page === "...") {
              return (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={Number(page) === currentPage}
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </div>
  );
}

// Helper function to generate page numbers with ellipsis for large page counts
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const MAX_VISIBLE_PAGES = 5;
  
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first and last page
  const pages: (number | string)[] = [1];
  
  // Calculate start and end of the visible pages window
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);
  
  // Adjust window if we're near the start or end
  if (currentPage <= 3) {
    endPage = Math.min(MAX_VISIBLE_PAGES - 1, totalPages - 1);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(2, totalPages - (MAX_VISIBLE_PAGES - 2));
  }
  
  // Add ellipsis before visible pages if needed
  if (startPage > 2) {
    pages.push("...");
  }
  
  // Add visible pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Add ellipsis after visible pages if needed
  if (endPage < totalPages - 1) {
    pages.push("...");
  }
  
  // Always add last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
}
