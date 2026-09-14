import axiosInstance from './axiosInstance';

export interface CareerDepartment {
  id: number;
  name: string;
  nameAr?: string | null;
  isActive: boolean;
}

export interface CareerRole {
  id: number;
  departmentId: number;
  name: string;
  nameAr?: string | null;
  isActive: boolean;
}

export interface CareerJob {
  id: number;
  departmentId: number;
  roleId: number;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  location?: string | null;
  employmentType?: string | null;
  isActive: boolean;
  createdAt: string;
  department?: CareerDepartment;
  role?: CareerRole;
}

export const fetchCareerDepartments = async (): Promise<CareerDepartment[]> => {
  const response = await axiosInstance.get('/api/1.0/career/departments');
  return response?.data?.data || response?.data || [];
};

export const fetchCareerJobs = async (departmentId?: number): Promise<CareerJob[]> => {
  const response = await axiosInstance.get('/api/1.0/career/jobs', {
    params: {
      isActive: true,
      ...(departmentId ? { departmentId } : {}),
    },
  });
  return response?.data?.data || response?.data || [];
};

export const fetchCareerJob = async (id: number): Promise<CareerJob> => {
  const response = await axiosInstance.get(`/api/1.0/career/jobs/${id}`);
  return response?.data?.data || response?.data;
};
