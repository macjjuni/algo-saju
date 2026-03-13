interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={page <= 1}
        className="rounded-lg px-2 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
      >
        처음
      </button>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg px-3 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
      >
        이전
      </button>
      <span className="text-sm text-muted-foreground px-2">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg px-3 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
      >
        다음
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page >= totalPages}
        className="rounded-lg px-2 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
      >
        마지막
      </button>
    </div>
  );
}
