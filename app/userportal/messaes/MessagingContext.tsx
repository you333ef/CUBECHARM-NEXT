'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AuthContext from '../../providers/AuthContext';
import { MessagingService, MessageDto } from './services/MessagingServices';
import api from '@/app/AuthLayout/refresh';
import { getToken, refreshToken } from '@/app/AuthLayout/Token_Manager';

type MessageListener = (message: MessageDto) => void;

interface MessagingContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  lastIncomingMessage: MessageDto | null;
  messagingService: MessagingService | null;
  isServiceReady: boolean;
  subscribeToMessages: (listener: MessageListener) => () => void;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastIncomingMessage, setLastIncomingMessage] = useState<MessageDto | null>(null);
  const [isServiceReady, setIsServiceReady] = useState(false);
  const { baseUrl, user } = useContext(AuthContext)!;
  const serviceRef = useRef<MessagingService | null>(null);
  const listenersRef = useRef<Set<MessageListener>>(new Set());

  const subscribeToMessages = useCallback((listener: MessageListener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!baseUrl) return;
    const token = await getToken();
    if (!token) return;
    try {
      const response = await api.get(`/messaging/conversations/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data?.data?.totalUnread || 0);
    } catch {
      setUnreadCount(0);
    }
  }, [baseUrl]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  useEffect(() => {
    if (!baseUrl || !user?.sub) return;

    const initService = async () => {
      const token = await refreshToken();
      if (!token) return;
      const service = new MessagingService(token, baseUrl, user.sub);
      serviceRef.current = service;
      setIsServiceReady(true);

      service.connectToMessageStream();

      service.onConnected = () => {
        console.log('MessagingContext Global SSE connected');
      };

      service.onMessageReceived = (message: MessageDto) => {
        listenersRef.current.forEach(listener => listener(message));
        if (message.senderId !== user.sub) {
          setLastIncomingMessage(message);
          setUnreadCount(prev => prev + 1);
          refreshUnreadCount();
        }
      };

      service.onConnectionFailed = () => {
        console.error('MessagingContext Global SSE connection failed');
      };
    };

    initService();

    return () => {
      serviceRef.current?.disconnect();
      serviceRef.current = null;
      setIsServiceReady(false);
    };
  }, [baseUrl, user?.sub, refreshUnreadCount]);

  return (
    <MessagingContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        lastIncomingMessage,
        messagingService: serviceRef.current,
        isServiceReady,
        subscribeToMessages,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessagingContext() {
  const context = useContext(MessagingContext);
  if (!context) throw new Error('useMessagingContext must be used within MessagingProvider');
  return context;
}