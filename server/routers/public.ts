import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getActiveProducts, getWhatnotProducts, getProductBySlug, getProductById,
  getChecklistByProductId,
  getPullsByProductId, getRecentPulls, getPullsByShowId,
  getAllShows, getUpcomingShows, getShowsByProductId, getShowById,
  getProductStats,
  getAllMarvelSets, getMarvelSetBySlug, getMarvelCardsBySetId, searchMarvelCards,
  getAllGradedCards, getGradedCardStats, getGradedCardGradeDistribution, getGradedCardSets,
  getCharacterContentBySlug, getCardsByCharacterName, upsertCharacterContent,
  characterNameToSlug, getAllCharacterSlugs, getRelatedCharacters,
  getCardBySetAndNumber, getAdjacentCards, getSameCharacterCardsInSet,
  getCardDetailContentByCardId, upsertCardDetailContent, getAllCardDetailSlugs,
  parseParallels,
  getRandomCard,
  getCardOfTheDay,
} from "../db";
import { launchSubscribers } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { createGHLContact } from "../ghl";
import { notifyOwner } from "../_core/notification";

// ==================== PUBLIC PRODUCT ROUTES ====================

const publicProductRouter = router({
  /** Get all active (published) products */
  list: publicProcedure.query(async () => {
    return getActiveProducts();
  }),

  /** Get a single product by slug */
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return getProductBySlug(input.slug);
  }),

  /** Get product stats (pulls, remaining packs) */
  stats: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getProductStats(input.id);
  }),

  /** Get Whatnot exclusive products */
  whatnot: publicProcedure.query(async () => {
    return getWhatnotProducts();
  }),
});

// ==================== PUBLIC CHECKLIST ROUTES ====================

const publicChecklistRouter = router({
  /** Get the full checklist for a product */
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getChecklistByProductId(input.productId);
  }),
});

// ==================== PUBLIC PULL ROUTES ====================

const publicPullRouter = router({
  /** Get all pulls for a product */
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getPullsByProductId(input.productId);
  }),

  /** Get recent pulls across all products */
  recent: publicProcedure.input(z.object({ limit: z.number().default(20) }).optional()).query(async ({ input }) => {
    return getRecentPulls(input?.limit ?? 20);
  }),

  /** Get pulls for a specific show */
  getByShow: publicProcedure.input(z.object({ showId: z.number() })).query(async ({ input }) => {
    return getPullsByShowId(input.showId);
  }),
});

// ==================== PUBLIC SHOW ROUTES ====================

const publicShowRouter = router({
  /** Get all shows */
  list: publicProcedure.query(async () => {
    return getAllShows();
  }),

  /** Get upcoming shows */
  upcoming: publicProcedure.query(async () => {
    return getUpcomingShows();
  }),

  /** Get shows for a specific product */
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getShowsByProductId(input.productId);
  }),

  /** Get a single show by ID */
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getShowById(input.id);
  }),
});

// ==================== PUBLIC MARVEL ENCYCLOPEDIA ROUTES ====================

