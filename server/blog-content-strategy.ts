/**
 * NLF Blog Content Strategy — Core Talking Points & AI Generation Prompts
 * 
 * This file centralizes the content strategy so all generation endpoints
 * (admin single, admin bulk, auto-scheduler) use the same messaging.
 */

// ==================== MASTER SYSTEM PROMPT ====================

export const NLF_BLOG_SYSTEM_PROMPT = `You are an expert Marvel trading card content writer for Northland Legendary Finds (NLF), a premium Marvel card repack company based in Minnesota. NLF uses grading services including CGC, AGS, and PSA. They sell curated repack series with full transparency — every card is listed on a public checklist before purchase.

CRITICAL RULES — MUST FOLLOW:
1. ONLY reference TOPPS Marvel products. Topps is the ONLY officially licensed Marvel card producer. NEVER mention Fleer, Upper Deck, SkyBox, Impel, or any other card manufacturer by name. If discussing vintage/historical cards, refer to them generically as "classic Marvel sets" or "vintage Marvel cards" without naming non-Topps companies.
2. Push the TOPPS LICENSING ADVANTAGE: Topps holds the exclusive Marvel license. Unlicensed products from other companies will struggle long-term. Licensed = legitimacy = value retention. This is a massive competitive moat.
3. NEVER include specific dollar amounts or investment return numbers in articles. Speak in relative terms ("significant appreciation," "strong value growth," "outperforming") rather than exact prices.

CORE TALKING POINTS — Weave these naturally into every article:

A) RARITY + MARVEL FANBASE = CHASE CARD EXPLOSION
Marvel has the largest entertainment fanbase on the planet. Limited print runs on chase cards + hundreds of millions of potential collectors = massive supply/demand imbalance. Chase cards, parallels, sketch cards, and numbered hits are positioned to reach new heights as more fans enter the hobby.

B) THE GREAT MIGRATION — New collectors are flooding into Marvel cards from:
- COMIC BOOK COLLECTORS discovering trading cards as a natural extension of their passion
- POKÉMON COLLECTORS hedging their portfolio — especially with Pokémon's new US printing facility potentially creating a new wax era (more supply = diluted value for Pokémon, making Marvel cards a smarter hedge)
- SPORTS CARD COLLECTORS (baseball, football, basketball) getting in because they can relate to their kids' love of Marvel. Parents bond with kids over cards, and eventually the kids join them in sports cards too — it's a family bridge.

C) MARVEL AS THE FAMILY GATEWAY HOBBY
Parents collect sports cards, kids collect Marvel cards, and they bond over the hobby together. Marvel is the bridge that connects generations of collectors. This crossover effect is driving unprecedented growth.

D) MCU CONTENT CALENDAR — USE THESE HOOKS:
- WONDER MAN SERIES on Disney+ — new character interest driving card demand
- SPIDER-MAN: BRAND NEW DAY — the most trailer views in history, massive mainstream hype, Spider-Man cards are the hottest in the hobby
- AVENGERS: DOOMSDAY — Doctor Doom / Robert Downey Jr. return, Doom card values surging
- AVENGERS: ENDGAME RE-RELEASE (September) — nostalgia wave = renewed interest in classic Avengers cards
- THE FANTASTIC FOUR: FIRST STEPS — bringing Marvel's first family to the MCU

E) SPORTS CROSSOVER COMPARISONS — Use these to make Marvel cards relatable to sports card collectors:
- "Is Doctor Doom the Shohei Ohtani of Marvel cards?" — rare, dominant, game-changing, everyone wants a piece
- "Is Spider-Man the Michael Jordan of Marvel?" — the GOAT, most iconic, highest value, the card everyone needs
- "Is Wolverine the LeBron James of Marvel cards?" — longevity, always relevant, always valuable across eras
- "Is Iron Man the Tom Brady?" — legacy, retirement, comeback, the leader
- "Is Deadpool the Steph Curry?" — changed the game, unexpected rise, broke the mold
- "Is Venom the Kobe Bryant?" — dark intensity, massive following, iconic in their own right

F) TOPPS PRODUCT REFERENCES — Only mention these products:
- Topps Comic Book Heroes (1976) — the OG, foundational set
- Topps Marvel Ages — modern premium set
- Topps Marvel Platinum — ultra-premium chase set
- Topps Chrome Marvel — the chrome standard
- Topps Finest Marvel — high-end parallel chase
- Topps Marvel Collect (digital) — gateway to physical collecting
- Generic references: "Topps Marvel sets," "officially licensed Topps products"

G) NLF BRAND INTEGRATION (subtle, not pushy):
- Full checklist transparency before purchase
- Cards graded through CGC, AGS, PSA and more
- Heat-sealed in custom NLF holographic mylar bags
- Hand-curated, hand-inspected process
- Link to: /our-process, /checklists, /cards, /shop

ARTICLE STRUCTURE — VARY EVERY ARTICLE:
Do NOT use the same template for every article. Rotate between these structures:
- News Report style (breaking news, quotes, timeline)
- Listicle ("Top 7...", "5 Reasons...")
- Deep Dive / Analysis (data-driven, comparison tables)
- Q&A / Interview format
- Narrative / Story ("Picture this..." opening, scene-setting)
- Guide / How-To (step-by-step with numbered sections)
- Opinion / Hot Take (bold thesis, counterarguments, conclusion)

IMAGE PROMPT RULES — CRITICAL:
When generating the imagePrompt field, you MUST create prompts that produce REALISTIC PHOTOGRAPHY-STYLE images, NOT AI art or illustrations. Think of what a real card shop, card show, or collector's desk actually looks like. Use these styles:
- Product photography: real trading cards laid out on dark felt or wood surfaces, natural lighting
- Flat-lay photography: cards, graded slabs, wax packs arranged on a clean surface, shot from above
- Close-up macro shots: a single graded card slab with the label visible, shallow depth of field
- Card show / convention scenes: tables with binders, display cases, crowds browsing
- Collector lifestyle: hands holding cards, sorting through a binder, opening a wax pack
- Desk/workspace: a collector's desk with cards, penny sleeves, top loaders, and a laptop showing prices
NEVER use: cosmic backgrounds, glowing energy, floating cards in space, neon effects, comic-art style, hyper-rendered illustrations, or anything that looks obviously AI-generated. Keep it grounded and real.

Write SEO-optimized blog articles that:
- Are 800-1200 words with clear H2/H3 markdown headings
- Use a knowledgeable but accessible tone — like talking to a fellow collector at a card show
- Include a compelling meta description (max 160 chars)
- End with a call-to-action that drives engagement
- Target the focus keyword naturally throughout
- Use VARIED structures (see above) — never the same format twice in a row`;

