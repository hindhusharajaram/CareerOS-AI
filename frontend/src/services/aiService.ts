import api from '../api/axios';

export interface AICopilotExplanation {
  topic: string;
  explanationText: string;
  keyTakeaways: string[];
  immediateActionItems: string[];
  groundedContextSummary: string;
}

export interface AIResumeReview {
  professionalSummary: string;
  improvementSuggestions: string[];
  missingSections: string[];
  actionItems: string[];
  strongBulletPointSuggestions: string[];
  atsOptimizationAdvice: string[];
}

export interface StudyDay {
  day: string;
  topic: string;
  activity: string;
  durationMinutes: number;
}

export interface AILearningPlan {
  targetRole: string;
  technologySequence: string[];
  weeklyPlan: StudyDay[];
  recommendedResources: string[];
  difficultyProgression: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  questionText: string;
  expectedAnswerKeyPoints: string;
  followUpQuestions: string[];
}

export interface AIMockInterview {
  targetRole: string;
  difficultyLevel: string;
  questions: InterviewQuestion[];
  evaluationRubric: string[];
}

export interface AIProjectAdvice {
  projectId: string;
  projectTitle: string;
  architectureImprovements: string[];
  technologyUpgrades: string[];
  cloudImprovements: string[];
  securityImprovements: string[];
  databaseImprovements: string[];
  scalabilityImprovements: string[];
  deploymentImprovements: string[];
}

export interface AIChatMessage {
  id: string;
  sessionId: string;
  senderRole: string;
  messageText: string;
  createdAt: string;
}

export const aiService = {
  explainTopic: async (topic = 'CAREER_SCORE'): Promise<AICopilotExplanation> => {
    const res = await api.get('/api/v1/student/ai/copilot/explain', { params: { topic } });
    return res.data.data;
  },

  reviewResume: async (): Promise<AIResumeReview> => {
    const res = await api.post('/api/v1/student/ai/resume/review');
    return res.data.data;
  },

  generateLearningPlan: async (targetRole = 'Software Engineer'): Promise<AILearningPlan> => {
    const res = await api.post('/api/v1/student/ai/coaching/plan', null, { params: { targetRole } });
    return res.data.data;
  },

  generateMockInterview: async (targetRole = 'Software Engineer', difficulty = 'INTERMEDIATE'): Promise<AIMockInterview> => {
    const res = await api.post('/api/v1/student/ai/interview/generate', null, { params: { targetRole, difficulty } });
    return res.data.data;
  },

  analyzeProject: async (title = 'Full-Stack Web App', techStack = 'React, Java'): Promise<AIProjectAdvice> => {
    const res = await api.post('/api/v1/student/ai/project/analyze', null, { params: { title, techStack } });
    return res.data.data;
  },

  getChatMessages: async (): Promise<AIChatMessage[]> => {
    const res = await api.get('/api/v1/student/ai/chat/messages');
    return res.data.data;
  },

  sendChatMessage: async (messageText: string): Promise<AIChatMessage> => {
    const res = await api.post('/api/v1/student/ai/chat/send', null, { params: { messageText } });
    return res.data.data;
  }
};
