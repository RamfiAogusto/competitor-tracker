import { apiClient } from './api'

// Interfaces para el historial de cambios
export interface ChangeHistoryItem {
  id: string
  competitorId: string
  competitorName: string
  competitorUrl: string
  versionNumber: number
  title: string
  description: string
  type: 'pricing' | 'content' | 'features' | 'design' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  changeCount: number
  changePercentage: number
  changeSummary: string
  timestamp: string
  date: string
  isFullVersion: boolean
  isCurrent: boolean
}

export interface ChangeDetails extends ChangeHistoryItem {
  changes: ChangeItem[]
  html?: string
  screenshot?: string
}

export interface ChangeItem {
  type: 'added' | 'modified' | 'removed'
  content: string
  lineNumber?: number
}

export interface ChangeStats {
  totalChanges: number
  criticalChanges: number
  highChanges: number
  mediumChanges: number
  lowChanges: number
  mostActiveCompetitor: {
    name: string
    changeCount: number
  }
  avgResponseTime: string
  changesThisWeek: number
  changesLast24h: number
}

export interface ChangesResponse {
  success: boolean
  data: ChangeHistoryItem[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

export interface ChangeStatsResponse {
  success: boolean
  data: ChangeStats
}

export interface ChangeDetailsResponse {
  success: boolean
  data: ChangeDetails
}

export interface ChangeDiffResponse {
  success: boolean
  data: {
    version1: number
    version2: number
    diff: string
    changes: ChangeItem[]
    summary: string
  }
}

class HistoryApiClient {
  private baseEndpoint = '/changes'

  /**
   * Obtener lista de cambios con filtros
   */
  async getChanges(params?: {
    page?: number
    limit?: number
    search?: string
    competitorId?: string
    type?: string
    severity?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
    startDate?: string
    endDate?: string
  }): Promise<ChangesResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.competitorId) queryParams.append('competitorId', params.competitorId)
    if (params?.type) queryParams.append('type', params.type)
    if (params?.severity) queryParams.append('severity', params.severity)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${this.baseEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return apiClient.request<ChangesResponse>(endpoint)
  }

  /**
   * Obtener estadísticas de cambios
   */
  async getStats(): Promise<ChangeStatsResponse> {
    return apiClient.request<ChangeStatsResponse>(`${this.baseEndpoint}/stats`)
  }

  /**
   * Obtener detalles de un cambio específico
   */
  async getChangeDetails(changeId: string): Promise<ChangeDetailsResponse> {
    return apiClient.request<ChangeDetailsResponse>(`${this.baseEndpoint}/${changeId}`)
  }

  /**
   * Obtener historial de un competidor específico
   */
  async getCompetitorHistory(competitorId: string, params?: {
    page?: number
    limit?: number
  }): Promise<ChangesResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const endpoint = `/competitors/${competitorId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return apiClient.request<ChangesResponse>(endpoint)
  }

  /**
   * Obtener HTML de una versión específica
   */
  async getVersionHtml(competitorId: string, versionNumber: number): Promise<{
    success: boolean
    data: {
      versionNumber: number
      html: string
      timestamp: string
      isFullVersion: boolean
    }
  }> {
    return apiClient.request(`/competitors/${competitorId}/version/${versionNumber}/html`)
  }

  /**
   * Comparar dos versiones de un competidor
   */
  async compareVersions(competitorId: string, version1: number, version2: number): Promise<ChangeDiffResponse> {
    return apiClient.request<ChangeDiffResponse>(`/competitors/${competitorId}/diff/${version1}/${version2}`)
  }

  /**
   * Exportar reporte de cambios
   */
  async exportReport(params?: {
    format?: 'json' | 'csv'
    competitorId?: string
    severity?: string
    startDate?: string
    endDate?: string
  }): Promise<Blob> {
    const queryParams = new URLSearchParams()
    
    if (params?.format) queryParams.append('format', params.format)
    if (params?.competitorId) queryParams.append('competitorId', params.competitorId)
    if (params?.severity) queryParams.append('severity', params.severity)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${this.baseEndpoint}/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.blob()
  }
}

export const historyApi = new HistoryApiClient()
