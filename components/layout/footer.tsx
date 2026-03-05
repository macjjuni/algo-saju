import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-14 items-center justify-end gap-4 px-4">
        <nav className="flex gap-3 items-center">
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            이용약관
          </Link>
          <span className="opacity-50 text-sm">|</span>
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
        </p>
      </div>
    </footer>
  );
}
