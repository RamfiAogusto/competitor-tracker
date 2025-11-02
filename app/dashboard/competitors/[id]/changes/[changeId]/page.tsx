"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { competitorsApi, type Competitor, type ChangeHistory } from "@/lib/competitors-api"
import { AIAnalysisCard } from "@/components/ai-analysis-card"
import { ExtractedSectionsCard } from "@/components/extracted-sections-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  FileText,
  Code,
  Palette,
  DollarSign,
  Package,
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  History,
  Calendar,
  Hash,
  Percent,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Utility functions
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatRelativeTime = (timestamp: string) => {
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
  
  return `Hace ${diffDays} días`
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

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case "pricing":
      return DollarSign
    case "feature":
      return Package
    case "design":
      return Palette
    case "content":
      return FileText
    default:
      return Code
  }
}

export default function ChangeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const competitorId = params.id as string
  const changeId = params.changeId as string

  const [loading, setLoading] = useState(true)
  const [competitor, setCompetitor] = useState<Competitor | null>(null)
  const [change, setChange] = useState<ChangeHistory | null>(null)
  const [allChanges, setAllChanges] = useState<ChangeHistory[]>([])

  useEffect(() => {
    loadData()
  }, [competitorId, changeId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar competidor
      const competitorResponse = await competitorsApi.getCompetitor(competitorId)
      setCompetitor(competitorResponse.data)

      // Cargar historial completo
      const historyData = await competitorsApi.getHistory(competitorId, { limit: 100 })
      setAllChanges(historyData.data)

      // Buscar el cambio específico
      const specificChange = historyData.data.find((c: ChangeHistory) => c.id === changeId)
      if (specificChange) {
        setChange(specificChange)
      } else {
        toast({
          title: "Error",
          description: "No se encontró el cambio solicitado",
          variant: "destructive",
        })
        router.push(`/dashboard/competitors/${competitorId}`)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la información del cambio",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (!change || !competitor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Cambio no encontrado</h2>
          <p className="text-muted-foreground mb-6">El cambio que buscas no existe o ha sido eliminado</p>
          <Button onClick={() => router.push(`/dashboard/competitors/${competitorId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Competidor
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const Icon = getChangeTypeIcon(change.changeType)
  const timestamp = change.timestamp || change.created_at
  const summary = change.summary || change.changeSummary

  // Encontrar el cambio anterior para comparación
  const currentIndex = allChanges.findIndex(c => c.id === changeId)
  const previousChange = currentIndex < allChanges.length - 1 ? allChanges[currentIndex + 1] : null
  const nextChange = currentIndex > 0 ? allChanges[currentIndex - 1] : null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/competitors/${competitorId}`)}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {competitor.name}
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Detalle del Cambio</h1>
            <p className="text-muted-foreground">
              Versión #{change.versionNumber} • {formatRelativeTime(timestamp)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Sitio
              </a>
            </Button>
          </div>
        </div>

        {/* Navegación entre cambios */}
        {(previousChange || nextChange) && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => previousChange && router.push(`/dashboard/competitors/${competitorId}/changes/${previousChange.id}`)}
                  disabled={!previousChange}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cambio Anterior
                  {previousChange && <span className="ml-2 text-xs text-muted-foreground">(v{previousChange.versionNumber})</span>}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} de {allChanges.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => nextChange && router.push(`/dashboard/competitors/${competitorId}/changes/${nextChange.id}`)}
                  disabled={!nextChange}
                >
                  Siguiente Cambio
                  {nextChange && <span className="ml-2 text-xs text-muted-foreground">(v{nextChange.versionNumber})</span>}
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen del Cambio */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{summary}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatTimestamp(timestamp)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getSeverityColor(change.severity) as any}>
                    {change.severity}
                  </Badge>
                  <Badge variant="outline">{change.changeType}</Badge>
                  {change.isCurrent && (
                    <Badge variant="default">Versión Actual</Badge>
                  )}
                  {change.isFullVersion ? (
                    <Badge variant="secondary">Versión Completa</Badge>
                  ) : (
                    <Badge variant="outline">Versión Parcial</Badge>
                  )}
                  {change.metadata?.aiAnalysis && (
                    <Badge variant="default" className="gap-1">
                      <Brain className="h-3 w-3" />
                      Análisis de IA
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Métricas del Cambio */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      <span>Versión</span>
                    </div>
                    <p className="text-2xl font-bold">{change.versionNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span>Cambios</span>
                    </div>
                    <p className="text-2xl font-bold">{change.changeCount}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Percent className="h-4 w-4" />
                      <span>Modificado</span>
                    </div>
                    <p className="text-2xl font-bold">{Number(change.changePercentage || 0).toFixed(2)}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Severidad</span>
                    </div>
                    <p className="text-2xl font-bold capitalize">{change.severity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secciones Detectadas */}
            {change.metadata?.extractedSections && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Secciones Detectadas
                  </CardTitle>
                  <CardDescription>
                    Áreas específicas del sitio web que fueron modificadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExtractedSectionsCard sections={change.metadata.extractedSections} />
                </CardContent>
              </Card>
            )}

            {/* Análisis de IA */}
            {change.metadata?.aiAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Análisis de Inteligencia Artificial
                  </CardTitle>
                  <CardDescription>
                    Insights generados automáticamente por IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIAnalysisCard analysis={change.metadata.aiAnalysis} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información Técnica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Técnica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">ID del Snapshot</span>
                    <span className="text-sm font-mono text-right break-all max-w-[60%]">
                      {change.id.substring(0, 8)}...
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Tipo de Cambio</span>
                    <span className="text-sm font-medium capitalize">{change.changeType}</span>
                  </div>
                  <Separator />
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Versión Completa</span>
                    <span className="text-sm font-medium">{change.isFullVersion ? "Sí" : "No"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Versión Actual</span>
                    <span className="text-sm font-medium">{change.isCurrent ? "Sí" : "No"}</span>
                  </div>
                  {change.metadata?.extractedSections && (
                    <>
                      <Separator />
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Secciones Analizadas</span>
                        <span className="text-sm font-medium">
                          {change.metadata.extractedSections.sectionsCount || 0}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Línea de Tiempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Detectado</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(timestamp)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(timestamp)}
                      </p>
                    </div>
                  </div>
                  {previousChange && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Cambio Anterior</p>
                          <p className="text-xs text-muted-foreground">
                            Versión #{previousChange.versionNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(previousChange.timestamp || previousChange.created_at)}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Sitio Web
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/competitors/${competitorId}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Competidor
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Próximamente",
                      description: "La funcionalidad de exportar estará disponible pronto",
                    })
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