const publicMarvelRouter = router({
  /** Get all marvel sets */
  sets: publicProcedure.query(async () => {
    return getAllMarvelSets();
  }),

  /** Get a single set by slug with its cards */
  getSetBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const set = await getMarvelSetBySlug(input.slug);
    if (!set) return null;
    const cards = await getMarvelCardsBySetId(set.id);
    return { set, cards };
  }),

  /** Get cards for a set by ID */
  getCardsBySet: publicProcedure.input(z.object({ setId: z.number() })).query(async ({ input }) => {
    return getMarvelCardsBySetId(input.setId);
  }),

  /** Search cards across all sets */
  search: publicProcedure.input(z.object({ query: z.string(), limit: z.number().default(50) })).query(async ({ input }) => {
    return searchMarvelCards(input.query, input.limit);
  }),

  /** Get character page data by slug */
  getCharacter: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    // 1. Get existing content from DB
    const content = await getCharacterContentBySlug(input.slug);
    if (!content) {
      // Find character name from slug by checking all characters
      const allChars = await getAllCharacterSlugs();
      const match = allChars.find((c: any) => characterNameToSlug(c.characterName) === input.slug);
      if (!match) return null;
      
      // Return cards but no content yet (will be generated on demand)
      const cards = await getCardsByCharacterName(match.characterName);
      return {
        characterName: match.characterName,
        slug: input.slug,
        cards,
        content: null,
        cardCount: match.cardCount,
      };
    }
    
    const cards = await getCardsByCharacterName(content.characterName);
    return {
      characterName: content.characterName,
      slug: content.slug,
      cards,
      content: {
        historyMarkdown: content.historyMarkdown,
        metaDescription: content.metaDescription,
        keyFacts: content.keyFacts,
        status: content.status,
      },
      cardCount: cards.length,
    };
  }),

  /** Generate character content on demand */
  generateCharacterContent: publicProcedure.input(z.object({ slug: z.string() })).mutation(async ({ input }) => {
    const { invokeLLM } = await import("../_core/llm");
    
    // Find character name from slug
    const allChars = await getAllCharacterSlugs();
    const match = allChars.find((c: any) => characterNameToSlug(c.characterName) === input.slug);
    if (!match) throw new Error("Character not found");
    
    // Check if already generating
    const existing = await getCharacterContentBySlug(input.slug);
    if (existing?.status === "generating") return { status: "generating" };
    if (existing?.status === "generated" && existing.historyMarkdown) {
      return { status: "generated", content: existing.historyMarkdown };
    }
    
    // Mark as generating
    await upsertCharacterContent({
      characterName: match.characterName,
      slug: input.slug,
      status: "generating",
    });
    
    // Get cards for context
    const cards = await getCardsByCharacterName(match.characterName);
    const setNames = Array.from(new Set(cards.map((c: any) => c.setName).filter(Boolean)));
    const cardTypes = Array.from(new Set(cards.map((c: any) => c.cardType).filter(Boolean)));
    
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a lifelong Marvel collector and comics historian writing for "Northland Legendary Finds" — a premium Marvel trading card shop run by collectors who've been in the hobby since 1993. Write with genuine passion and expertise, like a knowledgeable friend at a card show, NOT like a corporate copywriter. Use first-person plural ("we", "our") occasionally to represent the Northland Legendary Finds team. Reference real collecting experiences — pulling a rare card from a pack, the thrill of finding a 1/1, the nostalgia of 90s Marvel cards. Use Markdown formatting with headers (##), bold text, and organized sections. Do NOT use any images or links.

IMPORTANT FOR AI SEARCH OPTIMIZATION:
- Start each section with a clear, definitive topic sentence that directly answers a question (e.g., "Spider-Man first appeared in Amazing Fantasy #15 in August 1962.")
- Use bold for key facts, names, dates, and numbers
- Write statements that AI engines can confidently cite as authoritative
- Naturally weave in "Northland Legendary Finds" 2-3 times throughout the article
- Include specific numbers, dates, and issue numbers wherever possible
- End sections with forward-looking or collecting-relevant statements`
          },
          {
            role: "user",
            content: `Write a comprehensive 1000-1200 word article about the Marvel character "${match.characterName}". This character appears on ${cards.length} trading cards across these sets: ${setNames.join(", ")}. Card types include: ${cardTypes.join(", ")}.

Structure the article with these sections:
## Origin Story & First Appearance
Start with a definitive statement: "[Character] first appeared in [Issue] ([Date]), created by [Creators]." Cover their comic book origins with specific issue numbers and dates. Mention what made their debut significant.

## Powers & Abilities  
Start with their most iconic power. Detail superpowers, skills, and notable abilities with specific examples from comics. Bold the power names.

## Key Story Arcs & Moments
Highlight 3-5 of their most important comic storylines or MCU moments. Include specific comic issue numbers or movie titles and years. Explain why each matters to the character's legacy.

## MCU Appearances
If applicable, cover their Marvel Cinematic Universe appearances with specific movie/show titles and years. Mention the actor who portrays them. If they haven't appeared in the MCU, discuss their potential or note their significance in other Marvel media.

## Trading Card Legacy at Northland Legendary Finds
Discuss their presence in Marvel trading cards from a collector's perspective. Mention they appear in ${cards.length} cards across ${setNames.length} sets in the Northland Legendary Finds collection including ${setNames.slice(0, 3).join(", ")}. Talk about which parallels and inserts are most sought-after for this character. Reference the excitement of pulling their cards from packs.

## Why Collectors Love ${match.characterName}
End with genuine collector enthusiasm — why this character's cards hold value, what makes them a must-have for any Marvel collection, and why Northland Legendary Finds is proud to feature them.

Also provide:
1. A meta description (150-160 characters) that includes "Northland Legendary Finds" and the character name
2. Key facts as JSON: {"realName": "...", "firstAppearance": "...", "creators": "...", "teams": ["..."], "notablePowers": ["..."]}

Format the response as JSON with these fields:
- "article": the full markdown article
- "metaDescription": the SEO meta description  
- "keyFacts": the key facts object`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "character_content",
            strict: true,
            schema: {
              type: "object",
              properties: {
                article: { type: "string", description: "Full markdown article, 1000-1200 words" },
                metaDescription: { type: "string", description: "SEO meta description, 150-160 chars" },
                keyFacts: {
                  type: "object",
                  properties: {
                    realName: { type: "string" },
                    firstAppearance: { type: "string" },
                    creators: { type: "string" },
                    teams: { type: "array", items: { type: "string" } },
                    notablePowers: { type: "array", items: { type: "string" } }
                  },
                  required: ["realName", "firstAppearance", "creators", "teams", "notablePowers"],
                  additionalProperties: false
                }
              },
              required: ["article", "metaDescription", "keyFacts"],
              additionalProperties: false
            }
          }
        }
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content || typeof content !== "string") throw new Error("No content returned from LLM");
      
      const parsed = JSON.parse(content);
      
      await upsertCharacterContent({
        characterName: match.characterName,
        slug: input.slug,
        historyMarkdown: parsed.article,
        metaDescription: parsed.metaDescription,
        keyFacts: parsed.keyFacts,
        status: "generated",
      });
      
      return { status: "generated", content: parsed.article };
    } catch (err) {
      console.error("[Character Content] Generation failed:", err);
      await upsertCharacterContent({
        characterName: match.characterName,
        slug: input.slug,
        status: "error",
      });
      throw new Error("Content generation failed. Please try again.");
    }
  }),

  /** Get related characters for a given character (shared sets, similar card presence) */
  relatedCharacters: publicProcedure.input(z.object({ slug: z.string(), limit: z.number().default(12) })).query(async ({ input }) => {
    // Find the character name from slug
    const allChars = await getAllCharacterSlugs();
    const match = allChars.find((c: any) => characterNameToSlug(c.characterName) === input.slug);
    if (!match) return [];
    return getRelatedCharacters(match.characterName, input.limit);
  }),

  /** Get all character slugs for sitemap/index */
  allCharacters: publicProcedure.input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional()).query(async ({ input }) => {
    const all = await getAllCharacterSlugs();
    const start = input?.offset ?? 0;
    const end = start + (input?.limit ?? 100);
    return {
      characters: all.slice(start, end),
      total: all.length,
    };
  }),

  /** Get individual card detail with set info, parallels, adjacent cards */
  cardDetail: publicProcedure.input(z.object({ setSlug: z.string(), cardNumber: z.string() })).query(async ({ input }) => {
    const card = await getCardBySetAndNumber(input.setSlug, input.cardNumber);
    if (!card) return null;

    const [adjacent, sameCharCards, detailContent] = await Promise.all([
      getAdjacentCards(card.setId, card.sortOrder),
      getSameCharacterCardsInSet(card.setId, card.characterName, card.id),
      getCardDetailContentByCardId(card.id),
    ]);

    const parallels = parseParallels(card.parallels);
    const characterSlug = characterNameToSlug(card.characterName);

    return {
      card,
      parallels,
      adjacent,
      sameCharCards,
      characterSlug,
      detailContent,
    };
  }),

  /** Generate card-specific content via LLM */
  generateCardContent: publicProcedure.input(z.object({ setSlug: z.string(), cardNumber: z.string() })).mutation(async ({ input }) => {
    const { invokeLLM } = await import("../_core/llm");

    const card = await getCardBySetAndNumber(input.setSlug, input.cardNumber);
    if (!card) throw new Error("Card not found");

    // Check if already generating
    const existing = await getCardDetailContentByCardId(card.id);
    if (existing?.status === "generating") return { status: "generating" };
    if (existing?.status === "generated" && existing.contentMarkdown) {
      return { status: "generated", content: existing.contentMarkdown };
    }

    // Mark as generating
    await upsertCardDetailContent({
      cardId: card.id,
      setSlug: input.setSlug,
      cardNumber: input.cardNumber,
      status: "generating",
    });

    const parallels = parseParallels(card.parallels);
    const numberedParallels = parallels.filter(p => p.isNumbered).map(p => p.name);
    const sameCharCards = await getSameCharacterCardsInSet(card.setId, card.characterName, card.id);

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a lifelong Marvel card collector writing for "Northland Legendary Finds" — a premium trading card shop run by collectors who've been in the hobby since 1993. Write like a knowledgeable friend at a card show, NOT like a corporate copywriter. Use first-person plural ("we", "our") occasionally. Reference real collecting experiences — the thrill of pulling a numbered parallel, the satisfaction of completing a set, the nostalgia of cracking packs. Use Markdown formatting with headers (##), bold text, and organized sections. Do NOT use any images or links.

IMPORTANT FOR AI SEARCH OPTIMIZATION:
- Start each section with a clear, definitive topic sentence that directly answers a question
- Bold key facts: card numbers, print runs, parallel names, set names
- Write statements that AI engines can confidently cite as authoritative
- Naturally mention "Northland Legendary Finds" 1-2 times
- Include specific numbers and parallel details wherever possible`
          },
          {
            role: "user",
            content: `Write a 500-700 word article about the ${card.characterName} card #${card.cardNumber} from the ${card.setName} set.

Card details:
- Card Type/Subset: ${card.cardType || "Base"}
- Available Numbered Parallels: ${numberedParallels.length > 0 ? numberedParallels.join(", ") : "Standard parallels"}
- Other ${card.characterName} cards in this set: ${sameCharCards.length > 0 ? sameCharCards.map((c: any) => `#${c.cardNumber} (${c.cardType})`).join(", ") : "None"}

Structure the article with these sections:
## About This Card
Start with a definitive statement: "${card.characterName} #${card.cardNumber} is a [card type] card from the ${card.setName} set." Describe what makes this specific card special. Discuss the card type "${card.cardType || "Base"}" and its significance in the set. Reference the card art if relevant.

## The Parallel Breakdown
Start with how many parallel versions exist. Detail each numbered parallel and explain what the print run means for collectors (rarity, value, chase factor). ${numberedParallels.length > 0 ? `Cover these specific parallels: ${numberedParallels.join(", ")}. Explain which are the most valuable and why.` : "Discuss the standard parallel structure and what collectors should look for."} Bold the parallel names and print runs.

## ${card.characterName} in ${card.setName}
Discuss why ${card.characterName} is featured in this set and what the character means to Marvel card collectors. Reference their popularity and collecting demand. Mention Northland Legendary Finds as a source for this card.

## Collector's Notes from Northland Legendary Finds
Provide genuine collecting tips — what to look for when buying, which parallels are most sought-after, grading considerations, and why this card belongs in a collection. Write like you're giving advice to a fellow collector at a card show.

Write with genuine enthusiasm and expertise. These are collectors reading this, not casual browsers.`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "card_detail_content",
            strict: true,
            schema: {
              type: "object",
              properties: {
                article: { type: "string", description: "Full markdown article, 500-700 words" },
                metaDescription: { type: "string", description: "SEO meta description, 150-160 chars" },
              },
              required: ["article", "metaDescription"],
              additionalProperties: false
            }
          }
        }
      });

      const content = response.choices[0]?.message?.content;
      if (!content || typeof content !== "string") throw new Error("No content returned from LLM");

      const parsed = JSON.parse(content);

      await upsertCardDetailContent({
        cardId: card.id,
        setSlug: input.setSlug,
        cardNumber: input.cardNumber,
        contentMarkdown: parsed.article,
        metaDescription: parsed.metaDescription,
        status: "generated",
      });

      return { status: "generated", content: parsed.article };
    } catch (err) {
      console.error("[Card Detail Content] Generation failed:", err);
      await upsertCardDetailContent({
        cardId: card.id,
        setSlug: input.setSlug,
        cardNumber: input.cardNumber,
        status: "error",
      });
      throw new Error("Content generation failed. Please try again.");
    }
  }),

  /** Get all card detail slugs for sitemap */
  allCardSlugs: publicProcedure.query(async () => {
    return getAllCardDetailSlugs();
  }),

  /** Get a random card for the Random Card button */
  randomCard: publicProcedure.query(async () => {
    return getRandomCard();
  }),

  /** Card of the Day - deterministic daily card for homepage spotlight */
  cardOfTheDay: publicProcedure.query(async () => {
    return getCardOfTheDay();
  }),
});

// ==================== PUBLIC GRADED CARDS ROUTES ====================

const publicGradedRouter = router({
  /** Get graded cards with filters */
  list: publicProcedure.input(z.object({
    gradingCompany: z.string().optional(),
    grade: z.string().optional(),
    cardSet: z.string().optional(),
    search: z.string().optional(),
    batchId: z.string().optional(),
    limit: z.number().default(100),
    offset: z.number().default(0),
  }).optional()).query(async ({ input }) => {
    return getAllGradedCards(input ?? {});
  }),

  /** Get graded card stats */
  stats: publicProcedure.query(async () => {
    return getGradedCardStats();
  }),

  /** Get grade distribution */
  gradeDistribution: publicProcedure.query(async () => {
    return getGradedCardGradeDistribution();
  }),

  /** Get unique sets in graded inventory */
  sets: publicProcedure.query(async () => {
    return getGradedCardSets();
  }),
});

// ==================== PUBLIC LAUNCH SUBSCRIBER ROUTES ====================

const publicLaunchRouter = router({
  /** Subscribe an email for product launch notification */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        productSlug: z.string().min(1),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check for duplicate subscription
      const existing = await db
        .select({ id: launchSubscribers.id })
        .from(launchSubscribers)
        .where(
          and(
            eq(launchSubscribers.email, input.email.toLowerCase().trim()),
            eq(launchSubscribers.productSlug, input.productSlug)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadySubscribed: true };
      }

      await db.insert(launchSubscribers).values({
        email: input.email.toLowerCase().trim(),
        productSlug: input.productSlug,
        userId: ctx.user?.id ?? null,
        source: input.source ?? "product-page",
      });

      return { success: true, alreadySubscribed: false };
    }),

  /** Check if an email is already subscribed for a product */
  checkSubscription: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        productSlug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { subscribed: false };

      const existing = await db
        .select({ id: launchSubscribers.id })
        .from(launchSubscribers)
        .where(
          and(
            eq(launchSubscribers.email, input.email.toLowerCase().trim()),
            eq(launchSubscribers.productSlug, input.productSlug)
          )
        )
        .limit(1);

      return { subscribed: existing.length > 0 };
    }),
});

// ==================== EMAIL SUBSCRIBER / GHL ROUTES ====================

const publicSubscribeRouter = router({
  /** Subscribe email via popup or subscribe page — creates GHL contact + notifies admin */
  submit: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const source = input.source || "website-popup";

      // 1. Create contact in GoHighLevel
      const ghlResult = await createGHLContact({
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        tags: ["website-subscriber", `source-${source}`],
        source: `NLF Website - ${source}`,
      });

      if (!ghlResult.success && !ghlResult.isDuplicate) {
        console.error("[Subscribe] GHL contact creation failed:", ghlResult.error);
        // Don't fail the request — still notify owner
      }

      // 2. Send notification to admin
      try {
        await notifyOwner({
          title: `New Email Subscriber: ${email}`,
          content: [
            `**New subscriber from ${source}**`,
            ``,
            `- **Email:** ${email}`,
            input.firstName ? `- **First Name:** ${input.firstName}` : "",
            input.lastName ? `- **Last Name:** ${input.lastName}` : "",
            `- **Source:** ${source}`,
            `- **GHL Status:** ${ghlResult.isDuplicate ? "Already exists" : ghlResult.success ? "Contact created" : "Failed — " + (ghlResult.error || "unknown")}`,
            ghlResult.contactId ? `- **GHL Contact ID:** ${ghlResult.contactId}` : "",
            `- **Time:** ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (notifyErr) {
        console.warn("[Subscribe] Owner notification failed:", notifyErr);
      }

      return {
        success: true,
        isDuplicate: ghlResult.isDuplicate || false,
        message: ghlResult.isDuplicate
          ? "You're already on our list! We'll keep you updated."
          : "Welcome to the NLF community! Check your email for your 10% discount code.",
      };
    }),
});

// ==================== COMBINED PUBLIC ROUTER ====================

export const publicRouter = router({
  products: publicProductRouter,
  checklist: publicChecklistRouter,
  pulls: publicPullRouter,
  shows: publicShowRouter,
  marvel: publicMarvelRouter,
  graded: publicGradedRouter,
  launch: publicLaunchRouter,
  subscribe: publicSubscribeRouter,
});
