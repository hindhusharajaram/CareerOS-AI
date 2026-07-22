import api from '../api/axios';

export interface FileMetadataData {
  id: string;
  studentId: string;
  fileName: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  uploadType: string;
  createdAt: string;
}

export const fileService = {
  uploadFile: async (file: File, uploadType = 'GENERAL'): Promise<FileMetadataData> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', uploadType);

    const response = await api.post('/api/v1/student/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  listFiles: async (): Promise<FileMetadataData[]> => {
    const response = await api.get('/api/v1/student/files');
    return response.data.data;
  },

  getDownloadUrl: (fileId: string): string => {
    return `${api.defaults.baseURL || 'http://localhost:8080'}/api/v1/student/files/${fileId}/download`;
  }
};
