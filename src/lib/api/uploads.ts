/**
 * Uploads API Client
 * Handles all file upload operations
 */

import api from '../api';

// ============================================================================
// TYPES
// ============================================================================

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * POST /api/upload/resume - Upload candidate resume
 */
export async function uploadResume(file: File): Promise<UploadResponse> {
  try {
    console.log('[Uploads API] Uploading resume:', file.name);

    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post<UploadResponse>('/api/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[Uploads API] Resume uploaded successfully:', response.data.url);

    return response.data;
  } catch (error: any) {
    console.error('[Uploads API] Failed to upload resume:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/upload/resume - Delete candidate resume
 */
export async function deleteResume(): Promise<{ message: string }> {
  try {
    console.log('[Uploads API] Deleting resume...');

    const response = await api.delete<{ message: string }>('/api/upload/resume');

    console.log('[Uploads API] Resume deleted successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Uploads API] Failed to delete resume:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/upload/profile - Upload profile picture/avatar
 */
export async function uploadProfilePicture(file: File): Promise<UploadResponse> {
  try {
    console.log('[Uploads API] Uploading profile picture:', file.name);

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<UploadResponse>('/api/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[Uploads API] Profile picture uploaded successfully:', response.data.url);

    return response.data;
  } catch (error: any) {
    console.error('[Uploads API] Failed to upload profile picture:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/upload/profile - Delete profile picture
 */
export async function deleteProfilePicture(): Promise<{ message: string }> {
  try {
    console.log('[Uploads API] Deleting profile picture...');

    const response = await api.delete<{ message: string }>('/api/upload/profile');

    console.log('[Uploads API] Profile picture deleted successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Uploads API] Failed to delete profile picture:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/upload/company-logo - Upload company logo (employer)
 */
export async function uploadCompanyLogo(file: File): Promise<UploadResponse> {
  try {
    console.log('[Uploads API] Uploading company logo:', file.name);

    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post<UploadResponse>('/api/upload/company-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[Uploads API] Company logo uploaded successfully:', response.data.url);

    return response.data;
  } catch (error: any) {
    console.error('[Uploads API] Failed to upload company logo:', error.response?.data || error.message);
    throw error;
  }
}
