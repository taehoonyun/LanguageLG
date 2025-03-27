import { client } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, LoginResponse } from '@/api/types';

export const authService = {
  login: async (username: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await client.post(API_ENDPOINTS.AUTH.LOGIN, {
      params: { userId: username },
    });
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await client.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
}; 