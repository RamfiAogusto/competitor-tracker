"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Layers, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Users,
  Layout,
  Navigation,
  MessageSquare
} from "lucide-react"

interface ExtractedSectionsCardProps {
  sections: {
    summary: string
    sectionsCount: number
    sectionTypes: string[]
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
    form: 'Formulario'
  }
  return labels[type] || type
}

export const ExtractedSectionsCard = ({ sections, className = "" }: ExtractedSectionsCardProps) => {
  return (
    <Card className={`border-muted ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-muted">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Secciones Detectadas</CardTitle>
            <CardDescription className="text-xs">
              {sections.sectionsCount} sección{sections.sectionsCount !== 1 ? 'es' : ''} modificada{sections.sectionsCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            {sections.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {sections.sectionTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="gap-1.5">
                {getSectionIcon(type)}
                {getSectionLabel(type)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