// ==================== TOPIC POOLS ====================

export const TOPIC_POOLS: Record<string, string[]> = {
  market_trends: [
    "How the Spider-Man Brand New Day trailer broke the internet and what it means for Spider-Man card values",
    "Avengers Doomsday announcement: why Doctor Doom cards are the hottest investment right now",
    "The Endgame re-release effect: how nostalgia waves drive classic Avengers card prices",
    "Why Topps exclusive Marvel license makes their cards the only long-term investment play",
    "The Pokémon hedge: why smart collectors are moving into Marvel cards as Pokémon faces a new wax era",
    "Marvel card market momentum: what the influx of sports card collectors means for values",
    "How MCU movie announcements create predictable card value spikes",
    "The licensing advantage: why officially licensed Topps Marvel cards will outlast unlicensed products",
    "Wonder Man series hype: which cards to watch as Disney+ expands the Marvel universe",
    "Why Marvel cards are outperforming as collectors migrate from comics and Pokémon",
  ],
  character_spotlight: [
    "Is Spider-Man the Michael Jordan of Marvel cards? Why Spidey is the GOAT of the hobby",
    "Is Doctor Doom the Shohei Ohtani of Marvel cards? The rare game-changer everyone wants",
    "Is Wolverine the LeBron James of Marvel cards? Longevity and value across every era",
    "Is Iron Man the Tom Brady of Marvel cards? Legacy, retirement, and the ultimate comeback",
    "Is Deadpool the Steph Curry of Marvel cards? How the merc broke the mold",
    "Is Venom the Kobe Bryant of Marvel cards? Dark intensity meets massive collector demand",
    "Spider-Man cards: why the web-slinger dominates every Topps Marvel set ever made",
    "Doctor Doom cards surge: how Avengers Doomsday is creating the next mega-character in collecting",
    "Wolverine and the X-Men card renaissance: what the MCU integration means for values",
    "The Fantastic Four effect: which cards to collect before First Steps hits theaters",
  ],
  grading_guide: [
    "CGC vs PSA vs AGS: which grading company gives your Marvel cards the best value",
    "Understanding card grading scales: what a 9.5 really means for your collection",
    "How to prepare your Marvel cards for grading submission like a pro",
    "The cost of grading: when it makes sense to slab your Marvel cards",
    "Common grading mistakes that crush your card's value and how to avoid them",
    "How to read a CGC label: decoding grades, sub-grades, and cert numbers",
    "Sub-grades explained: surface, corners, edges, and centering matter",
    "When to grade vs keep raw: a collector's decision framework",
  ],
  set_breakdown: [
    "Topps Comic Book Heroes 1976: the complete guide to Marvel's most iconic card set",
    "Topps Marvel Ages: every chase card and why this set is a collector's dream",
    "Topps Marvel Platinum: the ultra-premium set serious collectors are chasing",
    "Topps Chrome Marvel: why chrome cards command a premium in every hobby",
    "Topps Finest Marvel: the high-end parallel chase that rewards patient collectors",
    "Comparing every major Topps Marvel set: which ones are the best investments",
    "The best Topps Marvel sets for new collectors to start building a portfolio",
    "Hidden gems in Topps Marvel sets that most collectors completely overlook",
  ],
  investment_strategy: [
    "Why Marvel cards are the ultimate family investment: parents in sports, kids in Marvel",
    "The great migration: how comic, Pokémon, and sports collectors are flooding into Marvel cards",
    "Pokémon's new US printing facility and what it means for Marvel card investors",
    "Building a Marvel card portfolio: why Topps licensed products are the only safe bet",
    "The sports card parent trap: how Marvel cards bridge generations of collectors",
    "Why graded Topps Marvel cards outperform raw cards as long-term investments",
    "Scarcity math: Marvel's massive fanbase vs limited chase card print runs",
    "Dollar-cost averaging into Marvel cards: a strategy borrowed from Wall Street",
    "The case for Marvel cards over Pokémon: licensing, scarcity, and cultural staying power",
    "How to spot undervalued Topps Marvel cards before the next MCU announcement",
  ],
  collecting_tips: [
    "Beginner's guide to Marvel trading card collecting: start your journey with Topps",
    "How to store and protect your graded Marvel card collection",
    "Building your first graded Marvel card collection on any budget",
    "The essential tools every Marvel card collector needs in 2026",
    "How to spot fake or counterfeit Marvel trading cards and protect yourself",
    "Coming from sports cards? Here's your guide to Marvel card collecting",
    "Coming from Pokémon? Why Marvel cards might be your smartest move",
    "Card show etiquette: tips for buying Marvel cards at conventions",
  ],
  card_history: [
    "How Topps became the undisputed king of Marvel card production",
    "The evolution of Marvel card art: from hand-painted to digital masterpieces",
    "Why the Topps exclusive license changed everything for Marvel card collecting",
    "The 1990s card boom: lessons for today's Marvel card investors",
    "From comic pages to card slabs: how Marvel cards became a legitimate asset class",
    "The most iconic Topps Marvel cards in hobby history",
    "Marvel sketch cards: the one-of-one art form that changed collecting forever",
    "How the MCU transformed Marvel cards from nostalgia items to investment vehicles",
  ],
  nlf_news: [
    "What makes NLF repacks different: full transparency in a trust-deficit industry",
    "How NLF builds every repack series: from sourcing to heat-sealed delivery",
    "Behind the scenes: how we source cards exclusively from Topps Marvel products",
    "Why we publish full checklists before you buy: the NLF transparency promise",
    "The NLF grading process: why we use CGC, AGS, PSA and more",
    "How NLF heat-sealed holographic mylar bags protect your investment",
  ],
  sports_crossover: [
    "From baseball diamonds to Marvel cards: why sports dads are joining the hobby",
    "The card collector's crossover: comparing Marvel character values to sports card legends",
    "Why your kid's Marvel card collection might outperform your sports card portfolio",
    "Football card collectors guide to Marvel cards: same hobby, different universe",
    "Basketball meets Marvel: how the collecting skills transfer perfectly",
    "The family card night: how Marvel and sports cards are bringing families together",
  ],
};

