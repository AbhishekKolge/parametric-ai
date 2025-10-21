"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  totalCount: number;
  limit: number;
  isLoading?: boolean;
  label?: string;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  totalPages,
  currentPage,
  totalCount,
  limit,
  isLoading = false,
  label = "entries",
  onPageChange,
}: PaginationProps) => {
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalCount);

  const pageChangeHandler = (page: { selected: number }) => {
    onPageChange(page.selected + 1);
  };

  if (isLoading) {
    return (
      <div className="mt-auto flex flex-col gap-4">
        <Separator />
        <PaginationLoading />
      </div>
    );
  }

  if (!totalCount || limit >= totalCount) {
    return null;
  }

  return (
    <div className="mt-auto flex flex-col gap-4">
      <Separator />
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="font-light text-sm">
          Showing {startIndex} - {endIndex} of {totalCount} {label}
        </p>
        <ReactPaginate
          activeLinkClassName="text-primary-foreground bg-foreground hover:bg-foreground/90 cursor-pointer"
          breakLabel={<span> ... </span>}
          containerClassName="flex gap-2 items-center"
          disabledLinkClassName="cursor-not-allowed opacity-50"
          forcePage={currentPage - 1}
          nextLabel={<ChevronRight size={16} />}
          nextLinkClassName="flex justify-center items-center border h-6 w-6 rounded-sm text-xs cursor-pointer"
          onPageChange={pageChangeHandler}
          pageCount={totalPages}
          pageLinkClassName="flex justify-center items-center border h-6 w-6 rounded-sm text-xs cursor-pointer"
          pageRangeDisplayed={3}
          previousLabel={<ChevronLeft size={16} />}
          previousLinkClassName="flex justify-center items-center border h-6 w-6 rounded-sm text-xs cursor-pointer"
        />
      </div>
    </div>
  );
};

export function PaginationLoading() {
  return (
    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
      <Skeleton className="h-5 w-56" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
      </div>
    </div>
  );
}
