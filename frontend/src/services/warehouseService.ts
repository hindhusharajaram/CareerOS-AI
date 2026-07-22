import api from '../api/axios';

export interface WarehouseSummary {
  etlStatus: string;
  latestDataQualityScore: number;
  totalFactRecords: number;
  totalDimensionRecords: number;
  totalEtlJobsExecuted: number;
  factTableCounts: Record<string, number>;
  dimensionTableCounts: Record<string, number>;
  pipelineHealthStatus: string;
}

export const warehouseService = {
  getSummary: async (): Promise<WarehouseSummary> => {
    const res = await api.get('/api/v1/warehouse/summary');
    return res.data.data;
  },

  triggerEtl: async (): Promise<any> => {
    const res = await api.post('/api/v1/warehouse/etl/trigger');
    return res.data.data;
  }
};
