import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={page <= 1}>
        처음
      </Button>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        이전
      </Button>
      <span className="text-sm text-muted-foreground px-2">
        {page} / {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        다음
      </Button>
      <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}>
        마지막
      </Button>
    </div>
  );
}
