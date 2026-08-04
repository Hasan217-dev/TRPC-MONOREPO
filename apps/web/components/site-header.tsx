"use client"

import { usePathname } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"

export function SiteHeader() {
  const pathname = usePathname() ?? ""

  const getPageTitle = () => {
    if (pathname.endsWith("/submissions") || pathname.includes("/submission")) {
      return "Submissions Log"
    }
    if (pathname.includes("/forms/")) {
      return "Form Builder"
    }
    if (pathname.includes("/forms")) {
      return "Form Manager"
    }
    return "Dashboard Overview"
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/80 bg-background/60 backdrop-blur-md sticky top-0 z-30 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 hover:bg-muted" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-border/60"
        />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">{getPageTitle()}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex hover:bg-muted text-muted-foreground hover:text-foreground text-xs">
            <a
              href="https://github.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Support & Docs
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
