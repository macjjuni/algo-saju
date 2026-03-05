import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-14 items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
        </p>
        <nav className="flex gap-3">
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </footer>
  );
}
