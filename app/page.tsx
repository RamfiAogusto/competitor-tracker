"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, Bell, History, TrendingUp, Shield, Zap, Menu, X } from "lucide-react"
import Link from "next/link"
import SplineHero from "@/components/SplineHero"

export default function LandingPage() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Eye className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="text-lg sm:text-xl font-bold">CompetitorWatch</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button variant="ghost">Mi Cuenta</Button>
                  </Link>
                  <Button variant="outline" onClick={() => logout()}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/auth">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Link href="/dashboard/settings" className="block">
                    <Button variant="ghost" className="w-full justify-start">Mi Cuenta</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => logout()}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" className="block">
                    <Button variant="ghost" className="w-full justify-start">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/auth" className="block">
                    <Button className="w-full justify-start">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] lg:min-h-screen">
        <div className="grid-pattern absolute inset-0"></div>
        
        {/* Spline Background - Hidden on mobile for performance */}
        <div className="hidden lg:block absolute inset-0 z-0">
          <SplineHero className="w-full h-full" />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Content */}
        <div className="relative lg:absolute inset-0 z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-12 lg:py-0">
            <div className="w-full lg:w-1/2">
              <Badge variant="secondary" className="mb-4 pointer-events-none text-xs sm:text-sm">
                <Zap className="h-3 w-3 mr-1" />
                Real-time monitoring
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance pointer-events-none">
                Never miss a <span className="text-primary">competitor move</span> again.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl text-pretty pointer-events-none">
                Track your competitors' website changes in real-time. Get instant notifications, maintain detailed change
                history, and react faster to market movements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto">
                <Link href="/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                    Start Monitoring
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 bg-transparent">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">24/7</div>
              <div className="text-sm sm:text-base text-muted-foreground">Continuous monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">&lt;1 min</div>
              <div className="text-sm sm:text-base text-muted-foreground">Change detection</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">100%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Change accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">∞</div>
              <div className="text-sm sm:text-base text-muted-foreground">History retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Everything you need to stay ahead</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Comprehensive competitor monitoring with powerful analytics and instant alerts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-5 sm:p-6 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Real-time Monitoring</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor unlimited competitor websites 24/7 with instant change detection and smart filtering.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Smart Notifications</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get instant alerts via email, Slack, or webhook when competitors make important changes.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <History className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Change History</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Complete timeline of all changes with visual diffs, screenshots, and detailed analytics.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Trend Analysis</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Identify patterns and trends in competitor behavior with advanced analytics and reporting.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Enterprise Security</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Bank-level security with SOC 2 compliance, data encryption, and privacy protection.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">API Integration</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Integrate with your existing tools via REST API, webhooks, and native integrations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t border-border">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Ready to outpace your competition?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
            Join thousands of companies using CompetitorWatch to stay ahead of market changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-base sm:text-lg font-semibold">CompetitorWatch</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center">
              © 2025 CompetitorWatch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
