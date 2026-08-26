import api from '../api/axios';
import { FileMetadataData } from './fileService';

export interface ResumeHealthData {
  score: number;
  label: string;
  stars: string;
  percentile: string;
  readinessStatus: string;
}

export interface AtsCategoryScoreData {
  category: string;
  currentScore: number;
  maxScore: number;
  explanation: string;
}

export interface SectionHeatmapData {
  section: string;
  status: 'Present' | 'Partial' | 'Missing' | string;
  details: string;
}

export interface KeywordAnalysisData {
  matchedKeywords: string[];
  missingKeywords: string[];
  coveragePercentage: number;
}

export interface QuantificationBulletData {
  currentBullet: string;
  status: 'Quantified' | 'Needs Quantification' | string;
  suggestion: string;
}

export interface InsightData {
  category: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
}

export interface AtsCategoryBreakdown {
  score: number;
  max: number;
  passed: boolean;
  wordCount?: number;
  foundCount?: number;
  explanation?: string;
}

export interface ResumeReviewData {
  score: number;
  grade: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor' | string;
  health?: ResumeHealthData;
  atsCategoryBreakdown?: AtsCategoryScoreData[];
  heatmap?: SectionHeatmapData[];
  keywords: KeywordAnalysisData;
  quantification?: QuantificationBulletData[];
  insights: (InsightData | string)[];
  atsBreakdown?: Record<string, AtsCategoryBreakdown>;
  fileName?: string;
}

export interface ResumeData {
  id: string;
  studentId: string;
  file: FileMetadataData;
  version: number;
  isActive: boolean;
  parsedContent?: string;
  createdAt: string;
}

export const resumeService = {
  reviewResume: async (file: File): Promise<ResumeReviewData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/v1/student/resumes/review', formData);
    return response.data.data;
  },

  uploadResume: async (file: File): Promise<ResumeData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/v1/student/resumes/upload', formData);
    return response.data.data;
  },

  getResumes: async (): Promise<ResumeData[]> => {
    const response = await api.get('/api/v1/student/resumes');
    return response.data.data;
  },

  setActive: async (id: string): Promise<ResumeData> => {
    const response = await api.put(`/api/v1/student/resumes/${id}/active`);
    return response.data.data;
  },

  deleteResume: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/student/resumes/${id}`);
  }
};

