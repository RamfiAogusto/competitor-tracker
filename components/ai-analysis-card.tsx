"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  AlertTriangle,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AIAnalysisCardProps {
  analysis: {
    resumen: string
    impacto: string[]
    recomendaciones: string[]
    urgencia: 'Alto' | 'Medio' | 'Bajo'
    insights?: string
  }
  className?: string
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'Alto':
      return 'destructive'
    case 'Medio':
      return 'secondary'
    case 'Bajo':
      return 'outline'
    default:
      return 'outline'
  }
}

const getUrgencyIcon = (urgency: string) => {
  switch (urgency) {
    case 'Alto':
      return <AlertTriangle className="h-4 w-4" />
    case 'Medio':
      return <TrendingUp className="h-4 w-4" />
    case 'Bajo':
      return <Target className="h-4 w-4" />
    default:
      return <Target className="h-4 w-4" />
  }
}

export const AIAnalysisCard = ({ analysis, className = "" }: AIAnalysisCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className={`border-primary/20 bg-gradient-to-br from-primary/5 to-transparent ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Análisis de IA
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </CardTitle>
              <CardDescription>Insights generados por Gemini 2.5 Flash</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getUrgencyColor(analysis.urgencia)} className="gap-1">
              {getUrgencyIcon(analysis.urgencia)}
              Urgencia: {analysis.urgencia}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Resumen Ejecutivo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-blue-500/10">
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
              <h4 className="font-semibold text-sm">Resumen Ejecutivo</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-7">
              {analysis.resumen}
            </p>
          </div>

          <Separator />

          {/* Impacto en el Negocio */}
          {analysis.impacto && analysis.impacto.length > 0 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded bg-orange-500/10">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  </div>
                  <h4 className="font-semibold text-sm">Impacto en el Negocio</h4>
                </div>
                <ul className="space-y-2 pl-7">
                  {analysis.impacto.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-orange-500 font-semibold mt-0.5">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />
            </>
          )}

          {/* Recomendaciones */}
          {analysis.recomendaciones && analysis.recomendaciones.length > 0 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded bg-green-500/10">
                    <Lightbulb className="h-4 w-4 text-green-500" />
                  </div>
                  <h4 className="font-semibold text-sm">Recomendaciones</h4>
                </div>
                <ul className="space-y-2 pl-7">
                  {analysis.recomendaciones.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-green-500 font-semibold mt-0.5">→</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.insights && <Separator />}
            </>
          )}

          {/* Insights Adicionales */}
          {analysis.insights && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-purple-500/10">
                  <Target className="h-4 w-4 text-purple-500" />
                </div>
                <h4 className="font-semibold text-sm">Insights Adicionales</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                {analysis.insights}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

