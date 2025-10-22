"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"

const navItems = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Financial overview"
  },
  { 
    href: "/dashboard/income", 
    label: "Income", 
    icon: TrendingUp,
    description: "Manage income sources"
  },
  { 
    href: "/dashboard/expenses", 
    label: "Expenses", 
    icon: TrendingDown,
    description: "Track expenses"
  },
  { 
    href: "/dashboard/accounts", 
    label: "Accounts", 
    icon: Building,
    description: "Bank accounts"
  },
  { 
    href: "/dashboard/tenants", 
    label: "Tenants", 
    icon: Users,
    description: "Tenant management"
  },
  { 
    href: "/dashboard/settings", 
    label: "Settings", 
    icon: Settings,
    description: "App configuration"
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { user} = useAuthStore()


  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setIsCollapsed(!isCollapsed)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isCollapsed])

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)

  const sidebarWidth = isCollapsed ? "w-20" : "w-64"
  const mobileSidebarClass = isMobileOpen ? "translate-x-0" : "-translate-x-full"

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={toggleMobileSidebar}
        className={cn(
          "lg:hidden fixed z-50 p-3 bg-primary text-primary-foreground rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary/90",
          "top-4 left-4"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gradient-to-b from-card to-card/80 border-r border-border/50 min-h-screen sticky top-0 transition-all duration-300 z-40 shadow-xl backdrop-blur-sm",
          // Desktop width
          sidebarWidth,
          // Mobile behavior
          "lg:translate-x-0 lg:static fixed inset-y-0 left-0",
          mobileSidebarClass
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "p-6 border-b border-border/50 transition-all duration-300",
            isCollapsed ? "px-4" : "px-6"
          )}>
            <div className={cn(
              "flex items-center justify-between transition-all duration-300",
              isCollapsed ? "flex-col gap-2" : "flex-row"
            )}>
              <Link 
                href="/dashboard" 
                className={cn(
                  "font-bold transition-all duration-300",
                  isCollapsed ? "text-2xl" : "text-2xl"
                )}
              >
                {isCollapsed ? "H360" : "Hisab360"}
              </Link>
              
              {/* Desktop Toggle Button */}
              <button
                onClick={toggleSidebar}
                className={cn(
                  "hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-border/50 bg-background/50 hover:bg-accent transition-all duration-200 hover:scale-105",
                  isCollapsed ? "rotate-180" : ""
                )}
                title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-background/50 hover:bg-accent transition-all duration-200 hover:scale-105"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Expanded Description */}
            {!isCollapsed && (
              <p className="text-xs text-muted-foreground mt-2 font-light tracking-wide">
                Financial Management Suite
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 p-4 space-y-1 transition-all duration-300",
            isCollapsed ? "px-2" : "px-4"
          )}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden",
                    isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3",
                    isActive 
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25" 
                      : "text-foreground hover:bg-accent/50 hover:shadow-md"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "transition-transform duration-200 flex-shrink-0",
                    isActive ? "scale-110" : "group-hover:scale-105",
                    isCollapsed ? "" : "mr-3"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                  </div>

                  {/* Text Content */}
                  {!isCollapsed && (
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className={cn(
                        "font-medium transition-colors duration-200",
                        isActive ? "text-primary-foreground" : "group-hover:text-foreground"
                      )}>
                        {item.label}
                      </span>
                      <span className={cn(
                        "text-xs transition-all duration-200 truncate",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-muted-foreground/80"
                      )}>
                        {item.description}
                      </span>
                    </div>
                  )}

                  {/* Hover Tooltip for collapsed state */}
                  {isCollapsed && (isHovered || isMobileOpen) && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-50 whitespace-nowrap">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className={cn(
            "p-4 border-t border-border/50 transition-all duration-300",
            isCollapsed ? "px-2" : "px-4"
          )}>
            {/* User Profile */}
            <div className={cn(
              "flex items-center rounded-lg p-3 transition-all duration-200 hover:bg-accent/50 cursor-pointer",
              isCollapsed ? "justify-center" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0",
                isCollapsed ? "" : "mr-3"
              )}>
                U
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col flex-1 min-w-0">
                  
                  <span className="text-xs text-muted-foreground truncate">{user?.name}</span>
                </div>
              )}
            </div>

            {/* Collapse Hint */}
            {!isCollapsed && (
              <div className="mt-3 p-2 bg-muted/30 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-background border rounded text-xs">B</kbd> to toggle
                </p>
              </div>
            )}

            {/* Mobile Close Hint */}
            {isMobileOpen && (
              <div className="mt-3 p-2 bg-muted/30 rounded-lg text-center lg:hidden">
                <p className="text-xs text-muted-foreground">
                  Tap outside to close
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}