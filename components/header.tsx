import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">DR</span>
          </div>
          <span className="text-xl font-semibold text-foreground">Dental Reviewer</span>
        </Link>

        <nav className="flex items-center space-x-2 sm:space-x-4 ml-auto">
          <Button variant="ghost" asChild className="transition-all hover:scale-105 text-lg font-medium">
            <Link href="/dashboard">仪表板</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
