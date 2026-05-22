/**
 * GHL Admin Router — Full GoHighLevel integration for NLF admin dashboard
 * Features: Social Planner, Contact Management, Workflow Triggers, Conversations
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
import {
  isSocialPlannerConfigured,
  getSocialAccounts,
  createSocialPost,
  getSocialPosts,
  deleteSocialPost,
} from "../ghl-social-planner";
import {
  listGHLContacts,
  getGHLContact,
  updateGHLContact,
  addGHLContactTags,
  removeGHLContactTags,
  addGHLContactNote,
  getGHLContactNotes,
  triggerGHLWorkflow,
} from "../ghl";

export const ghlAdminRouter = router({
  // ==================== STATUS ====================

  /**
   * Check if GHL is properly configured (conversations + social planner)
   */
  status: adminProcedure.query(async () => {
    return {
      configured: isGHLConfigured(),
      socialPlannerConfigured: isSocialPlannerConfigured(),
    };
  }),

  // ==================== SOCIAL PLANNER ====================

  /**
   * Get connected social media accounts
   */
  getSocialAccounts: adminProcedure.query(async () => {
    const result = await getSocialAccounts();
    if (!result.success) {
      return { accounts: [], groups: [], error: result.error };
    }
    return {
      accounts: result.accounts || [],
      groups: result.groups || [],
    };
  }),

  /**
   * Create/schedule a social media post via GHL Social Planner
   */
  createSocialPost: adminProcedure
    .input(
      z.object({
        accountIds: z.array(z.string()).min(1),
        summary: z.string().min(1).max(5000),
        media: z
          .array(
            z.object({
              url: z.string().url(),
              type: z.enum(["image", "video"]),
            })
          )
          .optional(),
        status: z.enum(["draft", "scheduled", "published"]),
        scheduleDate: z.string().optional(),
        type: z.enum(["post", "story", "reel"]).default("post"),
        followUpComment: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createSocialPost(input);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true, postId: result.postId, post: result.post };
    }),

  /**
   * Get social planner posts (scheduled, published, draft)
   */
  getSocialPosts: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const result = await getSocialPosts({
        limit: input?.limit || 20,
        offset: input?.offset || 0,
        status: input?.status,
      });
      if (!result.success) {
        return { posts: [], total: 0, error: result.error };
      }
      return { posts: result.posts || [], total: result.total || 0 };
    }),

  /**
   * Delete a social post
   */
  deleteSocialPost: adminProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      const result = await deleteSocialPost(input.postId);
      return result;
    }),

  // ==================== CONTACT MANAGEMENT ====================

  /**
   * List contacts with filtering
   */
  listContacts: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
          query: z.string().optional(),
          tag: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const result = await listGHLContacts({
        limit: input?.limit || 20,
        offset: input?.offset || 0,
        query: input?.query,
        tag: input?.tag,
      });
      if (!result.success) {
        return { contacts: [], total: 0, error: result.error };
      }
      return { contacts: result.contacts || [], total: result.total || 0 };
    }),

  /**
   * Get full contact details
   */
  getContactDetails: adminProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ input }) => {
      const result = await getGHLContact(input.contactId);
      return { contact: result.contact || null, error: result.error };
    }),

  /**
   * Update a contact
   */
  updateContact: adminProcedure
    .input(
      z.object({
        contactId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { contactId, ...updates } = input;
      const result = await updateGHLContact(contactId, updates);
      return result;
    }),

  /**
   * Add tags to a contact
   */
  addContactTags: adminProcedure
    .input(
      z.object({
        contactId: z.string(),
        tags: z.array(z.string()).min(1),
      })
    )
    .mutation(async ({ input }) => {
      const result = await addGHLContactTags(input.contactId, input.tags);
      return result;
    }),

  /**
   * Remove tags from a contact
   */
  removeContactTags: adminProcedure
    .input(
      z.object({
        contactId: z.string(),
        tags: z.array(z.string()).min(1),
      })
    )
    .mutation(async ({ input }) => {
      const result = await removeGHLContactTags(input.contactId, input.tags);
      return result;
    }),

  /**
   * Add a note to a contact
   */
  addContactNote: adminProcedure
    .input(
      z.object({
        contactId: z.string(),
        body: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const result = await addGHLContactNote(input.contactId, input.body);
      return result;
    }),

  /**
   * Get notes for a contact
   */
  getContactNotes: adminProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ input }) => {
      const result = await getGHLContactNotes(input.contactId);
      return { notes: result.notes || [], error: result.error };
    }),

  // ==================== WORKFLOWS ====================

  /**
   * Trigger a GHL workflow for a specific contact
   */
  triggerWorkflow: adminProcedure
    .input(
      z.object({
        workflowId: z.string(),
        contactId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await triggerGHLWorkflow(input.workflowId, input.contactId);
      return result;
    }),

  // ==================== CONVERSATIONS (existing) ====================

  /**
   * Search conversations (includes FB comment threads)
   */
  searchConversations: adminProcedure
    .input(
      z
        .object({
          query: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
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
      z
        .object({
          query: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
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
   * Get a specific contact details (from conversations module)
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
