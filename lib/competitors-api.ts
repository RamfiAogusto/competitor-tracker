/**
 * API client para gestión de competitors
 */

import { apiClient } from './api'

export interface Competitor {
  id: string
  name: string
  url: string
  description?: string
  monitoringEnabled: boolean
  checkInterval: number
  priority: 'low' | 'medium' | 'high'
  lastCheckedAt?: string
  totalVersions: number
  lastChangeAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Campos calculados
  severity: 'low' | 'medium' | 'high' | 'critical'
  changeCount: number
}

export interface CompetitorStats {
  total: number
  active: number
  paused: number
  highPriority: number
  avgCheckTime: string
  priority: {
    high: number
    medium: number
    low: number
  }
  severity: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export interface CreateCompetitorData {
  name: string
  url: string
  description?: string
  monitoringEnabled?: boolean
  checkInterval?: number
  priority?: 'low' | 'medium' | 'high'
}

export interface UpdateCompetitorData {
  name?: string
  url?: string
  description?: string
  monitoringEnabled?: boolean
  checkInterval?: number
  priority?: 'low' | 'medium' | 'high'
}

export interface CompetitorsResponse {
  success: boolean
  data: Competitor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CompetitorStatsResponse {
  success: boolean
  data: CompetitorStats
}

class CompetitorsApiClient {
  private baseEndpoint = '/competitors'

  /**
   * Obtener lista de competitors
   */
  async getCompetitors(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  }): Promise<CompetitorsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const endpoint = `${this.baseEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return apiClient.request<CompetitorsResponse>(endpoint)
  }

  /**
   * Obtener estadísticas de competitors
   */
  async getStats(): Promise<CompetitorStatsResponse> {
    return apiClient.request<CompetitorStatsResponse>(`${this.baseEndpoint}/overview`)
  }

  /**
   * Obtener un competitor específico
   */
  async getCompetitor(id: string): Promise<{ success: boolean; data: Competitor }> {
    return apiClient.request<{ success: boolean; data: Competitor }>(`${this.baseEndpoint}/${id}`)
  }

  /**
   * Crear un nuevo competitor
   */
  async createCompetitor(data: CreateCompetitorData): Promise<{ success: boolean; data: Competitor; message: string }> {
    return apiClient.request<{ success: boolean; data: Competitor; message: string }>(this.baseEndpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Actualizar un competitor
   */
  async updateCompetitor(id: string, data: UpdateCompetitorData): Promise<{ success: boolean; data: Competitor; message: string }> {
    return apiClient.request<{ success: boolean; data: Competitor; message: string }>(`${this.baseEndpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * Eliminar un competitor
   */
  async deleteCompetitor(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.request<{ success: boolean; message: string }>(`${this.baseEndpoint}/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Habilitar monitoreo
   */
  async enableMonitoring(id: string): Promise<{ success: boolean; data: { id: string; name: string; monitoringEnabled: boolean }; message: string }> {
    return apiClient.request<{ success: boolean; data: { id: string; name: string; monitoringEnabled: boolean }; message: string }>(`${this.baseEndpoint}/${id}/enable-monitoring`, {
      method: 'POST',
    })
  }

  /**
   * Deshabilitar monitoreo
   */
  async disableMonitoring(id: string): Promise<{ success: boolean; data: { id: string; name: string; monitoringEnabled: boolean }; message: string }> {
    return apiClient.request<{ success: boolean; data: { id: string; name: string; monitoringEnabled: boolean }; message: string }>(`${this.baseEndpoint}/${id}/disable-monitoring`, {
      method: 'POST',
    })
  }

  /**
   * Capturar cambios manualmente
   */
  async captureChanges(id: string, options?: any): Promise<{ success: boolean; data: any; message: string }> {
    return apiClient.request<{ success: boolean; data: any; message: string }>(`${this.baseEndpoint}/${id}/capture`, {
      method: 'POST',
      body: JSON.stringify({ options }),
    })
  }

  /**
   * Ejecutar monitoreo manual
   */
  async manualCheck(id: string, simulate: boolean = false): Promise<{ success: boolean; data: any; message: string }> {
    return apiClient.request<{ success: boolean; data: any; message: string }>(`${this.baseEndpoint}/${id}/manual-check`, {
      method: 'POST',
      body: JSON.stringify({ simulate }),
    })
  }

  /**
   * Iniciar monitoreo automático
   */
  async startMonitoring(id: string, interval?: number, options?: any): Promise<{ success: boolean; data: any; message: string }> {
    return apiClient.request<{ success: boolean; data: any; message: string }>(`${this.baseEndpoint}/${id}/start-monitoring`, {
      method: 'POST',
      body: JSON.stringify({ interval, options }),
    })
  }

  /**
   * Obtener estado del monitoreo
   */
  async getMonitoringStatus(id: string): Promise<{ success: boolean; data: any }> {
    return apiClient.request<{ success: boolean; data: any }>(`${this.baseEndpoint}/${id}/monitoring-status`)
  }

  /**
   * Obtener historial de versiones
   */
  async getHistory(id: string, params?: { limit?: number; offset?: number }): Promise<{ success: boolean; data: any[]; pagination: any }> {
    const queryParams = new URLSearchParams()
    
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const endpoint = `${this.baseEndpoint}/${id}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return apiClient.request<{ success: boolean; data: any[]; pagination: any }>(endpoint)
  }
}

export const competitorsApi = new CompetitorsApiClient()
