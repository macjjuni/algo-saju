export default function Content({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      {children}
    </main>
  );
}
