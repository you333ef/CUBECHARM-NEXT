import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { MessageDto, SendMessageRequest } from './services/MessagingServices';
import AuthContext from '../../providers/AuthContext';
import { useMessagingContext } from './MessagingContext';

export function useMessaging(
  conversationId?: number,
  onAnyMessage?: (message: MessageDto) => void
) {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const { user } = useContext(AuthContext)!;
  const { messagingService, isServiceReady, subscribeToMessages } = useMessagingContext();
  const conversationIdRef = useRef(conversationId);
  const onAnyMessageRef = useRef(onAnyMessage);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    onAnyMessageRef.current = onAnyMessage;
  }, [onAnyMessage]);

  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  // Subscribe to the global SSE stream
  useEffect(() => {
    const unsubscribe = subscribeToMessages((message: MessageDto) => {
      onAnyMessageRef.current?.(message);

      const activeConvId = conversationIdRef.current;
      if (activeConvId && message.conversationId === activeConvId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return unsubscribe;
  }, [subscribeToMessages]);

  const sendMessage = async (request: SendMessageRequest) => {
    if (!messagingService) {
      throw new Error('Messaging service not initialized');
    }

    const sentMessage = await messagingService.sendMessage(request);
    setMessages(prev => [...prev, sentMessage]);
    return sentMessage;
  };

  const checkOnlineStatus = async (userId: string) => {
    if (!messagingService) {
      throw new Error('Messaging service not initialized');
    }

    return await messagingService.isUserOnline(userId);
  };

  const markConversationAsRead = async (convId: number) => {
    if (!messagingService) return null;
    return await messagingService.markConversationAsRead(convId);
  };

  return {
    messages,
    sendMessage,
    isConnected: isServiceReady,
    checkOnlineStatus,
    markConversationAsRead,
    isServiceReady,
  };
}