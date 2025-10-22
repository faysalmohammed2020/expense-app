"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-context"
import { clearSession } from "@/lib/session"
import { Menu, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  onMenuToggle: () => void
  isMobileMenuOpen?: boolean
}

export function DashboardHeader({ onMenuToggle, isMobileMenuOpen = false }: DashboardHeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    clearSession()
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button for Mobile */}
            <button
              onClick={onMenuToggle}
              className={cn(
                "lg:hidden flex items-center justify-center w-10 h-10 rounded-lg",
                "bg-primary text-primary-foreground transition-all duration-300",
                "hover:bg-primary/90 hover:scale-105 active:scale-95",
                "shadow-lg hover:shadow-xl"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop Logo/Title - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="font-semibold text-foreground">Hisab360</span>
            </div>
          </div>

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground text-sm font-medium">{user?.name}</span>
              </div>
              
              {/* Mobile User Initial */}
              <div className="sm:hidden w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                "bg-red-500/10 text-red-600 border border-red-200",
                "hover:bg-red-500 hover:text-white hover:border-red-500",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "shadow-sm hover:shadow-md"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}