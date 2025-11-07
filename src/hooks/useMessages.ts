/**
 * useMessages Hook
 * React Query hooks for messaging functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMessages,
  getMessageById,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  type SendMessageData,
  type GetMessagesParams,
} from '@/lib/api/messages';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch user's messages
 */
export function useMessages(params?: GetMessagesParams) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => getMessages(params),
    staleTime: 30 * 1000, // 30 seconds - refresh frequently for messages
    retry: 1,
  });
}

/**
 * Hook to fetch a single message by ID
 */
export function useMessage(id: string) {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => getMessageById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageData: SendMessageData) => sendMessage(messageData),
    onSuccess: () => {
      // Invalidate messages list to refetch
      queryClient.invalidateQueries({ queryKey: ['messages'] });

      console.log('[useSendMessage] Message sent successfully');
    },
    onError: (error: any) => {
      console.error('[useSendMessage] Failed to send message:', error);
    },
  });
}

/**
 * Hook to mark message as read
 */
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markMessageAsRead(id),
    onSuccess: (data, messageId) => {
      // Update the message in cache
      queryClient.setQueryData(['message', messageId], data.message);

      // Invalidate messages list
      queryClient.invalidateQueries({ queryKey: ['messages'] });

      console.log('[useMarkMessageAsRead] Message marked as read');
    },
    onError: (error: any) => {
      console.error('[useMarkMessageAsRead] Failed to mark message as read:', error);
    },
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: (_, deletedId) => {
      // Remove message from cache
      queryClient.removeQueries({ queryKey: ['message', deletedId] });

      // Invalidate messages list
      queryClient.invalidateQueries({ queryKey: ['messages'] });

      console.log('[useDeleteMessage] Message deleted successfully');
    },
    onError: (error: any) => {
      console.error('[useDeleteMessage] Failed to delete message:', error);
    },
  });
}
