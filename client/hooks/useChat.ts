import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ChatSession, ChatMessage, ChatState } from '../types/chat';
import { useWaku } from './useWaku';
import { WakuMessage } from '../types/waku';

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  messages: {},
};

export const useChat = () => {
  const [chatState, setChatState] = useLocalStorage<ChatState>('chat-state', initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, isConnecting, error, initializeWaku, sendWakuMessage, subscribeToResponses } = useWaku();

  const createNewSession = useCallback(() => {
    const sessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: sessionId,
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChatState(prevState => ({
      ...prevState,
      sessions: [newSession, ...prevState.sessions],
      currentSessionId: sessionId,
      messages: {
        ...prevState.messages,
        [sessionId]: [],
      },
    }));

    return sessionId;
  }, [setChatState]);

  const selectSession = useCallback((sessionId: string) => {
    setChatState(prevState => ({
      ...prevState,
      currentSessionId: sessionId,
    }));
  }, [setChatState]);

  const deleteSession = useCallback((sessionId: string) => {
    setChatState(prevState => {
      const newSessions = prevState.sessions.filter(session => session.id !== sessionId);
      const newMessages = { ...prevState.messages };
      delete newMessages[sessionId];
      
      const newCurrentSessionId = prevState.currentSessionId === sessionId 
        ? (newSessions[0]?.id || null) 
        : prevState.currentSessionId;

      return {
        sessions: newSessions,
        currentSessionId: newCurrentSessionId,
        messages: newMessages,
      };
    });
  }, [setChatState]);

  // Initialize Waku when component mounts
  useEffect(() => {
    initializeWaku();
  }, [initializeWaku]);

  // Subscribe to Waku responses when connected
  useEffect(() => {
    if (isConnected) {
      subscribeToResponses((wakuMessage: WakuMessage) => {
        // Convert Waku message to chat message
        const assistantMessage: ChatMessage = {
          id: wakuMessage.messageId,
          sessionId: wakuMessage.sessionId,
          content: wakuMessage.content,
          role: 'assistant',
          timestamp: wakuMessage.timestamp,
        };

        // Add response to the appropriate session
        setChatState(prevState => {
          const currentSessionMessages = prevState.messages[wakuMessage.sessionId] || [];
          return {
            ...prevState,
            messages: {
              ...prevState.messages,
              [wakuMessage.sessionId]: [...currentSessionMessages, assistantMessage],
            },
          };
        });

        setIsLoading(false);
      });
    }
  }, [isConnected, subscribeToResponses, setChatState]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatState.currentSessionId || !content.trim()) return;

    const sessionId = chatState.currentSessionId;
    const userMessageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMessageId,
      sessionId,
      content: content.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message and update session title if needed
    setChatState(prevState => {
      const sessionMessages = prevState.messages[sessionId] || [];
      const isFirstMessage = sessionMessages.length === 0;
      
      let updatedSessions = prevState.sessions;
      if (isFirstMessage) {
        const sessionTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        updatedSessions = prevState.sessions.map(session =>
          session.id === sessionId
            ? { ...session, title: sessionTitle, updatedAt: new Date().toISOString() }
            : session
        );
      }

      return {
        ...prevState,
        sessions: updatedSessions,
        messages: {
          ...prevState.messages,
          [sessionId]: [...sessionMessages, userMessage],
        },
      };
    });

    setIsLoading(true);

    if (isConnected) {
      // Send via Waku
      const wakuMessage: WakuMessage = {
        sessionId,
        messageId: userMessageId,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        type: 'request',
      };

      const success = await sendWakuMessage(wakuMessage);
      
      if (!success) {
        // Fallback to simulated response if Waku fails
        console.log('Waku send failed, falling back to simulation');
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sessionId,
            content: "Sorry, I couldn't send your message via Waku. This is a simulated response.",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          setChatState(prevState => {
            const currentSessionMessages = prevState.messages[sessionId] || [];
            return {
              ...prevState,
              messages: {
                ...prevState.messages,
                [sessionId]: [...currentSessionMessages, assistantMessage],
              },
            };
          });
          setIsLoading(false);
        }, 1000);
      }
    } else {
      // Fallback when not connected to Waku
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sessionId,
          content: "Waku network not connected. This is a simulated response. Please check your connection.",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        setChatState(prevState => {
          const currentSessionMessages = prevState.messages[sessionId] || [];
          return {
            ...prevState,
            messages: {
              ...prevState.messages,
              [sessionId]: [...currentSessionMessages, assistantMessage],
            },
          };
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [chatState.currentSessionId, setChatState, isConnected, sendWakuMessage]);

  const currentSession = chatState.sessions.find(session => session.id === chatState.currentSessionId);
  const currentMessages = chatState.currentSessionId ? chatState.messages[chatState.currentSessionId] || [] : [];

  // Test function to simulate Waku response
  const testWakuResponse = useCallback(() => {
    if (!chatState.currentSessionId) return;

    const sessionId = chatState.currentSessionId;
    const testMessage: WakuMessage = {
      sessionId,
      messageId: Date.now().toString(),
      content: "This is a test response from the Waku network! The decentralized messaging is working correctly.",
      timestamp: new Date().toISOString(),
      type: 'response',
    };

    // Simulate the response callback
    const assistantMessage: ChatMessage = {
      id: testMessage.messageId,
      sessionId: testMessage.sessionId,
      content: testMessage.content,
      role: 'assistant',
      timestamp: testMessage.timestamp,
    };

    setChatState(prevState => {
      const currentSessionMessages = prevState.messages[sessionId] || [];
      return {
        ...prevState,
        messages: {
          ...prevState.messages,
          [sessionId]: [...currentSessionMessages, assistantMessage],
        },
      };
    });
  }, [chatState.currentSessionId, setChatState]);

  // Function to send custom Waku response (for testing)
  const sendWakuResponse = useCallback((wakuMessage: WakuMessage) => {
    console.log('📥 Manual Waku response sent:', wakuMessage);
    
    const assistantMessage: ChatMessage = {
      id: wakuMessage.messageId,
      sessionId: wakuMessage.sessionId,
      content: wakuMessage.content,
      role: 'assistant',
      timestamp: wakuMessage.timestamp,
    };

    setChatState(prevState => {
      const currentSessionMessages = prevState.messages[wakuMessage.sessionId] || [];
      return {
        ...prevState,
        messages: {
          ...prevState.messages,
          [wakuMessage.sessionId]: [...currentSessionMessages, assistantMessage],
        },
      };
    });
  }, [setChatState]);

  return {
    sessions: chatState.sessions,
    currentSession,
    currentMessages,
    isLoading,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    testWakuResponse,
    sendWakuResponse,
    // Waku status
    wakuConnected: isConnected,
    wakuConnecting: isConnecting,
    wakuError: error,
  };
}; 