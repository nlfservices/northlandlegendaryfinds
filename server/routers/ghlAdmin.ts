/**
 * GHL Admin Router — View conversations and contacts from GoHighLevel CRM
 * Used in the admin dashboard to monitor Facebook comment automation activity
 */
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  isGHLConfigured,
  searchConversations,
  getConversation,
  getConversationMessages,
  getRecentContacts,
  getContact,
} from "../ghl-conversations";

export const ghlAdminRouter = router({
  /**
   * Check if GHL is properly configured
   */
  status: adminProcedure.query(async () => {
    return {
      configured: isGHLConfigured(),
    };
  }),

  /**
   * Search conversations (includes FB comment threads)
   */
  searchConversations: adminProcedure
    .input(
      z.object({
        query: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const result = await searchConversations({
        query: input?.query,
        limit: input?.limit || 20,
      });

      if (!result.success) {
        return { conversations: [], total: 0, error: result.error };
      }

      return {
        conversations: result.conversations || [],
        total: result.total || 0,
      };
    }),

  /**
   * Get a specific conversation with its messages
   */
  getConversation: adminProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      const [convResult, msgResult] = await Promise.all([
        getConversation(input.conversationId),
        getConversationMessages(input.conversationId, { limit: 50 }),
      ]);

      return {
        conversation: convResult.conversation || null,
        messages: msgResult.messages || [],
        error: convResult.error || msgResult.error,
      };
    }),

  /**
   * Get recent contacts (people who interacted via FB comments)
   */
  getContacts: adminProcedure
    .input(
      z.object({
        query: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const result = await getRecentContacts({
        query: input?.query,
        limit: input?.limit || 20,
      });

      if (!result.success) {
        return { contacts: [], total: 0, error: result.error };
      }

      return {
        contacts: result.contacts || [],
        total: result.total || 0,
      };
    }),

  /**
   * Get a specific contact details
   */
  getContact: adminProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ input }) => {
      const result = await getContact(input.contactId);
      return {
        contact: result.contact || null,
        error: result.error,
      };
    }),
});
