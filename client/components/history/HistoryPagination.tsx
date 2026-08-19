"use client"
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface HistoryPaginationProps {
  page: number;
  pages: number;
}

export default function HistoryPagination({
  page,
  pages,
}: HistoryPaginationProps) {
  const pathname = usePathname()
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?page=${newPage}`);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pages) {
      handlePageChange(page + 1);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-purple-100 flex justify-between items-center">
      <button 
        onClick={handlePreviousPage} 
        disabled={page <= 1} 
        className="px-4 py-2 font-medium transition-colors rounded-md border text-gray-600 border-purple-300 hover:text-purple-600 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed hover:disabled:text-gray-400"
      >
        Previous
      </button>
      <p className="text-gray-600 text-sm font-medium">
        Page {page} of {pages}
      </p>
      <button 
        onClick={handleNextPage} 
        disabled={page >= pages} 
        className="px-4 py-2 font-medium transition-colors rounded-md border text-gray-600 border-purple-300 hover:text-purple-600 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed hover:disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
}
