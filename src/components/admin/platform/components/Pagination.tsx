
import React from "react";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  // If there's only one page, don't render pagination
  if (totalPages <= 1) return null;

  // Determine range of pages to show
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const maxPagesToShow = siblingCount * 2 + 5; // first, last, current, and 2 ellipses

    // If total pages is less than max, show all pages
    if (totalPages <= maxPagesToShow) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    // Case 1: Show right dots only
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    // Case 2: Show left dots only
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "...", ...rightRange];
    }

    // Case 3: Show both dots
    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, "...", ...middleRange, "...", totalPages];
    }

    // Should not reach here
    return range(1, totalPages);
  };

  const pages = generatePaginationItems();

  return (
    <PaginationComponent className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}
