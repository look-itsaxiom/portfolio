import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Chase
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/#impact"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Impact
          </Link>
          <Link
            href="/#labs"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Labs
          </Link>
          <Link
            href="/#devlog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            DevLog
          </Link>
          <Link
            href="/#contact"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
