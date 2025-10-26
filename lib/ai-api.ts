/**
 * API client para servicios de IA
 */

import { apiClient } from './api'

export interface AIAnalysis {
  resumen: string
  impacto: string[]
  recomendaciones: string[]
  urgencia: 'Alto' | 'Medio' | 'Bajo'
  insights?: string
}

export interface ExtractedSection {
  type: string
  selector: string
  changeType: string
  changes: Array<{
    type: string
    before?: string
    after?: string
    attribute?: string
    description?: string
  }>
}

export interface SectionExtractionData {
  summary: string
  sectionsCount: number
  sectionTypes: string[]
}

export interface SnapshotMetadata {
  extractedSections?: SectionExtractionData
  aiAnalysis?: AIAnalysis
}

export interface AnalyzeChangeRequest {
  competitorName: string
  url: string
  date?: string
  changeType?: string
  severity?: string
  totalChanges?: number
  sections: ExtractedSection[]
}

export interface CategorizeChangeRequest {
  changeDetails: {
    summary: string
    changes?: any[]
  }
}

export interface SummarizeChangesRequest {
  changes: Array<{
    summary: string
    severity?: string
    date?: string
  }>
}

export interface CompetitorInsightsRequest {
  competitorProfile: {
    name: string
    domain: string
    businessModel?: string
    pricing?: any
  }
  recentChanges: Array<{
    summary: string
    date?: string
  }>
}

class AIApiClient {
  private baseEndpoint = '/ai'

  /**
   * Verificar conexión con la IA
   */
  async testConnection(): Promise<{ success: boolean; data: string }> {
    return apiClient.request<{ success: boolean; data: string }>(`${this.baseEndpoint}/test`)
  }

  /**
   * Analizar un cambio específico
   */
  async analyzeChange(data: AnalyzeChangeRequest): Promise<{ success: boolean; data: AIAnalysis }> {
    return apiClient.request<{ success: boolean; data: AIAnalysis }>(`${this.baseEndpoint}/analyze-change`, {
      method: 'POST',
      body: JSON.stringify({ changeDetails: data }),
    })
  }

  /**
   * Categorizar un cambio
   */
  async categorizeChange(data: CategorizeChangeRequest): Promise<{ success: boolean; data: string }> {
    return apiClient.request<{ success: boolean; data: string }>(`${this.baseEndpoint}/categorize-change`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Resumir múltiples cambios
   */
  async summarizeChanges(data: SummarizeChangesRequest): Promise<{ success: boolean; data: string }> {
    return apiClient.request<{ success: boolean; data: string }>(`${this.baseEndpoint}/summarize-changes`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Generar insights de un competidor
   */
  async generateCompetitorInsights(data: CompetitorInsightsRequest): Promise<{ 
    success: boolean
    data: {
      estrategia: string
      fortalezas: string[]
      oportunidades: string[]
      prediccion: string
    }
  }> {
    return apiClient.request<{ 
      success: boolean
      data: {
        estrategia: string
        fortalezas: string[]
        oportunidades: string[]
        prediccion: string
      }
    }>(`${this.baseEndpoint}/competitor-insights`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Analizar un snapshot con IA (si tiene secciones extraídas)
   */
  async analyzeSnapshot(
    competitorId: string,
    snapshotId: string,
    options?: { force?: boolean }
  ): Promise<{ success: boolean; data: AIAnalysis }> {
    return apiClient.request<{ success: boolean; data: AIAnalysis }>(
      `/competitors/${competitorId}/snapshots/${snapshotId}/analyze`,
      {
        method: 'POST',
        body: JSON.stringify(options || {}),
      }
    )
  }
}

export const aiApi = new AIApiClient()

