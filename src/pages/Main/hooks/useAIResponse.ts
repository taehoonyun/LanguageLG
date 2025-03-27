import { useState } from 'react';
import { getAIResponse, postAIResponse, getCharacterNames } from '@/api';
import { AIResponse, CharacterNames } from '../types';
import { ERROR_MESSAGE } from '../constants';

export const useAIResponse = () => {
  const [nameList, setNameList] = useState<string[]>([""]);
  const [response, setResponse] = useState<AIResponse["data"]>();

  const loadCharacterNames = async () => {
    try {
      const names = await getCharacterNames();
      setNameList(names.data);
    } catch (error) {
      console.error("Failed to load character names:", error);
    }
  };

  const sendMessage = async (prompt: string) => {
    try {
      const data = await getAIResponse(prompt);
      if (data.result) {
        setResponse(data.data);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setResponse({
        Response: null,
        Error: ERROR_MESSAGE
      });
    }
  };

  const quitConversation = async () => {
    try {
      await postAIResponse();
    } catch (error) {
      console.error("Failed to quit conversation:", error);
    }
  };

  return {
    nameList,
    response,
    loadCharacterNames,
    sendMessage,
    quitConversation
  };
}; 