/**
 * Profile API Client
 * Handles work experience, education, and file uploads
 */

import api from '../api';

// ============================================================================
// TYPES
// ============================================================================

export interface WorkExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
  location?: string | null;
}

export interface Education {
  id: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  gpa?: number | null;
  description?: string | null;
}

// ============================================================================
// WORK EXPERIENCE API
// ============================================================================

export async function getWorkExperiences(): Promise<{ workExperiences: WorkExperience[] }> {
  const response = await api.get('/api/candidates/work-experience');
  return response.data;
}

export async function createWorkExperience(data: Omit<WorkExperience, 'id'>): Promise<{ workExperience: WorkExperience }> {
  const response = await api.post('/api/candidates/work-experience', data);
  return response.data;
}

export async function updateWorkExperience(id: string, data: Partial<WorkExperience>): Promise<{ workExperience: WorkExperience }> {
  const response = await api.patch(`/api/candidates/work-experience/${id}`, data);
  return response.data;
}

export async function deleteWorkExperience(id: string): Promise<{ message: string }> {
  const response = await api.delete(`/api/candidates/work-experience/${id}`);
  return response.data;
}

// ============================================================================
// EDUCATION API
// ============================================================================

export async function getEducationEntries(): Promise<{ educationEntries: Education[] }> {
  const response = await api.get('/api/candidates/education');
  return response.data;
}

export async function createEducation(data: Omit<Education, 'id'>): Promise<{ education: Education }> {
  const response = await api.post('/api/candidates/education', data);
  return response.data;
}

export async function updateEducation(id: string, data: Partial<Education>): Promise<{ education: Education }> {
  const response = await api.patch(`/api/candidates/education/${id}`, data);
  return response.data;
}

export async function deleteEducation(id: string): Promise<{ message: string }> {
  const response = await api.delete(`/api/candidates/education/${id}`);
  return response.data;
}

// ============================================================================
// PROFILE API
// ============================================================================

export async function getProfile(): Promise<any> {
  const response = await api.get('/api/candidates/profile');
  return response.data;
}

export async function updateProfile(data: any): Promise<any> {
  const response = await api.patch('/api/candidates/profile', data);
  return response.data;
}

// ============================================================================
// FILE UPLOAD API
// ============================================================================

export async function uploadFile(file: File, type: 'resume' | 'photo'): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post('/api/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
