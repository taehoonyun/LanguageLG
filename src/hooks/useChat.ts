import { useState } from 'react';
import { aiService } from '@/services/ai';
import { ChatResponse } from '@/api/types';

export const useChat = (userId: string) => {
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const talkToFriend = async (friendId: string, messages: any[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiService.talkToFriend({ userId, friendId, messages });
      if (result.result) {
        setResponse(result.data);
      } else {
        setError(result.data.Error);
      }
    } catch (error) {
      setError("Failed to start conversation");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiService.sendMessage({ message, userId });
      if (result.result) {
        setResponse(result.data);
      } else {
        setError(result.data.Error);
      }
    } catch (error) {
      setError("Failed to send message");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await aiService.resetHistory(userId);
      setResponse(null);
    } catch (error) {
      setError("Failed to reset chat history");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const quitChat = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await aiService.quitChat(userId);
      setResponse(null);
    } catch (error) {
      setError("Failed to end chat");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    response,
    isLoading,
    error,
    talkToFriend,
    sendMessage,
    resetHistory,
    quitChat,
  };
}; 