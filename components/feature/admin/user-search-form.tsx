"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserSearchFormProps {
  defaultSearch: string;
}

export default function UserSearchForm({ defaultSearch }: UserSearchFormProps) {
  // region [Hooks]
  const router = useRouter();
  // endregion

  // region [Events]
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const search = formData.get("search") as string;
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      router.push(`/admin/users?${params.toString()}`);
    },
    [router],
  );
  // endregion

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name="search"
          type="text"
          defaultValue={defaultSearch}
          placeholder="이름 또는 이메일로 검색"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <Button type="submit">
        검색
      </Button>
    </form>
  );
}