// ==================== BULK GENERATE TOPIC POOL ====================

export const BULK_TOPIC_POOL = [
  { topic: "Is Spider-Man the Michael Jordan of Marvel cards? The GOAT comparison", category: "character_spotlight" as const },
  { topic: "Is Doctor Doom the Shohei Ohtani of Marvel cards? The rare game-changer", category: "character_spotlight" as const },
  { topic: "Why Topps exclusive Marvel license makes their cards the only safe investment", category: "market_trends" as const },
  { topic: "The Pokémon hedge: why collectors are moving to Marvel as Pokémon faces a new wax era", category: "investment_strategy" as const },
  { topic: "Spider-Man Brand New Day: most trailer views in history and what it means for card values", category: "market_trends" as const },
  { topic: "Avengers Doomsday: Doctor Doom cards are surging and here's why", category: "market_trends" as const },
  { topic: "The sports card parent trap: how Marvel cards bridge generations", category: "investment_strategy" as const },
  { topic: "Topps Comic Book Heroes 1976: the complete guide to Marvel's foundational set", category: "set_breakdown" as const },
  { topic: "Is Wolverine the LeBron James of Marvel cards? Longevity and value", category: "character_spotlight" as const },
  { topic: "Coming from Pokémon? Why Marvel cards might be your smartest move in 2026", category: "collecting_tips" as const },
  { topic: "The Endgame re-release effect: nostalgia waves and Avengers card prices", category: "market_trends" as const },
  { topic: "CGC vs PSA vs AGS: which grading company maximizes your Marvel card value", category: "grading_guide" as const },
  { topic: "Is Iron Man the Tom Brady of Marvel cards? Legacy and comeback value", category: "character_spotlight" as const },
  { topic: "Why Marvel's massive fanbase makes chase cards a supply/demand goldmine", category: "investment_strategy" as const },
  { topic: "From baseball diamonds to Marvel cards: the sports dad's guide to the hobby", category: "sports_crossover" as const },
  { topic: "Topps Marvel Ages: every chase card and why collectors love this set", category: "set_breakdown" as const },
  { topic: "Is Deadpool the Steph Curry of Marvel cards? Breaking the mold", category: "character_spotlight" as const },
  { topic: "Wonder Man series: which cards to watch as Disney+ expands Marvel", category: "market_trends" as const },
  { topic: "Building a Marvel card portfolio with only Topps licensed products", category: "investment_strategy" as const },
  { topic: "The Fantastic Four First Steps: which cards to collect before the movie", category: "character_spotlight" as const },
  { topic: "How NLF builds transparency into every repack series", category: "nlf_news" as const },
  { topic: "Beginner's guide to Marvel card collecting: start with Topps", category: "collecting_tips" as const },
  { topic: "Is Venom the Kobe Bryant of Marvel cards? Dark intensity meets demand", category: "character_spotlight" as const },
  { topic: "The great migration: comic, Pokémon, and sports collectors flooding into Marvel", category: "investment_strategy" as const },
];

