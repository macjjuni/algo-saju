import { ViewTransition } from "react";

export default function Content({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col flex-1 items-center container mx-auto px-4 py-6 max-sm:p-2">
      <ViewTransition>{children}</ViewTransition>
    </main>
  );
}
