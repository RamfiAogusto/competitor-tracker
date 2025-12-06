"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { competitorsApi, type Competitor, type ChangeHistory } from "@/lib/competitors-api"
import { AIAnalysisCard } from "@/components/ai-analysis-card"
import { ExtractedSectionsCard } from "@/components/extracted-sections-card"
import { InitialStructureCard } from "@/components/initial-structure-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
  Brain,
  Layers,
  ExternalLink,
} from "lucide-react"

export default function ChangeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const competitorId = params.id as string
  const changeId = params.changeId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [competitor, setCompetitor] = useState<Competitor | null>(null)
  const [change, setChange] = useState<ChangeHistory | null>(null)

  useEffect(() => {
    loadData()
  }, [competitorId, changeId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar competidor
      const competitorResponse = await competitorsApi.getCompetitor(competitorId)
      if (competitorResponse.success && competitorResponse.data) {
        setCompetitor(competitorResponse.data)
      }

      // Cargar historial completo para encontrar el cambio específico
      const historyResponse = await competitorsApi.getHistory(competitorId, { limit: 100 })
      if (historyResponse.success && historyResponse.data) {
        const foundChange = historyResponse.data.find((c) => c.id === changeId)
        if (foundChange) {
          setChange(foundChange)
        } else {
          setError("Cambio no encontrado")
        }
      }
    } catch (err) {
      console.error("Error cargando datos:", err)
      setError("Error al cargar los datos del cambio")
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
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
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getChangeTypeLabel = (type: string) => {
    if (type === "other" && change?.changeSummary?.toLowerCase().includes("primera captura")) {
      return "Captura Inicial"
    }

    const labels: Record<string, string> = {
      content: "Contenido",
      design: "Diseño",
      pricing: "Precios",
      feature: "Funcionalidad",
      other: "Otro",
    }
    return labels[type] || type
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

  if (error || !change || !competitor) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error || "Cambio no encontrado"}</p>
            <Button onClick={() => router.push(`/dashboard/competitors/${competitorId}`)}>
              Volver al Competidor
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb + Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/competitors")}
              className="gap-2"
            >
              Competidores
            </Button>
            <span>/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/competitors/${competitorId}`)}
              className="gap-2"
            >
              {competitor.name}
            </Button>
            <span>/</span>
            <span>Versión {change.versionNumber}</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/dashboard/competitors/${competitorId}`)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              </div>
              <h1 className="text-3xl font-bold">Versión {change.versionNumber}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getSeverityColor(change.severity) as any}>
                  {change.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline">{getChangeTypeLabel(change.changeType)}</Badge>
                {change.isFullVersion && <Badge variant="secondary">Versión Completa</Badge>}
                {change.isCurrent && <Badge variant="default">Actual</Badge>}
              </div>
            </div>

            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Ver sitio
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fecha de Detección</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatTimestamp(change.created_at)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cambios Detectados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{change.changeCount}</div>
              <p className="text-xs text-muted-foreground">
                {change.changePercentage}% del contenido
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipo de Cambio</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getChangeTypeLabel(change.changeType)}</div>
              <p className="text-xs text-muted-foreground">Categoría principal</p>
            </CardContent>
          </Card>
        </div>

        {/* Change Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Cambio</CardTitle>
            <CardDescription>Descripción general de los cambios detectados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{change.changeSummary}</p>
          </CardContent>
        </Card>

        {/* Estructura Inicial (solo en primera captura) */}
        {change.metadata?.initialStructure && (
          <InitialStructureCard structure={change.metadata.initialStructure} />
        )}

        {/* Secciones Extraídas (cambios detectados) */}
        {change.metadata?.extractedSections && (
          <ExtractedSectionsCard sections={change.metadata.extractedSections} />
        )}

        {/* Análisis de IA */}
        {change.metadata?.aiAnalysis && (
          <AIAnalysisCard analysis={change.metadata.aiAnalysis} />
        )}

        {/* Placeholder para futuras funcionalidades */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Próximamente</CardTitle>
            <CardDescription>
              Funcionalidades adicionales en desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Comparación visual entre versiones (diff HTML)</p>
            <p>• Screenshots del sitio en el momento del cambio</p>
            <p>• Historial de cambios relacionados</p>
            <p>• Exportar análisis en PDF</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
