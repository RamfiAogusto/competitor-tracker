"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { competitorsApi, type Competitor, type ChangeHistory } from "@/lib/competitors-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Play,
  MoreHorizontal,
  History,
  TrendingUp,
  Clock,
  AlertTriangle,
  RefreshCw,
  FileText,
  Code,
  Palette,
  DollarSign,
  Package,
  ChevronRight,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Utility functions
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Ahora mismo"
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
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

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case "content":
      return FileText
    case "design":
      return Palette
    case "pricing":
      return DollarSign
    case "feature":
      return Package
    case "other":
      return Code
    default:
      return FileText
  }
}

export default function CompetitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const competitorId = params.id as string

  const [competitor, setCompetitor] = useState<Competitor | null>(null)
  const [history, setHistory] = useState<ChangeHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [manualCheckLoading, setManualCheckLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    checkInterval: 3600,
    monitoringEnabled: true,
  })

  useEffect(() => {
    loadData()
  }, [competitorId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [competitorResponse, historyResponse] = await Promise.all([
        competitorsApi.getCompetitor(competitorId),
        competitorsApi.getHistory(competitorId, { limit: 10 }),
      ])
      setCompetitor(competitorResponse.data)
      setHistory(historyResponse.data)

      // Initialize edit form
      setEditForm({
        name: competitorResponse.data.name,
        url: competitorResponse.data.url,
        description: competitorResponse.data.description || "",
        priority: competitorResponse.data.priority,
        checkInterval: competitorResponse.data.checkInterval,
        monitoringEnabled: competitorResponse.data.monitoringEnabled,
      })
    } catch (err) {
      setError("Error al cargar el competidor")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleManualCheck = async () => {
    setManualCheckLoading(true)
    try {
      await competitorsApi.manualCheck(competitorId)
      toast({
        title: "Verificación completada",
        description: "El check manual se ejecutó correctamente",
      })
      await loadData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Error ejecutando check manual",
        variant: "destructive",
      })
    } finally {
      setManualCheckLoading(false)
    }
  }

  const handleToggleMonitoring = async () => {
    if (!competitor) return

    try {
      if (competitor.monitoringEnabled) {
        await competitorsApi.disableMonitoring(competitorId)
        toast({
          title: "Monitoreo deshabilitado",
          description: "El monitoreo ha sido pausado",
        })
      } else {
        await competitorsApi.enableMonitoring(competitorId)
        toast({
          title: "Monitoreo habilitado",
          description: "El monitoreo ha sido activado",
        })
      }
      await loadData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Error al cambiar el estado del monitoreo",
        variant: "destructive",
      })
    }
  }

  const handleSaveChanges = async () => {
    try {
      await competitorsApi.updateCompetitor(competitorId, editForm)
      toast({
        title: "Cambios guardados",
        description: "El competidor ha sido actualizado correctamente",
      })
      setEditMode(false)
      await loadData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Error al guardar los cambios",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await competitorsApi.deleteCompetitor(competitorId)
      toast({
        title: "Competidor eliminado",
        description: "El competidor ha sido eliminado correctamente",
      })
      router.push("/dashboard/competitors")
    } catch (err) {
      toast({
        title: "Error",
        description: "Error al eliminar el competidor",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !competitor) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error || "Competidor no encontrado"}</p>
            <Button onClick={loadData}>Reintentar</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb + Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/competitors")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Competidores
              </Button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-balance">{competitor.name}</h1>
              <Badge variant={getPriorityColor(competitor.priority) as any}>{competitor.priority.toUpperCase()}</Badge>
              <Badge variant={competitor.monitoringEnabled ? "default" : "secondary"}>
                {competitor.monitoringEnabled ? "Activo" : "Pausado"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <a
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors"
              >
                {competitor.url}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleManualCheck} disabled={manualCheckLoading}>
              {manualCheckLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Check Manual
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleMonitoring}>
              {competitor.monitoringEnabled ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {competitor.monitoringEnabled ? "Pausar" : "Activar"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Versiones</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competitor.totalVersions}</div>
              <p className="text-xs text-muted-foreground">versiones guardadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cambios Detectados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competitor.changeCount}</div>
              <p className="text-xs text-muted-foreground">cambios en total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Verificación</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {competitor.lastCheckedAt ? formatTimestamp(competitor.lastCheckedAt).split(" ")[1] : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {competitor.lastCheckedAt ? formatTimestamp(competitor.lastCheckedAt) : "Nunca"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Severidad</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={getSeverityColor(competitor.severity || 'low') as any} className="text-base">
                  {(competitor.severity || 'low').toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">nivel de alerta</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información del Competidor */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Competidor</CardTitle>
                  <CardDescription>Detalles generales y configuración</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nombre</Label>
                    <p className="font-medium">{competitor.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">URL</Label>
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      {competitor.url}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  {competitor.description && (
                    <div>
                      <Label className="text-muted-foreground">Descripción</Label>
                      <p className="text-sm">{competitor.description}</p>
                    </div>
                  )}
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Fecha de creación</Label>
                      <p className="text-sm">
                        {competitor.created_at 
                          ? new Date(competitor.created_at).toLocaleDateString("es-ES", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'No disponible'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Última actualización</Label>
                      <p className="text-sm">
                        {competitor.updated_at 
                          ? formatTimestamp(competitor.updated_at)
                          : 'No disponible'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Intervalo de verificación</Label>
                      <p className="text-sm">{Math.floor(competitor.checkInterval / 60)} minutos</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Estado del monitoreo</Label>
                      <Badge variant={competitor.monitoringEnabled ? "default" : "secondary"} className="mt-1">
                        {competitor.monitoringEnabled ? "Activo" : "Pausado"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Últimos Cambios */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimos Cambios</CardTitle>
                  <CardDescription>Cambios recientes detectados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {history.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay cambios registrados aún</p>
                      </div>
                    ) : (
                      history.slice(0, 5).map((change) => {
                        const Icon = getChangeTypeIcon(change.changeType)
                        const timestamp = change.timestamp || change.created_at
                        const summary = change.summary || change.changeSummary
                        return (
                          <div key={change.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                            <div className="mt-1">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant={getSeverityColor(change.severity) as any} className="text-xs">
                                  {change.severity}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{formatTimestamp(timestamp)}</span>
                              </div>
                              <p className="text-sm font-medium">{summary}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Versión #{change.versionNumber}</span>
                                <span>•</span>
                                <span>{change.changeCount} cambios</span>
                                <span>•</span>
                                <span>{Number(change.changePercentage || 0).toFixed(1)}%</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })
                    )}
                  </div>
                  {history.length > 5 && (
                    <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setActiveTab("history")}>
                      Ver todos los cambios ({history.length})
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Operaciones comunes para este competidor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" onClick={handleManualCheck} disabled={manualCheckLoading}>
                    <Play className="h-4 w-4 mr-2" />
                    Ejecutar Check
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("history")}>
                    <History className="h-4 w-4 mr-2" />
                    Ver Historial
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard/notifications")}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Configurar Alertas
                  </Button>
                  <Button variant="outline" onClick={() => {
                    toast({
                      title: "Próximamente",
                      description: "La funcionalidad de exportar datos estará disponible pronto",
                    })
                  }}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar Datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Cambios</CardTitle>
                <CardDescription>Todos los cambios detectados en orden cronológico</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No hay historial de cambios</p>
                    <p className="text-sm">Los cambios aparecerán aquí cuando se detecten</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {history.map((change, index) => {
                      const Icon = getChangeTypeIcon(change.changeType)
                      const isLast = index === history.length - 1
                      const timestamp = change.timestamp || change.created_at
                      const summary = change.summary || change.changeSummary

                      return (
                        <div key={change.id} className="relative">
                          {!isLast && <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />}
                          <div className="flex gap-4">
                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-2 pb-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant={getSeverityColor(change.severity) as any}>{change.severity}</Badge>
                                  <Badge variant="outline">{change.changeType}</Badge>
                                  {change.isCurrent && <Badge variant="default" className="text-xs">Actual</Badge>}
                                </div>
                                <span className="text-sm text-muted-foreground">{formatTimestamp(timestamp)}</span>
                              </div>
                              <div>
                                <h4 className="font-medium">{summary}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                  <span>Versión #{change.versionNumber}</span>
                                  <span>•</span>
                                  <span>{change.changeCount} cambios</span>
                                  <span>•</span>
                                  <span>{Number(change.changePercentage || 0).toFixed(1)}% modificado</span>
                                  {change.isFullVersion && (
                                    <>
                                      <span>•</span>
                                      <span className="font-medium text-primary">Versión completa</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Competidor</CardTitle>
                <CardDescription>Edita la información y configuración del monitoreo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      disabled={!editMode}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridad</Label>
                      <Select
                        value={editForm.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setEditForm({ ...editForm, priority: value })
                        }
                        disabled={!editMode}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkInterval">Intervalo de Verificación (minutos)</Label>
                      <Input
                        id="checkInterval"
                        type="number"
                        value={editForm.checkInterval / 60}
                        onChange={(e) =>
                          setEditForm({ ...editForm, checkInterval: Number.parseInt(e.target.value) * 60 })
                        }
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="monitoring">Monitoreo Activo</Label>
                      <p className="text-sm text-muted-foreground">Habilitar o deshabilitar el monitoreo automático</p>
                    </div>
                    <Switch
                      id="monitoring"
                      checked={editForm.monitoringEnabled}
                      onCheckedChange={(checked) => setEditForm({ ...editForm, monitoringEnabled: checked })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <Button onClick={handleSaveChanges}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditMode(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                <CardDescription>Acciones irreversibles que afectarán permanentemente este competidor</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Competidor
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el competidor
              <span className="font-semibold"> {competitor.name}</span> y todos sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

