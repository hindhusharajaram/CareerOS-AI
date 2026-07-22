import api from '../api/axios';

export interface StudentProfileData {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  profilePhoto?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  state?: string;
  country?: string;
  universityName?: string;
  degree?: string;
  major?: string;
  branch?: string;
  gpa?: number;
  graduationYear?: number;
  currentSemester?: number;
  about?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface SkillItem {
  id?: string;
  skillName: string;
  category?: string;
  icon?: string;
}

export interface StudentSkillItem {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  category: string;
  icon: string;
  proficiency: string;
  yearsOfExperience: number;
}

export interface EducationItem {
  id?: string;
  studentId?: string;
  institution: string;
  degree: string;
  specialization?: string;
  startYear: number;
  endYear?: number;
  cgpa?: number;
}

export interface ProjectItem {
  id?: string;
  studentId?: string;
  title: string;
  description: string;
  technologies?: string;
  githubLink?: string;
  liveLink?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificateItem {
  id?: string;
  studentId?: string;
  title: string;
  provider: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface ExperienceItem {
  id?: string;
  studentId?: string;
  company: string;
  role: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CareerGoalData {
  id?: string;
  studentId?: string;
  preferredRole?: string;
  preferredDomain?: string;
  preferredLocation?: string;
  expectedSalary?: number;
  higherStudies?: boolean;
  targetCompanies?: string;
  workMode?: string;
}

export interface DashboardSummaryData {
  profile: StudentProfileData;
  completionPercentage: number;
  completionBreakdown: Record<string, number>;
  skillsCount: number;
  educationCount: number;
  projectsCount: number;
  certificatesCount: number;
  experienceCount: number;
  careerGoal: CareerGoalData | null;
  recentActivity: string[];
}

export const studentService = {
  getDashboard: async (): Promise<DashboardSummaryData> => {
    const response = await api.get('/api/v1/student/dashboard');
    return response.data.data;
  },

  getProfile: async (): Promise<StudentProfileData> => {
    const response = await api.get('/api/v1/student/profile');
    return response.data.data;
  },

  updateProfile: async (data: StudentProfileData): Promise<StudentProfileData> => {
    const response = await api.put('/api/v1/student/profile', data);
    return response.data.data;
  },

  getAvailableSkills: async (): Promise<SkillItem[]> => {
    const response = await api.get('/api/v1/student/available-skills');
    return response.data.data;
  },

  getStudentSkills: async (): Promise<StudentSkillItem[]> => {
    const response = await api.get('/api/v1/student/skills');
    return response.data.data;
  },

  addStudentSkill: async (skillName: string, proficiency: string, category = 'General', yearsOfExperience = 1): Promise<StudentSkillItem> => {
    const response = await api.post('/api/v1/student/skills', { skillName, proficiency, category, yearsOfExperience });
    return response.data.data;
  },

  removeStudentSkill: async (skillId: string): Promise<void> => {
    await api.delete(`/api/v1/student/skills/${skillId}`);
  },

  getEducation: async (): Promise<EducationItem[]> => {
    const response = await api.get('/api/v1/student/education');
    return response.data.data;
  },

  addEducation: async (data: EducationItem): Promise<EducationItem> => {
    const response = await api.post('/api/v1/student/education', data);
    return response.data.data;
  },

  updateEducation: async (id: string, data: EducationItem): Promise<EducationItem> => {
    const response = await api.put(`/api/v1/student/education/${id}`, data);
    return response.data.data;
  },

  deleteEducation: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/student/education/${id}`);
  },

  getProjects: async (): Promise<ProjectItem[]> => {
    const response = await api.get('/api/v1/student/projects');
    return response.data.data;
  },

  addProject: async (data: ProjectItem): Promise<ProjectItem> => {
    const response = await api.post('/api/v1/student/projects', data);
    return response.data.data;
  },

  updateProject: async (id: string, data: ProjectItem): Promise<ProjectItem> => {
    const response = await api.put(`/api/v1/student/projects/${id}`, data);
    return response.data.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/student/projects/${id}`);
  },

  getCertificates: async (): Promise<CertificateItem[]> => {
    const response = await api.get('/api/v1/student/certificates');
    return response.data.data;
  },

  addCertificate: async (data: CertificateItem): Promise<CertificateItem> => {
    const response = await api.post('/api/v1/student/certificates', data);
    return response.data.data;
  },

  updateCertificate: async (id: string, data: CertificateItem): Promise<CertificateItem> => {
    const response = await api.put(`/api/v1/student/certificates/${id}`, data);
    return response.data.data;
  },

  deleteCertificate: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/student/certificates/${id}`);
  },

  getExperience: async (): Promise<ExperienceItem[]> => {
    const response = await api.get('/api/v1/student/experience');
    return response.data.data;
  },

  addExperience: async (data: ExperienceItem): Promise<ExperienceItem> => {
    const response = await api.post('/api/v1/student/experience', data);
    return response.data.data;
  },

  updateExperience: async (id: string, data: ExperienceItem): Promise<ExperienceItem> => {
    const response = await api.put(`/api/v1/student/experience/${id}`, data);
    return response.data.data;
  },

  deleteExperience: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/student/experience/${id}`);
  },

  getCareerGoal: async (): Promise<CareerGoalData> => {
    const response = await api.get('/api/v1/student/career-goals');
    return response.data.data;
  },

  updateCareerGoal: async (data: CareerGoalData): Promise<CareerGoalData> => {
    const response = await api.put('/api/v1/student/career-goals', data);
    return response.data.data;
  }
};
