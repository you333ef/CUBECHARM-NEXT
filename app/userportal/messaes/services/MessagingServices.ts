import api from "@/app/AuthLayout/refresh";
import { getToken, refreshToken } from "../../../AuthLayout/Token_Manager";

export interface MessageDto {
  messageId: string | number;
  id?: string | number;
  conversationId: number;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: "Text" | "Image" | "File";
  sentAt: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  recipientId: string;
  conversationId?: number;
  messageType: "Text" | "Image" | "File";
  content: string;
}

export interface OnlineStatus {
  isOnline: boolean;
  connectionCount: number;
}

export class MessagingService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private token: string;
  private baseUrl: string;
  private userId: string;
  private authErrors = 0;
  private maxAuthErrors = 3;
  private abortController: AbortController | null = null;

  onMessageReceived?: (message: MessageDto) => void;
  onConnectionFailed?: () => void;
  onConnected?: () => void;

  constructor(token: string, baseUrl: string, userId: string) {
    this.token = token;
    this.baseUrl = baseUrl;
    this.userId = userId;
  }

  private async refreshAccessTokenIfNeeded(): Promise<string | null> {
    let token = await getToken();
   

  if (!token) {
    token = await refreshToken();
   
  }


    return token;
  }

  private unwrapIncomingMessagePayload(raw: any): any {
    return raw?.data?.message ?? raw?.data ?? raw?.message ?? raw;
  }

  private normalizeMessage(raw: any): MessageDto {
    return {
      messageId: raw.messageId ?? raw.MessageId ?? raw.messageID ?? raw.Id ?? raw.id,
      id: raw.id ?? raw.Id ?? raw.messageId ?? raw.MessageId,
      conversationId: raw.conversationId ?? raw.ConversationId,
      senderId: raw.senderId ?? raw.SenderId,
      recipientId: raw.recipientId ?? raw.RecipientId,
      content: raw.content ?? raw.Content,
      messageType: raw.messageType ?? raw.MessageType ?? "Text",
      sentAt: raw.sentAt ?? raw.SentAt ?? new Date().toISOString(),
      isRead: raw.isRead ?? raw.IsRead ?? false,
    };
  }

  private extractMessageId(rawMessage: any): string | undefined {
    const candidates = [
      rawMessage?.messageId,
      rawMessage?.messageID,
      rawMessage?.MessageId,
      rawMessage?.id,
      rawMessage?.Id,
    ];
    const found = candidates.find((v) => v !== undefined && v !== null && String(v).trim() !== "");
    return found !== undefined ? String(found) : undefined;
  }

  connectToMessageStream() {
    (async () => {
      this.disconnect();
      const accessToken = await this.refreshAccessTokenIfNeeded();
      if (!accessToken) {
        this.handleConnectionError(true);
        return;
      }
      const url = `${this.baseUrl}/messaging/stream`;
      this.abortController = new AbortController();
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        signal: this.abortController.signal,
      })
        .then(async (response) => {
          if (response.status === 401) {
            this.handleConnectionError(true);
            return;
          }
          if (!response.ok) {
            this.handleConnectionError();
            return;
          }
          const reader = response.body?.getReader();
          if (!reader) {
            this.handleConnectionError();
            return;
          }
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          let isClosed = false;
          const processChunk = (chunk: Uint8Array) => {
            buffer += decoder.decode(chunk, { stream: true });
            let lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? "";
            let eventName = "message";
            let data = "";
            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                const value = line.slice(5).trim();
                data = data ? data + "\n" + value : value;
              } else if (line.trim() === "") {
                if (data) {
                  this.dispatchSseEvent(eventName, data);
                  eventName = "message";
                  data = "";
                }
              }
            }
          };
          const read = (): Promise<void> =>
            reader.read().then(({ done, value }) => {
              if (done || isClosed) return;
              if (value) processChunk(value);
              return read();
            });
          try {
            await read();
          } catch (err: any) {
            if (err?.name === "AbortError") {
              isClosed = true;
              return;
            }
            this.handleConnectionError();
          }
        })
        .catch((error) => {
          if (error?.name === "AbortError") return;
          this.handleConnectionError();
        });
    })();
  }

  private dispatchSseEvent(eventName: string, data: string) {
    try {
      if (eventName === "connected") {
        const payload = JSON.parse(data);
        this.reconnectAttempts = 0;
        this.authErrors = 0;
        this.onConnected?.();
      } else if (eventName === "heartbeat") {
      } else if (eventName === "message") {
        const raw = JSON.parse(data);
        const unwrapped = this.unwrapIncomingMessagePayload(raw);
        const message = this.normalizeMessage(unwrapped);
        this.onMessageReceived?.(message);
        if (message.recipientId === this.userId) {
          const id = message.messageId;
          if (!id) return;
          this.markAsDelivered(id);
        }
      }
    } catch {}
  }

  async sendMessage(request: SendMessageRequest): Promise<MessageDto> {
    if (!request.conversationId) throw new Error("conversationId is required");
    const formData = new FormData();
    formData.append("recipientId", request.recipientId);
    formData.append("conversationId", request.conversationId.toString());
    formData.append("messageType", request.messageType);
    formData.append("content", request.content);
    const response = await api.post(
      `/messaging/conversations/${request.conversationId}/messages`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    const result = response.data;
    if (!result.success) throw new Error(result.message || "Failed to send message");
    return result.data;
  }

  async markAsDelivered(messageId: string | number): Promise<void> {
    if (!messageId || String(messageId) === "undefined") return;
    try {
      await api.patch(`/messaging/messages/${messageId}/mark-delivered`);
    } catch {}
  }

  async markConversationAsRead(conversationId: number): Promise<{ unreadCountBefore: number; unreadCountAfter: number } | null> {
    try {
      const response = await api.patch(`/messaging/conversations/${conversationId}/mark-read`);
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  }

  async isUserOnline(userId: string): Promise<OnlineStatus> {
    try {
      const response = await api.get(`/messaging/online-status/${userId}`);
      return response.data?.data ?? { isOnline: false, connectionCount: 0 };
    } catch {
      return { isOnline: false, connectionCount: 0 };
    }
  }

 private async handleConnectionError(isAuthError: boolean = false) {
  if (isAuthError) {
    this.authErrors++;

    
    if (this.authErrors >= this.maxAuthErrors) {
      this.onConnectionFailed?.();
      return;
    }

    
    const newToken = await refreshToken();
    if (!newToken) {
      this.onConnectionFailed?.();
      return;
    }

   
    this.token = newToken;
  }

  if (this.reconnectAttempts < this.maxReconnectAttempts) {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    setTimeout(async () => {
      this.disconnect();
      await this.connectToMessageStream();

      
      this.authErrors = 0;
    }, delay);
  } else {
    this.onConnectionFailed?.();
  }
}

  disconnect() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}