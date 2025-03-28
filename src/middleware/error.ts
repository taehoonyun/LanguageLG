/**
 * Error handling middleware for API requests
 */
import { AxiosError } from 'axios';
import { 
  ApiResponse, 
  ApiError, 
  ErrorType, 
  getErrorType, 
  getDefaultErrorMessage 
} from '@/api/types';

export const handleApiError = (error: AxiosError<ApiResponse<unknown>>): never => {
  if (error.response) {
    const { status, data } = error.response;
    const errorType = getErrorType(status);
    const message = data.result === false 
      ? data.data?.toString() || getDefaultErrorMessage(errorType)
      : getDefaultErrorMessage(errorType);
    
    throw new ApiError(
      errorType,
      status,
      message,
      new Date().toISOString(),
      data
    );
  }
  
  if (error.request) {
    throw new ApiError(
      ErrorType.NETWORK,
      0,
      'Unable to connect to the server. Please check your internet connection.',
      new Date().toISOString(),
      error.request
    );
  }
  
  throw new ApiError(
    ErrorType.API,
    0,
    error.message || 'An unexpected error occurred',
    new Date().toISOString(),
    error
  );
}; 