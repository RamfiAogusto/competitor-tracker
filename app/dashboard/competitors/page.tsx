"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, ExternalLink, Eye, EyeOff, Trash2, Edit, Globe, Clock, Play } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { competitorsApi, Competitor, CompetitorStats } from "@/lib/competitors-api"
import { useAuth } from "@/contexts/AuthContext"

export default function CompetitorsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [stats, setStats] = useState<CompetitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [manualCheckLoading, setManualCheckLoading] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  // Formulario para agregar competitor
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    monitoringEnabled: true,
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  // Estado para edición
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    url: '',
    description: '',
    monitoringEnabled: true,
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  // Cargar datos
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [competitorsResponse, statsResponse] = await Promise.all([
        competitorsApi.getCompetitors(),
        competitorsApi.getStats()
      ])

      setCompetitors(competitorsResponse.data)
      setStats(statsResponse.data)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompetitor = async () => {
    try {
      await competitorsApi.createCompetitor(formData)
      setIsAddDialogOpen(false)
      setFormData({ name: '', url: '', description: '', monitoringEnabled: true, priority: 'medium' })
      setError(null) // Limpiar errores previos
      await loadData() // Recargar datos
    } catch (err: any) {
      console.error('Error creating competitor:', err)
      
      // Usar el mensaje específico del backend si está disponible
      if (err.message && err.message !== 'HTTP error! status: 409') {
        setError(err.message)
      } else {
        setError('Ya existe un competidor con esta URL. Por favor, usa una URL diferente.')
      }
    }
  }

  const handleEditCompetitor = (competitor: Competitor) => {
    setEditingCompetitor(competitor)
    setEditFormData({
      name: competitor.name,
      url: competitor.url,
      description: competitor.description || '',
      monitoringEnabled: competitor.monitoringEnabled,
      priority: competitor.priority
    })
  }

  const handleUpdateCompetitor = async () => {
    if (!editingCompetitor) return

    try {
      await competitorsApi.updateCompetitor(editingCompetitor.id, editFormData)
      setEditingCompetitor(null)
      setError(null)
      await loadData() // Recargar datos
    } catch (err: any) {
      console.error('Error updating competitor:', err)
      
      // Usar el mensaje específico del backend si está disponible
      if (err.message && err.message !== 'HTTP error! status: 409') {
        setError(err.message)
      } else {
        setError('Ya existe un competidor con esta URL. Por favor, usa una URL diferente.')
      }
    }
  }

  const handleToggleMonitoring = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await competitorsApi.disableMonitoring(id)
      } else {
        await competitorsApi.enableMonitoring(id)
      }
      await loadData() // Recargar datos
    } catch (err) {
      console.error('Error toggling monitoring:', err)
      setError('Error al cambiar el estado de monitoreo')
    }
  }

  const handleDeleteCompetitor = async (id: string) => {
    try {
      await competitorsApi.deleteCompetitor(id)
      await loadData() // Recargar datos
    } catch (err) {
      console.error('Error deleting competitor:', err)
      setError('Error al eliminar el competidor')
    }
  }

  const handleManualCheck = async (id: string, name: string) => {
    setManualCheckLoading(id)
    try {
      const result = await competitorsApi.manualCheck(id, true, 'v2')
      console.log('Manual check result:', result)
      
      // Mostrar mensaje de éxito
      if (result.success) {
        setError(null)
        // Recargar datos para mostrar cambios
        await loadData()
        
        // Mostrar notificación temporal
        const message = result.data.changesDetected 
          ? `✅ ${result.data.competitorName}: ${result.data.changeCount} cambios detectados (${result.data.severity})`
          : `ℹ️ ${result.data.competitorName}: No se detectaron cambios`
        
        // Crear notificación temporal
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50'
        notification.textContent = message
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 5000)
      }
    } catch (err: any) {
      console.error('Error en monitoreo manual:', err)
      setError(err.message || 'Error ejecutando monitoreo manual')
    } finally {
      setManualCheckLoading(null)
    }
  }

  const formatLastCheck = (lastCheckedAt?: string) => {
    if (!lastCheckedAt) return 'Nunca'
    
    const date = new Date(lastCheckedAt)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} horas atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} días atrás`
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

  const getStatusColor = (monitoringEnabled: boolean) => {
    return monitoringEnabled ? "bg-green-500" : "bg-yellow-500"
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando competidores...</p>
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
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadData}>Reintentar</Button>
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
            <h1 className="text-3xl font-bold">Competitors</h1>
            <p className="text-muted-foreground">Manage and monitor your competitor websites</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Competitor</DialogTitle>
                <DialogDescription>Add a competitor website to start monitoring changes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. TechCorp" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input 
                    id="url" 
                    placeholder="https://example.com" 
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Brief description of this competitor..." 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select 
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="monitoring" 
                    checked={formData.monitoringEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, monitoringEnabled: checked })}
                  />
                  <Label htmlFor="monitoring">Start monitoring immediately</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCompetitor}>Add Competitor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Competitors</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.active || 0} active, {stats?.paused || 0} paused</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.active || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.total ? Math.round((stats.active / stats.total) * 100) : 0}% of competitors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Badge variant="destructive" className="h-4 w-4 rounded-full p-0"></Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.highPriority || 0}</div>
              <p className="text-xs text-muted-foreground">High priority</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Check Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgCheckTime || '0m'}</div>
              <p className="text-xs text-muted-foreground">Every 5 minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Competitors List */}
        <Card>
          <CardHeader>
            <CardTitle>Competitor List</CardTitle>
            <CardDescription>All your monitored competitors and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay competidores agregados aún.</p>
                  <p className="text-sm text-muted-foreground mt-2">Agrega tu primer competidor para comenzar el monitoreo.</p>
                </div>
              ) : (
                competitors.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(competitor.monitoringEnabled)}`}></div>
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {competitor.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{competitor.name}</h3>
                          <Badge variant={getPriorityColor(competitor.priority)} className="text-xs">
                            {competitor.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{competitor.url}</span>
                          <span>•</span>
                          <span>{competitor.changeCount} changes</span>
                          <span>•</span>
                          <span>Last check: {formatLastCheck(competitor.lastCheckedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleManualCheck(competitor.id, competitor.name)}
                        disabled={manualCheckLoading === competitor.id}
                        title="Ejecutar monitoreo manual"
                      >
                        {manualCheckLoading === competitor.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <Play className="h-4 w-4 text-blue-600" />
                        )}
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleMonitoring(competitor.id, competitor.monitoringEnabled)}
                      >
                        {competitor.monitoringEnabled ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCompetitor(competitor)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Changes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleManualCheck(competitor.id, competitor.name)}
                            disabled={manualCheckLoading === competitor.id}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {manualCheckLoading === competitor.id ? 'Checking...' : 'Manual Check'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleMonitoring(competitor.id, competitor.monitoringEnabled)}>
                            {competitor.monitoringEnabled ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Pause Monitoring
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Resume Monitoring
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteCompetitor(competitor.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Setup Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Setup Guide</CardTitle>
            <CardDescription>Get the most out of competitor monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Add Competitors</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by adding your main competitors' websites to begin monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Set Priorities</h4>
                  <p className="text-sm text-muted-foreground">
                    Mark important competitors as high priority for faster notifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Configure Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up notifications to get alerted when important changes happen.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para editar competidor */}
      <Dialog open={!!editingCompetitor} onOpenChange={(open) => !open && setEditingCompetitor(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Competidor</DialogTitle>
            <DialogDescription>
              Modifica la información del competidor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="col-span-3"
                placeholder="Nombre del competidor"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-url"
                value={editFormData.url}
                onChange={(e) => setEditFormData({ ...editFormData, url: e.target.value })}
                className="col-span-3"
                placeholder="https://ejemplo.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descripción
              </Label>
              <Input
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="col-span-3"
                placeholder="Descripción opcional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-priority" className="text-right">
                Prioridad
              </Label>
              <select
                id="edit-priority"
                value={editFormData.priority}
                onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-monitoring" className="text-right">
                Monitoreo
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-monitoring"
                  checked={editFormData.monitoringEnabled}
                  onChange={(e) => setEditFormData({ ...editFormData, monitoringEnabled: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-monitoring" className="text-sm">
                  Habilitar monitoreo
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCompetitor(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCompetitor}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
