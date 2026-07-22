import api from '../api/axios';
import { FileMetadataData } from './fileService';

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
  uploadResume: async (file: File): Promise<ResumeData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/v1/student/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
