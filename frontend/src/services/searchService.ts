import api from '../api/axios';
import { StudentSkillItem, ProjectItem, CertificateItem, ExperienceItem, EducationItem } from './studentService';

export interface SearchResultData {
  query: string;
  matchingSkills: StudentSkillItem[];
  matchingProjects: ProjectItem[];
  matchingCertificates: CertificateItem[];
  matchingExperience: ExperienceItem[];
  matchingEducation: EducationItem[];
}

export const searchService = {
  search: async (query: string): Promise<SearchResultData> => {
    const response = await api.get('/api/v1/student/search', { params: { query } });
    return response.data.data;
  }
};
