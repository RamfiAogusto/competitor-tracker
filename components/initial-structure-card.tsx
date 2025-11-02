"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Layers, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Users,
  Layout,
  Navigation,
  MessageSquare,
  CheckCircle2
} from "lucide-react"

interface InitialStructureCardProps {
  structure: {
    summary: string
    sectionsCount: number
    sections: Array<{
      selector: string
      type: string
      confidence: number
      text?: string
      hasId: boolean
      hasClass: boolean
    }>
  }
  className?: string
}

const getSectionIcon = (type: string) => {
  switch (type) {
    case 'pricing':
      return <DollarSign className="h-3.5 w-3.5" />
    case 'hero':
      return <Sparkles className="h-3.5 w-3.5" />
    case 'features':
      return <Layers className="h-3.5 w-3.5" />
    case 'testimonials':
      return <MessageSquare className="h-3.5 w-3.5" />
    case 'navigation':
      return <Navigation className="h-3.5 w-3.5" />
    case 'header':
      return <Layout className="h-3.5 w-3.5" />
    case 'footer':
      return <Layout className="h-3.5 w-3.5" />
    case 'cta':
      return <Users className="h-3.5 w-3.5" />
    default:
      return <FileText className="h-3.5 w-3.5" />
  }
}

const getSectionLabel = (type: string) => {
  const labels: Record<string, string> = {
    pricing: 'Precios',
    hero: 'Hero',
    features: 'Características',
    testimonials: 'Testimonios',
    navigation: 'Navegación',
    header: 'Encabezado',
    footer: 'Pie de página',
    cta: 'Call-to-Action',
    content: 'Contenido',
    form: 'Formulario',
    about: 'Acerca de',
    team: 'Equipo',
    gallery: 'Galería',
    blog: 'Blog',
    faq: 'FAQ'
  }
  return labels[type] || type
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return "text-green-600 dark:text-green-400"
  if (confidence >= 0.6) return "text-yellow-600 dark:text-yellow-400"
  return "text-orange-600 dark:text-orange-400"
}

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.8) return "Alta"
  if (confidence >= 0.6) return "Media"
  return "Baja"
}

export const InitialStructureCard = ({ structure, className = "" }: InitialStructureCardProps) => {
  // Agrupar secciones por tipo
  const sectionsByType = structure.sections.reduce((acc, section) => {
    if (!acc[section.type]) {
      acc[section.type] = []
    }
    acc[section.type].push(section)
    return acc
  }, {} as Record<string, typeof structure.sections>)

  return (
    <Card className={`border-muted ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Estructura del Sitio Web</CardTitle>
            <CardDescription className="text-xs">
              {structure.sectionsCount} sección{structure.sectionsCount !== 1 ? 'es' : ''} detectada{structure.sectionsCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {structure.summary}
          </p>

          {/* Resumen por tipo */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(sectionsByType).map(([type, sections]) => (
              <Badge key={type} variant="secondary" className="gap-1.5">
                {getSectionIcon(type)}
                {getSectionLabel(type)}
                <span className="ml-1 text-xs opacity-70">({sections.length})</span>
              </Badge>
            ))}
          </div>

          {/* Lista detallada de secciones principales (top 10) */}
          <div className="space-y-3 mt-4">
            <h4 className="text-sm font-medium">Secciones Principales:</h4>
            {structure.sections.slice(0, 10).map((section, index) => (
              <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSectionIcon(section.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {getSectionLabel(section.type)}
                        </span>
                        <code className="text-xs bg-background px-1.5 py-0.5 rounded border">
                          {section.selector}
                        </code>
                      </div>
                      {section.text && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {section.text.substring(0, 80)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {section.hasId && (
                      <Badge variant="outline" className="text-xs">
                        ID
                      </Badge>
                    )}
                    {section.hasClass && (
                      <Badge variant="outline" className="text-xs">
                        Class
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Barra de confianza */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Confianza:</span>
                    <span className={`font-medium ${getConfidenceColor(section.confidence)}`}>
                      {getConfidenceLabel(section.confidence)} ({Math.round(section.confidence * 100)}%)
                    </span>
                  </div>
                  <Progress 
                    value={section.confidence * 100} 
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>

          {structure.sections.length > 10 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              Mostrando 10 de {structure.sections.length} secciones detectadas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

