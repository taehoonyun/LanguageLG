import { useState } from 'react';
import { aiService } from '@/services/ai';
import { ChatResponse } from '@/api/types';

export const useChat = () => {
  const [response, setResponse] = useState<ChatResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiService.sendMessage(message);
      if (data.result) {
        setResponse(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setResponse({
        Response: null,
        Error: 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiService.resetHistory();
      if (data.result) {
        setResponse(undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset history');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    response,
    isLoading,
    error,
    sendMessage,
    resetHistory,
  };
}; 