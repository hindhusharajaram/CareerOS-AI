import api from '../api/axios';

export interface ProfileHealthData {
  score: number;
  grade: string;
  categoryScores: Record<string, number>;
  missingSections: string[];
  suggestions: string[];
  priorityImprovements: string[];
}

export const healthService = {
  getHealth: async (): Promise<ProfileHealthData> => {
    const response = await api.get('/api/v1/student/health');
    return response.data.data;
  }
};
