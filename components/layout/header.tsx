import Link from "next/link";
import AuthButton from "./auth-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="text-lg font-bold">
          algo-saju
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            프로필
          </Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
