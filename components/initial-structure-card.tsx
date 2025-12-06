"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Layers,
  DollarSign,
  Sparkles,
  FileText,
  Users,
  Layout,
  Navigation,
  MessageSquare,
  CheckCircle2,
  Code,
  Info
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
      return <Layout className="h-3.5 w-3.5 rotate-180" />
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
  return "text-muted-foreground"
}

export const InitialStructureCard = ({ structure, className = "" }: InitialStructureCardProps) => {
  if (!structure || !structure.sections || !Array.isArray(structure.sections)) {
    return null
  }

  // Agrupar secciones por tipo para los badges de resumen
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
              {structure.sectionsCount} secciones detectadas
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {structure.summary}
          </p>

          {/* Resumen por tipo (Badges) */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(sectionsByType).map(([type, sections]) => (
              <Badge key={type} variant="secondary" className="gap-1.5 h-6 text-xs font-normal">
                {getSectionIcon(type)}
                {getSectionLabel(type)}
                <span className="ml-1 opacity-70">({sections.length})</span>
              </Badge>
            ))}
          </div>

          <div className="rounded-md border bg-muted/30">
            <div className="p-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground flex justify-between items-center">
              <span>Detalle de Secciones</span>
              <span className="text-[10px] uppercase tracking-wider">Scroll para ver todo</span>
            </div>

            <ScrollArea className="h-[200px]">
              <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <TooltipProvider delayDuration={0}>
                  {structure.sections.map((section, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/80 border border-transparent hover:border-border transition-colors cursor-default group">
                          <div className={`p-1.5 rounded-md bg-background border flex-shrink-0 ${getConfidenceColor(section.confidence)}`}>
                            {getSectionIcon(section.type)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium truncate">
                                {getSectionLabel(section.type)}
                              </span>
                              <span className={`text-[10px] font-mono ${getConfidenceColor(section.confidence)}`}>
                                {Math.round(section.confidence * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                              <Code className="h-3 w-3" />
                              <span className="font-mono truncate opacity-70 group-hover:opacity-100">{section.selector}</span>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[300px] text-xs">
                        <div className="space-y-2">
                          <p className="font-semibold flex items-center gap-2">
                            {getSectionIcon(section.type)}
                            {getSectionLabel(section.type)}
                          </p>
                          <div className="space-y-1">
                            <p><span className="text-muted-foreground">Selector:</span> <code className="bg-muted px-1 rounded">{section.selector}</code></p>
                            <p><span className="text-muted-foreground">Confianza:</span> {Math.round(section.confidence * 100)}%</p>
                            {section.hasId && <Badge variant="outline" className="text-[10px] mr-1 h-5">ID</Badge>}
                            {section.hasClass && <Badge variant="outline" className="text-[10px] h-5">Class</Badge>}
                          </div>
                          {section.text && (
                            <div className="pt-1 border-t mt-1">
                              <span className="text-muted-foreground block mb-1">Contenido detectado:</span>
                              <p className="text-muted-foreground italic line-clamp-3">
                                "{section.text.substring(0, 150)}{section.text.length > 150 ? '...' : ''}"
                              </p>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
