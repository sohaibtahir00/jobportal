/**
 * Messages API Client
 * Handles messaging between candidates and employers
 */

import api from '../api';

// ============================================================================
// TYPES
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: any;
  receiver?: any;
}

export interface SendMessageData {
  receiverId: string;
  subject: string;
  content: string;
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/messages - Get user's messages
 */
export async function getMessages(params?: GetMessagesParams): Promise<MessagesResponse> {
  try {
    console.log('[Messages API] Fetching messages...');

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/messages${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get<MessagesResponse>(url);

    console.log('[Messages API] Messages fetched:', response.data.messages.length);

    return response.data;
  } catch (error: any) {
    console.error('[Messages API] Failed to fetch messages:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/messages/[id] - Get message by ID
 */
export async function getMessageById(id: string): Promise<Message> {
  try {
    console.log('[Messages API] Fetching message:', id);

    const response = await api.get<Message>(`/api/messages/${id}`);

    console.log('[Messages API] Message fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Messages API] Failed to fetch message:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/messages - Send a new message
 */
export async function sendMessage(messageData: SendMessageData): Promise<{ message: Message }> {
  try {
    console.log('[Messages API] Sending message...');

    const response = await api.post<{ message: Message }>('/api/messages', messageData);

    console.log('[Messages API] Message sent successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Messages API] Failed to send message:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * PATCH /api/messages/[id]/read - Mark message as read
 */
export async function markMessageAsRead(id: string): Promise<{ message: Message }> {
  try {
    console.log('[Messages API] Marking message as read:', id);

    const response = await api.patch<{ message: Message }>(`/api/messages/${id}/read`);

    console.log('[Messages API] Message marked as read');

    return response.data;
  } catch (error: any) {
    console.error('[Messages API] Failed to mark message as read:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/messages/[id] - Delete message
 */
export async function deleteMessage(id: string): Promise<{ message: string }> {
  try {
    console.log('[Messages API] Deleting message:', id);

    const response = await api.delete<{ message: string }>(`/api/messages/${id}`);

    console.log('[Messages API] Message deleted successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Messages API] Failed to delete message:', error.response?.data || error.message);
    throw error;
  }
}
