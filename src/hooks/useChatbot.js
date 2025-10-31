// src/hooks/useChatbot.js
import { useState, useCallback } from 'react';

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((text, isBot = false) => {
    const message = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (input) => {
    setIsLoading(true);
    addMessage(input, false);
    
    try {
      const response = await generateAIResponse(input);
      addMessage(response, true);
    } catch (error) {
      addMessage("Sorry, I'm having trouble responding. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage
  };
};