// ==================== CATEGORY LABELS ====================

export const CATEGORY_LABELS: Record<string, string> = {
  market_trends: "Marvel Card Market Trends & Investment",
  character_spotlight: "Marvel Character Spotlight & Card Values",
  grading_guide: "Card Grading Guide (CGC, AGS, PSA)",
  set_breakdown: "Topps Marvel Set Breakdown & Chase Cards",
  investment_strategy: "Trading Card Investment Strategy",
  collecting_tips: "Card Collecting Tips & Best Practices",
  nlf_news: "Northland Legendary Finds News & Updates",
  behind_the_scenes: "Behind the Scenes at NLF",
  card_history: "Marvel Trading Card History & Nostalgia",
  sports_crossover: "Sports Card to Marvel Card Crossover",
};

// ==================== ORDER 66 — TEMPLATE ROTATION ====================

export const TEMPLATE_NAMES: Record<number, string> = {
  1: "Field Report",
  2: "Personnel Dossier",
  3: "Data Brief",
  4: "Intercepted Transmission",
  5: "Situation Room",
  6: "Asset Gallery",
  7: "Strategic Analysis",
  8: "Flash Alert",
  9: "After-Action Report",
  10: "Technical Schematic",
  11: "Surveillance Log",
  12: "Command Briefing",
};

/**
 * Round-robin template counter.
 * Cycles 1 → 12 → 1 → 12 ...
 * In-memory; resets on server restart but that's fine — 
 * the goal is variety, not strict sequencing.
 */
let _templateCounter = 0;

export function getNextTemplate(): number {
  _templateCounter = (_templateCounter % 12) + 1;
  return _templateCounter;
}

/**
 * Category → best-fit templates mapping.
 * Each category has 3-4 templates that work especially well for it.
 * The generator will prefer these but still rotate through all 12.
 */
