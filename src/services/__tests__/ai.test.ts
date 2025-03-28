import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiError, ErrorType } from '@/api/types';
import { aiService } from '../ai';

// Mock the API client
jest.mock('@/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCharacterNames', () => {
    it('should fetch character names successfully', async () => {
      const mockResponse = {
        data: {
          result: true,
          data: ['Character1', 'Character2'],
          timestamp: '2024-03-28T00:00:00.000Z'
        }
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await aiService.getCharacterNames();

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.UTIL.GET_CHARACTERS);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network Error');
      (apiClient.get as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(aiService.getCharacterNames()).rejects.toThrow('Network Error');
    });
  });

  describe('sendMessage', () => {
    const successResponse = {
      data: {
        result: true,
        data: {
          response: 'Hello!',
          error: null
        },
        timestamp: '2024-03-28T00:00:00.000Z'
      }
    };

    it('should send message successfully with character name', async () => {
      const params = {
        message: 'Hi',
        characterName: 'Character1'
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce(successResponse);

      const result = await aiService.sendMessage(params);

      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.CHAT.SEND_MESSAGE,
        params
      );
      expect(result).toEqual(successResponse.data);
    });

    it('should send message successfully without character name', async () => {
      const params = {
        message: 'Hi'
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce(successResponse);

      const result = await aiService.sendMessage(params);

      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.CHAT.SEND_MESSAGE,
        params
      );
      expect(result).toEqual(successResponse.data);
    });

    it('should handle error response', async () => {
      const params = {
        message: 'Hi'
      };

      const errorResponse = {
        response: {
          status: 400,
          data: {
            result: false,
            data: 'Invalid message format',
            timestamp: '2024-03-28T00:00:00.000Z'
          }
        }
      };

      (apiClient.post as jest.Mock).mockRejectedValueOnce(errorResponse);

      await expect(aiService.sendMessage(params)).rejects.toThrow();
    });
  });

  describe('resetHistory', () => {
    it('should reset chat history successfully', async () => {
      const mockResponse = {
        data: {
          result: true,
          data: {
            success: true,
            message: 'Chat history cleared successfully'
          },
          timestamp: '2024-03-28T00:00:00.000Z'
        }
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await aiService.resetHistory();

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.CHAT.RESET_HISTORY);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle reset history failure', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: {
            result: false,
            data: 'Internal server error',
            timestamp: '2024-03-28T00:00:00.000Z'
          }
        }
      };

      (apiClient.post as jest.Mock).mockRejectedValueOnce(errorResponse);

      await expect(aiService.resetHistory()).rejects.toThrow();
    });
  });
}); 