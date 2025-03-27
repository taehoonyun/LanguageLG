import { client } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, ChatResponse, CharacterNamesResponse } from '@/api/types';

export const aiService = {
  getCharacterNames: async (): Promise<ApiResponse<CharacterNamesResponse>> => {
    const response = await client.get(API_ENDPOINTS.UTIL.GET_CHARACTERS);
    return response.data;
  },

  sendMessage: async (message: string): Promise<ApiResponse<ChatResponse>> => {
    const response = await client.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
      params: { messages: message },
    });
    return response.data;
  },

  resetHistory: async (): Promise<ApiResponse> => {
    const response = await client.post(API_ENDPOINTS.CHAT.RESET_HISTORY);
    return response.data;
  },
}; 