"use client"

import { Card } from "@/components/ui/card"
import { ResizableIframe } from "@/components/resizable-iframe"

import { useEffect } from "react"
import { Menu, X, Home, User, Settings, Mail } from "lucide-react"
import {
  MobileMenu,
  MobileMenuTrigger,
  MobileMenuContent,
  MobileMenuClose,
  MobileMenuNav,
  MobileMenuLink,
  MobileMenuFooter,
} from "@/registry/joyco/blocks/mobile-menu"

export function DemoPage() {
  return (
    <div className="min-h-screen bg-background w-full text-foreground font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-heading-height border-b border-border sticky top-0 bg-background z-40">
        <div className="font-bold text-xl tracking-tight z-10 relative">NOT JOYCO</div>

        {/* Desktop nav - visible on md+ */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-foreground">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-foreground">
            About
          </a>
          <a href="#" className="text-sm font-medium text-foreground">
            Services
          </a>
          <a href="#" className="text-sm font-medium text-foreground">
            Contact
          </a>
        </nav>

        <MobileMenu>
          <MobileMenuTrigger>
            <Menu className="h-6 w-6 group-data-[state=open]/menu-trigger:hidden" />
            <X className="h-6 w-6 group-data-[state=closed]/menu-trigger:hidden" />
          </MobileMenuTrigger>

          <MobileMenuContent>
            <MobileMenuNav>
              <MobileMenuLink href="#">
                Home
              </MobileMenuLink>
              <MobileMenuLink href="#">
                Profile
              </MobileMenuLink>
              <MobileMenuLink href="#">
                Settings
              </MobileMenuLink>
              <MobileMenuLink href="#">
                Contact
              </MobileMenuLink>
            </MobileMenuNav>
            <MobileMenuFooter>
              <p className="text-sm text-muted-foreground">© 2025 Defenitely Not Joyco Inc.</p>
            </MobileMenuFooter>
          </MobileMenuContent>
        </MobileMenu>
      </header>
    </div>
  )
}

export function MobileMenuDemo() {
  return (
    <div className="not-prose">
      <Card className="overflow-hidden py-0 bg-card border-border">
        <ResizableIframe
          src="/demos/mobile-menu"
          defaultWidth={400}
          minWidth={280}
          height={600}
          title="mobile-menu demo page"
        />
      </Card>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        Drag the right edge to resize. Menu button appears below 768px.
      </p>
    </div>
  )
}
