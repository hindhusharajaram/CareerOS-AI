import api from '../api/axios';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  detailsJson: string;
  ipAddress: string;
  traceId: string;
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  alertLevel: string;
  sourceModule: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface ObservabilityDashboard {
  healthSummary: {
    status: string;
    application: string;
    components: Record<string, string>;
    systemMetrics: {
      jvmMaxMemoryMb: number;
      jvmTotalMemoryMb: number;
      jvmFreeMemoryMb: number;
      jvmUsedMemoryMb: number;
      heapUsagePercentage?: number;
      totalDiskGb?: number;
      freeDiskGb?: number;
      usedDiskGb?: number;
      availableProcessors: number;
      systemLoadAverage?: number;
    };
  };
  liveMetrics?: Record<string, any>;
  activeAlerts: SystemAlert[];
  recentAuditLogs: AuditLog[];
  apiAverageLatencyMs: number;
  eventConsumerSuccessRate: number;
  totalEventsProcessed?: number;
}

export const observabilityService = {
  getDashboard: async (): Promise<ObservabilityDashboard> => {
    const res = await api.get('/api/v1/observability/dashboard');
    return res.data.data;
  },

  getHealth: async (): Promise<any> => {
    const res = await api.get('/api/v1/observability/health');
    return res.data.data;
  },

  getMetrics: async (): Promise<any> => {
    const res = await api.get('/api/v1/observability/metrics');
    return res.data.data;
  },

  getAlerts: async (): Promise<SystemAlert[]> => {
    const res = await api.get('/api/v1/observability/alerts');
    return res.data.data;
  },

  resolveAlert: async (alertId: string): Promise<SystemAlert> => {
    const res = await api.post(`/api/v1/observability/alerts/${alertId}/resolve`);
    return res.data.data;
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await api.get('/api/v1/observability/audit-logs');
    return res.data.data;
  }
};
