/**
 * Job Data Transformers
 * Transforms job form data to match backend API expectations
 */

export interface JobFormData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  niche?: string;
  location: string;
  remoteType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills?: string | string[];
  benefits?: string | string[];
  applicationDeadline?: string;
}

export interface BackendJobPayload {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  location: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  skills?: string[];
  benefits?: string;
  deadline?: string;
  slots?: number;
}

/**
 * Transform frontend form data to backend API payload
 */
export function transformJobFormToBackendPayload(formData: JobFormData): BackendJobPayload {
  // Convert remoteType to remote boolean
  const remote = formData.remoteType === 'REMOTE';

  // Convert skills to array if it's a string
  const skills = typeof formData.skills === 'string'
    ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    : formData.skills || [];

  // Convert benefits to string if it's an array
  const benefits = Array.isArray(formData.benefits)
    ? formData.benefits.join(', ')
    : formData.benefits || '';

  return {
    title: formData.title,
    description: formData.description,
    requirements: formData.requirements || formData.description,
    responsibilities: formData.responsibilities || formData.description,
    type: formData.employmentType,
    location: formData.location,
    remote,
    salaryMin: formData.salaryMin,
    salaryMax: formData.salaryMax,
    experienceLevel: formData.experienceLevel,
    skills,
    benefits,
    deadline: formData.applicationDeadline,
    slots: 1,
  };
}
