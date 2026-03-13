const DEFAULT_PAGE_SIZE = 20;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export function parsePaginationParams(params: { page?: string; pageSize?: string }): PaginationParams {
  return {
    page: Math.max(1, Number(params.page) || 1),
    pageSize: Math.min(100, Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE)),
  };
}
