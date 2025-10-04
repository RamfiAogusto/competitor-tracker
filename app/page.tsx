"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, Bell, History, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

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
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">CompetitorWatch</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid-pattern absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Real-time monitoring
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Never miss a <span className="text-primary">competitor move</span> again.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Track your competitors' website changes in real-time. Get instant notifications, maintain detailed change
              history, and react faster to market movements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-muted-foreground">Continuous monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">&lt;1 min</div>
              <div className="text-muted-foreground">Change detection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground">Change accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">∞</div>
              <div className="text-muted-foreground">History retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to stay ahead</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive competitor monitoring with powerful analytics and instant alerts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-border">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
              </div>
              <p className="text-muted-foreground">
                Monitor unlimited competitor websites 24/7 with instant change detection and smart filtering.
              </p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Smart Notifications</h3>
              </div>
              <p className="text-muted-foreground">
                Get instant alerts via email, Slack, or webhook when competitors make important changes.
              </p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Change History</h3>
              </div>
              <p className="text-muted-foreground">
                Complete timeline of all changes with visual diffs, screenshots, and detailed analytics.
              </p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Trend Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Identify patterns and trends in competitor behavior with advanced analytics and reporting.
              </p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Enterprise Security</h3>
              </div>
              <p className="text-muted-foreground">
                Bank-level security with SOC 2 compliance, data encryption, and privacy protection.
              </p>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary rounded-lg mr-3">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">API Integration</h3>
              </div>
              <p className="text-muted-foreground">
                Integrate with your existing tools via REST API, webhooks, and native integrations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to outpace your competition?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of companies using CompetitorWatch to stay ahead of market changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Eye className="h-6 w-6" />
              <span className="text-lg font-semibold">CompetitorWatch</span>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 CompetitorWatch. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
