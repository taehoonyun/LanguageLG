import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { 
  ApiResponse, 
  ChatResponse, 
  CharacterNamesResponse,
  CharacterDetails,
  ResetHistoryResponse 
} from '@/api/types';

export interface SendMessageParams {
  message: string;
  userId: string;
}

export interface TalkToFriendParams {
  userId: string;
  friendId: string;
  messages: any[];
}

export const aiService = {
  getCharacterNames: async (): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get<ApiResponse<string[]>>(API_ENDPOINTS.UTIL.GET_CHARACTERS);
    return response.data;
  },

  getCharacterByName: async (name: string): Promise<ApiResponse<CharacterDetails>> => {
    const response = await apiClient.get<ApiResponse<CharacterDetails>>(API_ENDPOINTS.UTIL.GET_CHARACTER(name));
    return response.data;
  },

  talkToFriend: async ({ userId, friendId, messages }: TalkToFriendParams): Promise<ApiResponse<ChatResponse>> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>(API_ENDPOINTS.CHAT.TALK_TO_FRIEND, {
      userId,
      friendId,
      messages,
    });
    return response.data;
  },

  sendMessage: async ({ message, userId }: SendMessageParams): Promise<ApiResponse<ChatResponse>> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
      messages: message,
      userId,
    });
    return response.data;
  },

  resetHistory: async (userId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CHAT.RESET_HISTORY, { userId });
  },

  quitChat: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(API_ENDPOINTS.CHAT.QUIT, {
      userId,
    });
    return response.data;
  },
}; 