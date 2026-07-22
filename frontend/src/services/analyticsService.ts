import api from '../api/axios';

export interface AnalyticsSummary {
  totalEventsLogged: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  successRatePercentage: number;
  averageLatencyMs: number;
  topFeatures: Record<string, number>;
  systemHealthFlags: string[];
}

export const analyticsService = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const res = await api.get('/api/v1/analytics/summary');
    return res.data.data;
  }
};