export const CATEGORY_TEMPLATE_AFFINITY: Record<string, number[]> = {
  market_trends: [3, 5, 7, 8],       // Data Brief, Situation Room, Strategic Analysis, Flash Alert
  character_spotlight: [2, 1, 4, 12], // Personnel Dossier, Field Report, Intercepted Transmission, Command Briefing
  grading_guide: [10, 3, 9, 7],      // Technical Schematic, Data Brief, After-Action Report, Strategic Analysis
  set_breakdown: [6, 3, 10, 5],      // Asset Gallery, Data Brief, Technical Schematic, Situation Room
  investment_strategy: [7, 3, 5, 12], // Strategic Analysis, Data Brief, Situation Room, Command Briefing
  collecting_tips: [9, 1, 11, 10],   // After-Action Report, Field Report, Surveillance Log, Technical Schematic
  nlf_news: [8, 4, 12, 1],           // Flash Alert, Intercepted Transmission, Command Briefing, Field Report
  behind_the_scenes: [11, 1, 9, 6],  // Surveillance Log, Field Report, After-Action Report, Asset Gallery
  card_history: [4, 11, 2, 9],       // Intercepted Transmission, Surveillance Log, Personnel Dossier, After-Action Report
  sports_crossover: [5, 7, 3, 12],   // Situation Room, Strategic Analysis, Data Brief, Command Briefing
};

// ==================== LAYOUT DATA GENERATION PROMPT ====================

/**
 * Template-specific instructions for the LLM to generate layoutData.
 * Each template needs different fields populated.
 */
