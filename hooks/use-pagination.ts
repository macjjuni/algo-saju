import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface UsePaginationOptions {
  basePath: string;
  page: number;
  pageSize: number;
  totalCount: number;
  extraParams?: Record<string, string>;
}

export function usePagination({ basePath, page, pageSize, totalCount, extraParams }: UsePaginationOptions) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      params.set("page", String(newPage));
      if (pageSize !== 20) params.set("pageSize", String(pageSize));
      if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
          if (value) params.set(key, value);
        }
      }
      router.push(`${basePath}?${params.toString()}`);
    },
    [router, basePath, pageSize, extraParams],
  );

  return { totalPages, handlePageChange };
}
