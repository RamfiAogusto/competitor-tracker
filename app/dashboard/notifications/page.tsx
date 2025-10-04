"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Mail,
  MessageSquare,
  Webhook,
  Plus,
  Settings,
  Check,
  X,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { alertsApi, Alert, AlertStats } from "@/lib/alerts-api"
import { competitorsApi } from "@/lib/competitors-api"

export default function NotificationsPage() {
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<AlertStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar alertas y estadísticas
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [alertsResponse, statsResponse] = await Promise.all([
          alertsApi.getAlerts({ limit: 50 }),
          alertsApi.getStats('7d')
        ])
        
        setAlerts(alertsResponse.data)
        setStats(statsResponse.data)
      } catch (err) {
        console.error('Error cargando alertas:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await alertsApi.markAsRead(alertId)
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'read' as const, readAt: new Date().toISOString() }
          : alert
      ))
      // Actualizar estadísticas
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1
        } : null)
      }
    } catch (err) {
      console.error('Error marcando alerta como leída:', err)
    }
  }

  const handleArchiveAlert = async (alertId: string) => {
    try {
      await alertsApi.archiveAlert(alertId)
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      // Actualizar estadísticas
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          total: prev.total - 1,
          unread: Math.max(0, prev.unread - 1),
          archived: prev.archived + 1
        } : null)
      }
    } catch (err) {
      console.error('Error archivando alerta:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await alertsApi.markAllAsRead()
      setAlerts(prev => prev.map(alert => ({
        ...alert,
        status: 'read' as const,
        readAt: new Date().toISOString()
      })))
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          unread: 0,
          read: prev.read + prev.unread
        } : null)
      }
    } catch (err) {
      console.error('Error marcando todas las alertas como leídas:', err)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Fecha no disponible'
    
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return 'Fecha inválida'
      
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Ahora mismo'
      if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
      if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Error de fecha'
    }
  }

  const notificationRules = [
    {
      id: 1,
      name: "Critical Pricing Changes",
      description: "Alert when competitors update pricing pages",
      competitor: "All",
      type: "pricing",
      severity: "critical",
      channels: ["email", "slack"],
      enabled: true,
    },
    {
      id: 2,
      name: "New Feature Announcements",
      description: "Monitor feature page updates from key competitors",
      competitor: "TechCorp, StartupXYZ",
      type: "features",
      severity: "high",
      channels: ["email", "webhook"],
      enabled: true,
    },
    {
      id: 3,
      name: "Content Updates",
      description: "Track blog posts and content changes",
      competitor: "All",
      type: "content",
      severity: "low",
      channels: ["email"],
      enabled: false,
    },
  ]

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "low":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Manage alerts and notification preferences</p>
          </div>
          <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Notification Rule</DialogTitle>
                <DialogDescription>Set up automated alerts for specific competitor changes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="e.g. Critical Pricing Changes" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea id="rule-description" placeholder="Brief description of this rule..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Competitor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select competitor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Competitors</SelectItem>
                        <SelectItem value="techcorp">TechCorp</SelectItem>
                        <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                        <SelectItem value="competitora">CompetitorA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Change Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pricing">Pricing</SelectItem>
                        <SelectItem value="features">Features</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Minimum Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="rule-enabled" defaultChecked />
                  <Label htmlFor="rule-enabled">Enable this rule</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRuleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddRuleDialogOpen(false)}>Create Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas No Leídas</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.unread || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats ? `${stats.bySeverity.critical} críticas, ${stats.bySeverity.high} altas` : 'Cargando...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats ? `${stats.read} leídas, ${stats.archived} archivadas` : 'Cargando...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.bySeverity.critical || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats ? `${stats.bySeverity.high} altas, ${stats.bySeverity.medium} medias` : 'Cargando...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cambios Detectados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.reduce((sum, alert) => sum + alert.changeCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">En las últimas 24 horas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notification Inbox</CardTitle>
                    <CardDescription>Recent alerts from your monitored competitors</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                    Marcar Todas como Leídas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Cargando alertas...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-destructive">Error: {error}</div>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">No hay alertas disponibles</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start space-x-4 p-4 border rounded-lg transition-colors ${
                          alert.status === 'unread' ? "bg-accent/50 border-primary/20" : "border-border hover:bg-accent/30"
                        }`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg flex-shrink-0">
                          {getNotificationIcon(alert.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3
                              className={`font-medium ${alert.status === 'unread' ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {alert.title}
                            </h3>
                            <Badge variant={getNotificationTypeColor(alert.severity)} className="text-xs">
                              {alert.severity}
                            </Badge>
                            {alert.status === 'unread' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="font-medium">{alert.competitor?.name || 'Competidor desconocido'}</span>
                            <span>•</span>
                            <span>{formatTimestamp(alert.createdAt)}</span>
                            <span>•</span>
                            <span>{alert.changeCount} cambio{alert.changeCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {alert.status === 'unread' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleMarkAsRead(alert.id)}
                              title="Marcar como leída"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleArchiveAlert(alert.id)}
                            title="Archivar alerta"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Rules</CardTitle>
                <CardDescription>Configure automated alerts based on competitor changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Switch checked={rule.enabled} />
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>Competitor: {rule.competitor}</span>
                            <span>•</span>
                            <span>Type: {rule.type}</span>
                            <span>•</span>
                            <span>Min Severity: {rule.severity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {rule.channels.includes("email") && (
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Badge>
                          )}
                          {rule.channels.includes("slack") && (
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Slack
                            </Badge>
                          )}
                          {rule.channels.includes("webhook") && (
                            <Badge variant="outline" className="text-xs">
                              <Webhook className="h-3 w-3 mr-1" />
                              Webhook
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>Configure email alert settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-enabled">Enable email notifications</Label>
                    <Switch id="email-enabled" defaultChecked />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input id="email-address" type="email" placeholder="alerts@company.com" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-digest">Daily digest</Label>
                    <Switch id="email-digest" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Slack Integration
                  </CardTitle>
                  <CardDescription>Send alerts to Slack channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-enabled">Enable Slack notifications</Label>
                    <Switch id="slack-enabled" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input id="slack-webhook" placeholder="https://hooks.slack.com/..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slack-channel">Channel</Label>
                    <Input id="slack-channel" placeholder="#competitor-alerts" />
                  </div>
                  <Button variant="outline" size="sm">
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Webhook className="h-5 w-5 mr-2" />
                    Webhook Integration
                  </CardTitle>
                  <CardDescription>Send alerts to custom endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="webhook-enabled">Enable webhook notifications</Label>
                    <Switch id="webhook-enabled" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://api.yourapp.com/webhooks/alerts" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-secret">Secret Key (Optional)</Label>
                    <Input id="webhook-secret" type="password" placeholder="Your webhook secret" />
                  </div>
                  <Button variant="outline" size="sm">
                    Test Webhook
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Push Notifications
                  </CardTitle>
                  <CardDescription>Browser and mobile push alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-enabled">Enable push notifications</Label>
                    <Switch id="push-enabled" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-critical">Critical alerts only</Label>
                    <Switch id="push-critical" defaultChecked />
                  </div>
                  <Button variant="outline" size="sm">
                    Request Permission
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
