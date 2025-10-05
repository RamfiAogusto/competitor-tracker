"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Bell, TrendingUp, AlertTriangle, Clock, Plus, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { dashboardApi, DashboardOverview, RecentChange, TopCompetitor } from "@/lib/dashboard-api"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [recentChanges, setRecentChanges] = useState<RecentChange[]>([])
  const [topCompetitors, setTopCompetitors] = useState<TopCompetitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch data in parallel
        const [overviewData, changesData, competitorsData] = await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getRecentChanges(5),
          dashboardApi.getTopCompetitors(4)
        ])

        setOverview(overviewData)
        setRecentChanges(changesData)
        setTopCompetitors(competitorsData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
    } else if (diffHours < 24) {
      return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
    } else {
      return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-green-500'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return { variant: 'destructive' as const, text: 'Critical' }
      case 'high': return { variant: 'destructive' as const, text: 'High' }
      case 'medium': return { variant: 'secondary' as const, text: 'Medium' }
      case 'low': return { variant: 'outline' as const, text: 'Low' }
      default: return { variant: 'outline' as const, text: 'Info' }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { variant: 'destructive' as const, text: 'High' }
      case 'medium': return { variant: 'secondary' as const, text: 'Medium' }
      case 'low': return { variant: 'outline' as const, text: 'Low' }
      default: return { variant: 'outline' as const, text: 'Medium' }
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando dashboard...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your competitors and track changes in real-time</p>
          </div>
          <Link href="/dashboard/competitors">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.stats.activeMonitors || 0}</div>
              <p className="text-xs text-muted-foreground">
                de {overview?.stats.totalCompetitors || 0} competidores totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Changes Detected</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.stats.totalChanges || 0}</div>
              <p className="text-xs text-muted-foreground">
                cambios detectados en total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.stats.criticalAlerts || 0}</div>
              <p className="text-xs text-muted-foreground">
                alertas críticas pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Check</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview?.stats.lastCheck ? formatTimestamp(overview.stats.lastCheck) : 'Nunca'}
              </div>
              <p className="text-xs text-muted-foreground">Última verificación</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Competitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Changes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Changes</CardTitle>
                  <CardDescription>Latest competitor website updates</CardDescription>
                </div>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm">
                    View All
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentChanges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay cambios recientes</p>
                  <p className="text-xs">Los cambios aparecerán aquí cuando se detecten</p>
                </div>
              ) : (
                recentChanges.map((change) => {
                  const severityBadge = getSeverityBadge(change.severity)
                  return (
                    <div key={change.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 ${getSeverityColor(change.severity)} rounded-full mt-2 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{change.competitorName}</p>
                          <Badge variant={severityBadge.variant} className="text-xs">
                            {severityBadge.text}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{change.changeSummary}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(change.detectedAt)}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Top Competitors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Competitors</CardTitle>
                  <CardDescription>Most active competitors this week</CardDescription>
                </div>
                <Link href="/dashboard/competitors">
                  <Button variant="ghost" size="sm">
                    Manage
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCompetitors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay competidores activos</p>
                  <p className="text-xs">Agrega competidores para comenzar el monitoreo</p>
                </div>
              ) : (
                topCompetitors.map((competitor) => {
                  const priorityBadge = getPriorityBadge(competitor.priority)
                  const initials = competitor.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                  const progressValue = Math.min((competitor.totalChanges / 20) * 100, 100) // Max 20 changes for 100%
                  
                  return (
                    <div key={competitor.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{competitor.name}</p>
                          <p className="text-xs text-muted-foreground">{competitor.totalChanges} cambios</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={progressValue} className="w-16 h-2" />
                        <Badge variant={priorityBadge.variant} className="text-xs">
                          {priorityBadge.text}
                        </Badge>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/competitors">
                <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add Competitor</div>
                    <div className="text-xs text-muted-foreground">Start monitoring a new website</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/notifications">
                <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                  <Bell className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Setup Alerts</div>
                    <div className="text-xs text-muted-foreground">Configure notification preferences</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/history">
                <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Analyze competitor trends</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
