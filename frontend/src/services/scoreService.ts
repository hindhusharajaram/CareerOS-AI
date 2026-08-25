import api from '../api/axios';

export interface CareerScoreData {
  overallScore: number;
  tier: string;
  profileCompletenessPercentage: number;
  atsReadinessPercentage: number;
  skillsCount: number;
  projectsCount: number;
  experienceCount: number;
  certificatesCount: number;
  educationCount: number;
  categoryScores: Record<string, number>;
  categoryWeights: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  lastCalculated?: string;
}

export const scoreService = {
  getCareerScore: async (): Promise<CareerScoreData> => {
    try {
      const res = await api.get('/api/v1/student/intelligence/career-score');
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Fallback if offline
    }
    return {
      overallScore: 160,
      tier: 'BEGINNER',
      profileCompletenessPercentage: 20,
      atsReadinessPercentage: 0,
      skillsCount: 0,
      projectsCount: 0,
      experienceCount: 0,
      certificatesCount: 0,
      educationCount: 1,
      categoryScores: {
        'Profile Completeness': 30,
        'Projects': 0,
        'Skills Matrix': 0,
        'Experience': 0,
        'Education': 100,
        'Certificates': 0,
        'Resume Quality': 0,
        'GitHub Presence': 30,
        'LinkedIn Presence': 0,
      },
      categoryWeights: {
        'Profile Completeness': '15%',
        'Projects': '20%',
        'Skills Matrix': '20%',
        'Experience': '15%',
        'Education': '10%',
        'Certificates': '10%',
        'Resume Quality': '5%',
        'GitHub Presence': '3%',
        'LinkedIn Presence': '2%',
      },
      strengths: [],
      weaknesses: ['Limited project exposure', 'Underpopulated skill matrix'],
      improvementAreas: ['Build at least 2 full-stack projects', 'Add core technical skills to profile'],
      lastCalculated: new Date().toISOString(),
    };
  },
};
