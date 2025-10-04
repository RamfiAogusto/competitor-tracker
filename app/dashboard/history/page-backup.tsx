"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  History,
  Search,
  ExternalLink,
  Eye,
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  Code,
  Palette,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/contexts/AuthContext"
import { historyApi, ChangeHistoryItem, ChangeStats, ChangeDetails, GetChangesParams } from "@/lib/history-api"
import { competitorsApi, Competitor as CompetitorType } from "@/lib/competitors-api"
import { useState, useEffect } from "react"

export default function HistoryPage() {
  const { isAuthenticated } = useAuth()
  const [selectedChange, setSelectedChange] = useState<ChangeDetails | null>(null)
  const [changes, setChanges] = useState<ChangeHistoryItem[]>([])
  const [stats, setStats] = useState<ChangeStats | null>(null)
  const [competitors, setCompetitors] = useState<CompetitorType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    competitorId: 'all',
    type: 'all',
    severity: 'all',
    page: 1,
    limit: 20
  })

  // Cargar datos
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, filters.page])

  // Recargar datos cuando cambien los filtros (excepto page)
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [filters.search, filters.competitorId, filters.type, filters.severity])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Preparar filtros para la API (convertir "all" a undefined y eliminar campos undefined)
      const apiFilters: any = {
        page: filters.page,
        limit: filters.limit
      }

      if (filters.search) apiFilters.search = filters.search
      if (filters.competitorId && filters.competitorId !== 'all') apiFilters.competitorId = filters.competitorId
      if (filters.type && filters.type !== 'all') apiFilters.type = filters.type
      if (filters.severity && filters.severity !== 'all') apiFilters.severity = filters.severity

      const [changesResponse, statsResponse, competitorsResponse] = await Promise.all([
        historyApi.getChanges(apiFilters),
        historyApi.getStats(),
        competitorsApi.getCompetitors({ limit: 100 })
      ])

      setChanges(changesResponse.data)
      setStats(statsResponse.data)
      setCompetitors(competitorsResponse.data)
    } catch (err: any) {
      console.error('Error loading data:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof GetChangesParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }))
  }

  const handleViewChange = async (change: ChangeHistoryItem) => {
    try {
      const details = await historyApi.getChangeDetails(change.id)
      setSelectedChange(details.data)
    } catch (err: any) {
      console.error('Error loading change details:', err)
      setError('Error al cargar los detalles del cambio')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <TrendingUp className="h-4 w-4" />
      case "content":
        return <FileText className="h-4 w-4" />
      case "features":
        return <AlertTriangle className="h-4 w-4" />
      case "design":
        return <Palette className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "text-green-600 dark:text-green-400"
      case "modified":
        return "text-yellow-600 dark:text-yellow-400"
      case "removed":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Change History</h1>
            <p className="text-muted-foreground">Track all competitor website changes and analyze trends</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Changes</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalChanges || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats?.changesThisWeek || 0}</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Changes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.criticalChanges || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+{stats?.changesLast24h || 0}</span> in last 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.mostActiveCompetitor?.name || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">{stats?.mostActiveCompetitor?.changeCount || 0} changes this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgResponseTime || '2.3h'}</div>
              <p className="text-xs text-muted-foreground">Time to detect changes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter changes by competitor, type, or severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search changes..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <Select value={filters.competitorId} onValueChange={(value) => handleFilterChange('competitorId', value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Competitors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitors</SelectItem>
                  {competitors.map((competitor) => (
                    <SelectItem key={competitor.id} value={competitor.id}>
                      {competitor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Changes List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>All detected changes across your monitored competitors</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando cambios...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : changes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron cambios.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {changes.map((change) => (
                  <div
                    key={change.id}
                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg flex-shrink-0">
                        {getTypeIcon(change.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{change.title}</h3>
                          <Badge variant={getSeverityColor(change.severity)} className="text-xs">
                            {change.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{change.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="font-medium">{change.competitorName}</span>
                          <span>•</span>
                          <span>{change.timestamp}</span>
                          <span>•</span>
                          <span>{change.changeCount} changes detected</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={change.competitorUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleViewChange(change)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{selectedChange?.title || change.title}</DialogTitle>
                            <DialogDescription>
                              {selectedChange?.competitorName || change.competitorName} • {selectedChange?.timestamp || change.timestamp}
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="changes" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="changes">Changes</TabsTrigger>
                              <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                              <TabsTrigger value="code">Code Diff</TabsTrigger>
                            </TabsList>

                            <TabsContent value="changes" className="space-y-4">
                              <div className="space-y-3">
                                {(selectedChange?.changes || []).map((item: any, index: number) => (
                                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                                    <div className={`text-sm font-medium ${getChangeTypeColor(item.type)} capitalize`}>
                                      {item.type}
                                    </div>
                                    <div className="text-sm flex-1">{item.content}</div>
                                  </div>
                                ))}
                                {(!selectedChange?.changes || selectedChange.changes.length === 0) && (
                                  <div className="text-center py-4 text-muted-foreground">
                                    No hay detalles específicos disponibles para este cambio.
                                  </div>
                                )}
                              </div>
                            </TabsContent>

                            <TabsContent value="screenshot">
                              <div className="space-y-4">
                                <img
                                  src={selectedChange?.screenshot || "/placeholder.svg"}
                                  alt="Website screenshot"
                                  className="w-full rounded-lg border"
                                />
                                <p className="text-sm text-muted-foreground text-center">
                                  Screenshots automáticos próximamente
                                </p>
                              </div>
                            </TabsContent>

                            <TabsContent value="code">
                              <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Code className="h-4 w-4" />
                                    <span className="text-sm font-medium">HTML Changes</span>
                                  </div>
                                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                                    {selectedChange?.codeDiff || 'No hay diff de código disponible para este cambio.'}
                                  </pre>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
