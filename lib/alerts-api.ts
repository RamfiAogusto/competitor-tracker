/**
 * API client para gestión de alertas
 */

import { apiClient } from './api'

export interface Alert {
  id: string
  userId: string
  competitorId: string
  snapshotId?: string
  type: 'content_change' | 'price_change' | 'new_page' | 'page_removed' | 'error'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'unread' | 'read' | 'archived'
  title: string
  message: string
  changeCount: number
  changePercentage?: number
  versionNumber?: number
  changeSummary?: string
  affectedSections?: string[]
  readAt?: string
  archivedAt?: string
  created_at: string
  updated_at: string
  // Relaciones
  competitor?: {
    id: string
    name: string
    url: string
  }
}

export interface AlertStats {
  total: number
  unread: number
  read: number
  archived: number
  bySeverity: {
    low: number
    medium: number
    high: number
    critical: number
  }
  byType: {
    [key: string]: number
  }
  trends?: {
    alertsPerDay: number[]
    criticalPerDay: number[]
  }
  period?: string
}

export interface GetAlertsParams {
  page?: number
  limit?: number
  status?: 'unread' | 'read' | 'archived'
  severity?: 'low' | 'medium' | 'high' | 'critical'
  type?: string
  competitorId?: string
}

export interface AlertsResponse {
  success: boolean
  data: Alert[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AlertStatsResponse {
  success: boolean
  data: AlertStats
}

class AlertsApiClient {
  private baseEndpoint = '/alerts'

  /**
   * Obtener lista de alertas
   */
  async getAlerts(params?: GetAlertsParams): Promise<AlertsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.severity) queryParams.append('severity', params.severity)
    if (params?.type) queryParams.append('type', params.type)
    if (params?.competitorId) queryParams.append('competitorId', params.competitorId)

    const endpoint = `${this.baseEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return apiClient.request<AlertsResponse>(endpoint)
  }

  /**
   * Obtener estadísticas de alertas
   */
  async getStats(period?: string): Promise<AlertStatsResponse> {
    const queryParams = new URLSearchParams()
    if (period) queryParams.append('period', period)

    const endpoint = `${this.baseEndpoint}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return apiClient.request<AlertStatsResponse>(endpoint)
  }

  /**
   * Obtener una alerta específica
   */
  async getAlert(id: string): Promise<{ success: boolean; data: Alert }> {
    return apiClient.request<{ success: boolean; data: Alert }>(`${this.baseEndpoint}/${id}`)
  }

  /**
   * Marcar alerta como leída
   */
  async markAsRead(id: string): Promise<{ success: boolean; data: Alert; message: string }> {
    return apiClient.request<{ success: boolean; data: Alert; message: string }>(`${this.baseEndpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'read' }),
    })
  }

  /**
   * Archivar alerta
   */
  async archiveAlert(id: string): Promise<{ success: boolean; data: Alert; message: string }> {
    return apiClient.request<{ success: boolean; data: Alert; message: string }>(`${this.baseEndpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'archived' }),
    })
  }

  /**
   * Marcar todas las alertas como leídas
   */
  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    return apiClient.request<{ success: boolean; message: string }>(`${this.baseEndpoint}/mark-all-read`, {
      method: 'POST',
    })
  }
}

export const alertsApi = new AlertsApiClient()
