import { AxiosError } from 'axios';
import { ApiResponse } from '@/api/types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: AxiosError<ApiResponse>): never => {
  if (error.response) {
    const { status, data } = error.response;
    throw new ApiError(
      status,
      data.error || 'An error occurred',
      data
    );
  }
  
  if (error.request) {
    throw new ApiError(
      0,
      'Network error occurred'
    );
  }
  
  throw new ApiError(
    0,
    error.message || 'An unexpected error occurred'
  );
}; 