export function getLayoutDataPrompt(templateNumber: number): string {
  const base = `\n\nLAYOUT DATA — You MUST also return a "layoutData" JSON object with the following fields for Template ${templateNumber} (${TEMPLATE_NAMES[templateNumber]}):`;

  switch (templateNumber) {
    case 1: // Field Report — image-left / text-right
      return base + `
- "pullQuote": A powerful 1-2 sentence quote from the article that captures the key insight
- "factBox": A brief "Did You Know?" fact related to the topic (1-2 sentences)
- "stats": An array of 3-4 stat objects, each with "label" (string), "value" (number), and optional "suffix" (string like "%", "+", "x"). Example: [{"label":"Fanbase Size","value":300,"suffix":"M+"},{"label":"Price Growth","value":47,"suffix":"%"}]
- "heatLevel": One of "blazing", "hot", "rising", or "new" based on topic urgency`;

    case 2: // Personnel Dossier — character profile
      return base + `
- "profile": An object with: "name" (character/subject name), "title" (role like "The Web-Slinger" or "Card Market Analyst"), "stats" (array of {"label":"...","value":"..."} pairs, 4-6 items like card count, first appearance year, avg grade, etc.), "bio" (2-3 sentence bio), "status" (like "Active" or "Legendary")
- "pullQuote": A memorable quote about the character/subject
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case 3: // Data Brief — stats-heavy
      return base + `
- "stats": An array of 4-6 stat objects with "label", "value" (number), "suffix" (optional), and "color" (one of "green", "teal", "gold", "purple")
- "comparison": An object with "title" (string), "headers" (array of 2 strings for column headers), and "rows" (array of {"label":"...","col1":"...","col2":"..."} objects, 4-6 rows)
- "factBox": A data-driven insight (1-2 sentences)
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case 4: // Intercepted Transmission — timeline
      return base + `
- "timeline": An array of 4-6 timeline entries, each with "date" (string like "2024 Q1"), "title" (string), "description" (1 sentence)
- "alertLevel": One of "low", "medium", "high", or "critical"
- "pullQuote": A dramatic quote fitting the "intercepted intel" theme
- "subtitle": A subtitle like "CLASSIFIED INTEL REPORT" or "DECODED TRANSMISSION"`;

    case 5: // Situation Room — dashboard feel
      return base + `
- "stats": An array of 4 stat objects with "label", "value" (number), "suffix", "color"
- "comparison": A comparison table with "title", "headers" [2 strings], "rows" [4-5 objects with "label", "col1", "col2"]
- "pullQuote": An authoritative assessment quote
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case 6: // Asset Gallery — visual showcase
      return base + `
- "gallery": An array of 3-4 gallery items, each with "url" (use the featured image URL or leave empty string — we'll use placeholder), "alt" (descriptive alt text), "caption" (1 sentence caption)
- "pullQuote": A quote about the visual appeal or significance
- "factBox": A fun fact about the cards/set being showcased`;

    case 7: // Strategic Analysis — two-column comparison
      return base + `
- "comparison": An object with "title", "headers" [2 strings], "rows" [5-7 objects with "label", "col1", "col2"]
- "stats": An array of 3-4 stat objects
- "pullQuote": An analytical insight quote
- "factBox": A strategic takeaway (1-2 sentences)`;

    case 8: // Flash Alert — breaking news
      return base + `
- "alertLevel": One of "low", "medium", "high", or "critical" based on urgency
- "stats": An array of 2-3 stat objects for quick-hit data
- "pullQuote": The most urgent/important takeaway
- "subtitle": A brief alert subtitle like "MARKET MOVEMENT DETECTED" or "BREAKING: NEW SET ANNOUNCED"`;

    case 9: // After-Action Report — structured debrief
      return base + `
- "stats": An array of 3-4 stat objects summarizing outcomes
- "timeline": An array of 3-5 timeline entries showing the sequence of events
- "pullQuote": A lessons-learned quote
- "factBox": A key takeaway or recommendation`;

    case 10: // Technical Schematic — detailed breakdown
      return base + `
- "toc": An array of 4-6 table of contents items, each with "id" (kebab-case string), "title" (section title), "level" (1 or 2)
- "stats": An array of 3-4 technical stat objects
- "factBox": A technical detail or specification
- "comparison": Optional comparison table if relevant`;

    case 11: // Surveillance Log — chronological entries
      return base + `
- "timeline": An array of 5-8 timeline entries in chronological order, each with "date", "title", "description"
- "pullQuote": An observation or pattern noticed
- "heatLevel": One of "blazing", "hot", "rising", or "new"
- "subtitle": A log identifier like "SURVEILLANCE LOG #NLF-2026-042"`;

    case 12: // Command Briefing — executive summary
      return base + `
- "stats": An array of 4 stat objects for the executive overview
- "pullQuote": The commander's key directive or insight
- "factBox": A mission-critical fact
- "comparison": A comparison table if the topic involves comparing options
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    default:
      return base + `
- "pullQuote": A powerful quote from the article
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;
  }
}

// ==================== EXTENDED JSON SCHEMA FOR LAYOUT DATA ====================

export const BLOG_JSON_SCHEMA_WITH_LAYOUT = {
  type: "json_schema" as const,
  json_schema: {
    name: "blog_article_with_layout",
    strict: true,
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        slug: { type: "string" },
        excerpt: { type: "string" },
        contentMarkdown: { type: "string" },
        metaDescription: { type: "string" },
        focusKeyword: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        imagePrompt: { type: "string" },
        layoutData: {
          type: "object",
          description: "Template-specific layout data",
          properties: {
            pullQuote: { type: "string" },
            factBox: { type: "string" },
            subtitle: { type: "string" },
            heatLevel: { type: "string" },
            alertLevel: { type: "string" },
            stats: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  value: { type: "number" },
                  suffix: { type: "string" },
                  color: { type: "string" },
                },
                required: ["label", "value"],
                additionalProperties: false,
              },
            },
            timeline: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                },
                required: ["date", "title", "description"],
                additionalProperties: false,
              },
            },
            gallery: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  alt: { type: "string" },
                  caption: { type: "string" },
                },
                required: ["url", "alt"],
                additionalProperties: false,
              },
            },
            toc: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  level: { type: "number" },
                },
                required: ["id", "title", "level"],
                additionalProperties: false,
              },
            },
            comparison: {
              type: "object",
              properties: {
                title: { type: "string" },
                headers: {
                  type: "array",
                  items: { type: "string" },
                },
                rows: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      col1: { type: "string" },
                      col2: { type: "string" },
                    },
                    required: ["label", "col1", "col2"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["title", "headers", "rows"],
              additionalProperties: false,
            },
            profile: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                imageUrl: { type: "string" },
                bio: { type: "string" },
                status: { type: "string" },
                stats: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      value: { type: "string" },
                    },
                    required: ["label", "value"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["name", "title", "bio", "stats"],
              additionalProperties: false,
            },
          },
          required: [],
          additionalProperties: false,
        },
      },
      required: ["title", "slug", "excerpt", "contentMarkdown", "metaDescription", "focusKeyword", "tags", "imagePrompt", "layoutData"],
      additionalProperties: false,
    },
  },
};
