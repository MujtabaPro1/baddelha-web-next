import axiosInstance from './axiosInstance';

export interface ProfileResponse {
  data: {
    id?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    avatar?: string;
  };
  success: boolean;
  message: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>('/api/1.0/customer/profile');
  return response.data;
};

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileResponse> => {
  const response = await axiosInstance.put<ProfileResponse>('/api/1.0/customer/profile', payload);
  return response.data;
};
