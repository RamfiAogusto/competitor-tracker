"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, LayoutDashboard, Users, History, Bell, Settings, Menu, Search, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center space-x-2">
            <Eye className="h-6 w-6" />
            <span className="font-bold">CompetitorWatch</span>
          </Link>

          <div className="flex-1 flex items-center justify-end space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search competitors..."
                className="pl-10 pr-4 py-2 w-64 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>

            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-200 ease-in-out`}
        >
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-1 px-3">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link href="/dashboard/competitors">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-3 h-4 w-4" />
                    Competitors
                  </Button>
                </Link>

                <Link href="/dashboard/history">
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="mr-3 h-4 w-4" />
                    Change History
                  </Button>
                </Link>

                <Link href="/dashboard/notifications">
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="mr-3 h-4 w-4" />
                    Notifications
                    <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </Link>

                <Link href="/dashboard/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
