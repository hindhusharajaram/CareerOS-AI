import api from '../api/axios';

export interface CareerScoreData {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
}

export interface AtsScoreData {
  atsScore: number;
  sectionCompleteness: Record<string, boolean>;
  keywordDensityScore: number;
  suggestions: string[];
  missingSections: string[];
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  priorityLevel: string;
  learningDifficulty: string;
  estimatedLearningHours: number;
}

export interface SkillGapData {
  preferredRole: string;
  currentSkills: string[];
  missingSkills: SkillGapItem[];
  recommendedSkills: SkillGapItem[];
}

export interface RoadmapTask {
  week: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
}

export interface CareerRoadmapData {
  targetRole: string;
  day30Roadmap: RoadmapTask[];
  day60Roadmap: RoadmapTask[];
  day90Roadmap: RoadmapTask[];
}

export interface CompanyEligibilityItem {
  companyName: string;
  programName: string;
  status: string;
  explanation: string;
  metCriteria: string[];
  missingCriteria: string[];
}

export interface EligibilityReportData {
  evaluations: CompanyEligibilityItem[];
}

export interface SingleProjectAnalysis {
  projectId: string;
  title: string;
  qualityScore: number;
  difficultyRating: string;
  hasGithub: boolean;
  hasLiveDemo: boolean;
  suggestions: string[];
}

export interface ProjectAnalysisData {
  overallProjectScore: number;
  projectAnalyses: SingleProjectAnalysis[];
  recommendedImprovements: string[];
}

export interface ProfileInsightData {
  topStrengths: string[];
  topWeaknesses: string[];
  priorityImprovements: string[];
  riskFactors: string[];
  missingItems: string[];
  readinessLevel: string;
}

export interface RecommendationItem {
  title: string;
  category: string;
  reason: string;
  priority: string;
  confidenceScore: number;
}

export interface RecommendationData {
  suitableRoles: string[];
  suitableDomains: string[];
  items: RecommendationItem[];
  interviewReadinessScore: number;
}

export interface TrendAnalyticsData {
  mostCommonSkills: Record<string, number>;
  missingSkillsDistribution: Record<string, number>;
  technologyDistribution: Record<string, number>;
  projectCategoryDistribution: Record<string, number>;
  certificateDistribution: Record<string, number>;
  careerGoalTrends: Record<string, number>;
  profileScoreDistribution: Record<string, number>;
}

export const intelligenceService = {
  getCareerScore: async (): Promise<CareerScoreData> => {
    const res = await api.get('/api/v1/student/intelligence/career-score');
    return res.data.data;
  },

  getAtsScore: async (): Promise<AtsScoreData> => {
    const res = await api.get('/api/v1/student/intelligence/ats-score');
    return res.data.data;
  },

  analyzeAtsResume: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/api/v1/student/resumes/review', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  getSkillGap: async (): Promise<SkillGapData> => {
    const res = await api.get('/api/v1/student/intelligence/skill-gap');
    return res.data.data;
  },

  getRoadmap: async (): Promise<CareerRoadmapData> => {
    const res = await api.get('/api/v1/student/intelligence/roadmap');
    return res.data.data;
  },

  getEligibility: async (): Promise<EligibilityReportData> => {
    const res = await api.get('/api/v1/student/intelligence/eligibility');
    return res.data.data;
  },

  getProjectAnalysis: async (): Promise<ProjectAnalysisData> => {
    const res = await api.get('/api/v1/student/intelligence/project-analysis');
    return res.data.data;
  },

  getInsights: async (): Promise<ProfileInsightData> => {
    const res = await api.get('/api/v1/student/intelligence/insights');
    return res.data.data;
  },

  getRecommendations: async (): Promise<RecommendationData> => {
    const res = await api.get('/api/v1/student/intelligence/recommendations');
    return res.data.data;
  },

  getTrends: async (): Promise<TrendAnalyticsData> => {
    const res = await api.get('/api/v1/student/intelligence/trends');
    return res.data.data;
  }
};
