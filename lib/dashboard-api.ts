/**
 * API client para endpoints del dashboard
 */

import { apiClient } from './api'

export interface DashboardOverview {
  stats: {
    totalCompetitors: number
    activeMonitors: number
    totalChanges: number
    criticalAlerts: number
    lastCheck: string | null
  }
  trends: {
    changesLast7Days: number[]
    alertsLast7Days: number[]
    competitorsAdded: number[]
  }
  recentActivity: Array<{
    id: string
    type: string
    competitorName: string
    message: string
    severity: string
    timestamp: string
  }>
}

export interface RecentChange {
  id: string
  competitorId: string
  competitorName: string
  competitorUrl: string
  versionNumber: number
  severity: string
  changePercentage: number
  changeCount: number
  changeSummary: string
  changeType: string
  detectedAt: string
}

export interface TopCompetitor {
  id: string
  name: string
  url: string
  totalChanges: number
  criticalChanges: number
  highChanges: number
  lastChange: string | null
  changeTrend: 'increasing' | 'decreasing' | 'stable'
  priority: string
  monitoringEnabled: boolean
}

export interface DashboardStats {
  period: string
  competitors: {
    total: number
    active: number
    inactive: number
    addedThisPeriod: number
  }
  changes: {
    total: number
    bySeverity: {
      critical: number
      high: number
      medium: number
      low: number
    }
    byType: {
      content_change: number
      price_change: number
      new_page: number
      page_removed: number
      layout_change: number
    }
  }
  alerts: {
    total: number
    unread: number
    bySeverity: {
      critical: number
      high: number
      medium: number
      low: number
    }
  }
  performance: {
    averageResponseTime: number
    successRate: number
    lastUptime: string
  }
}

class DashboardApi {
  /**
   * Obtener resumen general del dashboard
   */
  async getOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get<{ success: boolean; data: DashboardOverview }>('/dashboard/overview')
    return response.data
  }

  /**
   * Obtener estadísticas detalladas
   */
  async getStats(period: string = '30d', metric: string = 'all'): Promise<DashboardStats> {
    const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats', {
      params: { period, metric }
    })
    return response.data
  }

  /**
   * Obtener cambios recientes
   */
  async getRecentChanges(limit: number = 20, severity?: string): Promise<RecentChange[]> {
    const response = await apiClient.get<{ success: boolean; data: RecentChange[] }>('/dashboard/recent-changes', {
      params: { limit, severity }
    })
    return response.data
  }

  /**
   * Obtener competidores con más cambios
   */
  async getTopCompetitors(limit: number = 10, period: string = '30d'): Promise<TopCompetitor[]> {
    const response = await apiClient.get<{ success: boolean; data: TopCompetitor[] }>('/dashboard/competitors/top-changes', {
      params: { limit, period }
    })
    return response.data
  }

  /**
   * Obtener resumen de alertas
   */
  async getAlertsSummary(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/dashboard/alerts/summary')
    return response.data
  }

  /**
   * Obtener métricas de rendimiento
   */
  async getPerformance(period: string = '7d'): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/dashboard/performance', {
      params: { period }
    })
    return response.data
  }

  /**
   * Obtener datos de tendencias
   */
  async getTrends(period: string = '30d', metric: string = 'changes'): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/dashboard/trends', {
      params: { period, metric }
    })
    return response.data
  }

  /**
   * Verificar estado de salud de servicios
   */
  async getHealth(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/dashboard/health')
    return response.data
  }
}

export const dashboardApi = new DashboardApi()
