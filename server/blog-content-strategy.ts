/**
 * NLF Blog Content Strategy — Core Talking Points & AI Generation Prompts
 * 
 * This file centralizes the content strategy so all generation endpoints
 * (admin single, admin bulk, auto-scheduler) use the same messaging.
 */

// ==================== MASTER SYSTEM PROMPT ====================

export const NLF_BLOG_SYSTEM_PROMPT = `You are the voice of Northland Legendary Finds (NLF) — a passionate Marvel collector from Minnesota who has been in the hobby for years. You write like a real person, not a content machine. Think of yourself as Benicio del Toro's character The Collector — you've seen everything, you know what's rare, you have strong opinions, and you share them with your community like you're texting a friend who gets it.

THE GOLDEN RULE OF WRITING:
Write like a human being wrote this. Not a journalist. Not a corporation. A collector who happens to know a lot and loves talking about it. If someone reads this and thinks "an AI wrote this" — you failed. If they think "this person really knows their stuff and I want to read more" — you nailed it.

VOICE RULES — MANDATORY:
1. Short sentences. Sometimes one word. Done.
2. Start sentences with "And" or "But" — real people do that.
3. State opinions directly. "This card is undervalued. Period." Not "It could be argued that..."
4. Use casual asides — (trust me on this one) or (seriously, look it up)
5. Ask rhetorical questions — "Why does this matter? Because..."
6. Vary paragraph length wildly — one line, then four lines, then one line again.
7. Use em dashes for punchy emphasis — like this — when you want to land a point.
8. Never use these AI tells: "It is worth noting," "In conclusion," "This comprehensive guide," "Delve into," "It's important to understand," "Fascinating," or any perfectly parallel list structure.
9. Be slightly controversial when the topic allows it. Opinions get shared. Bland facts don't.
10. Write the opening line like it needs to stop someone mid-scroll on Facebook. Bold. Surprising. Or a question they can't ignore.

CONTENT PILLARS — NLF covers ALL of these:
- Marvel movie news and hot takes (MCU releases, casting, trailers)
- Marvel trading cards — Topps sets, chase cards, what's heating up
- Disney Parks — Marvel rides, Avengers Campus, what's coming
- Disney+ — most-watched Marvel series, rankings, hidden gems
- Best MCU actors — rankings, hot takes, who's underrated
- Kids and Marvel — toys, costumes, what kids actually love
- Comics — the ones people actually read and collect
- The collector community — what's trending, what to watch
- The generational story — from grandpa to grandson, Marvel connects everyone

CRITICAL RULES — MUST FOLLOW:
1. ONLY reference TOPPS Marvel products. Topps is the ONLY officially licensed Marvel card producer. NEVER mention Fleer, Upper Deck, SkyBox, Impel, or any other card manufacturer by name. If discussing vintage/historical cards, refer to them generically as "classic Marvel sets" or "vintage Marvel cards" without naming non-Topps companies.
2. Push the TOPPS LICENSING ADVANTAGE: Topps holds the exclusive Marvel license. Unlicensed products from other companies will struggle long-term. Licensed = legitimacy = value retention. This is a massive competitive moat.
3. NEVER include specific dollar amounts or investment return numbers in articles. Speak in relative terms ("significant appreciation," "strong value growth," "outperforming") rather than exact prices.
4. NEVER use DC characters — no Batman, Superman, Wonder Woman, or any DC IP. Marvel only.
5. Every article must have a SHAREABLE MOMENT — one stat, quote, or fact so good that someone wants to screenshot it and send it to a friend.

CORE TALKING POINTS — Weave these naturally into every article:

A) MARVEL IS GENERATIONAL. POKEMON IS NOT.
Pokemon is a game. Marvel is a religion passed from grandfather to grandson. Think about what Marvel actually is — theme park rides your kids beg to go on, clothes they wear to school, toys they actually play with, movies the whole family sees together, and Disney+ shows you watch every week. No other IP on earth touches every generation like this. Logan Paul made Pokemon cool again with one purchase. What happens when an A-list Marvel actor wears a Doctor Doom card around their neck?

B) THE FULL MARVEL ECOSYSTEM
Parks. Movies. Disney+. Comics. Toys. Clothes. Cards. Marvel doesn't just have fans — it has a lifestyle. And Topps is the only company licensed to put that lifestyle in a cardboard rectangle.

C) THE GREAT MIGRATION — New collectors are flooding into Marvel cards from:
- COMIC BOOK COLLECTORS discovering trading cards as a natural extension of their passion
- POKÉMON COLLECTORS hedging their portfolio — more supply = diluted value for Pokémon, making Marvel cards a smarter hedge
- SPORTS CARD COLLECTORS getting in because they can relate to their kids' love of Marvel. Parents bond with kids over cards. It's a family bridge.

D) MCU CONTENT CALENDAR — USE THESE HOOKS:
- WONDER MAN SERIES on Disney+ — new character interest driving card demand
- SPIDER-MAN: BRAND NEW DAY — the most trailer views in history, massive mainstream hype
- AVENGERS: DOOMSDAY — Doctor Doom / Robert Downey Jr. return, Doom card values surging
- AVENGERS: ENDGAME RE-RELEASE (September) — nostalgia wave = renewed interest in classic Avengers cards
- THE FANTASTIC FOUR: FIRST STEPS — bringing Marvel's first family to the MCU
- Avengers: Doomsday will dethrone Avatar. Endgame will reclaim the crown first. Then Doomsday takes it all.

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
- The Rant — passionate, first-person, stream of consciousness with facts woven in

LAYOUT CONTENT RULES — Write for visual-first templates:
- Keep paragraphs SHORT — 2-3 sentences max per paragraph
- Every major section should have a STAT CALLOUT or PULL QUOTE that can be displayed large
- Include at least one NUMBERED LIST or COMPARISON in every article
- Write section headers that are punchy and shareable, not generic
- The article should be scannable — someone should get the point just from reading the headers and pull quotes

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
- Sound like a real collector wrote them — not a content agency
- Include a compelling meta description (max 160 chars) that reads like a human teaser, not a keyword list
- Open with a line that would stop someone mid-scroll on Facebook
- End with a call-to-action that feels natural, not corporate
- Target the focus keyword naturally throughout — never keyword-stuffed
- Include at least one SHAREABLE MOMENT per article (a stat, quote, or fact worth screenshotting)
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

  // ── NEW EXPANDED CATEGORIES (June 2026) ─────────────────────────────────────

  disney_parks: [
    "Avengers Campus at Disneyland: the complete guide for Marvel fans in 2026",
    "WEB SLINGERS Spider-Man Adventure: why it's the best Marvel theme park attraction ever built",
    "Guardians of the Galaxy Cosmic Rewind: the ride that changed Disney Parks forever",
    "Is Disney building a new Marvel ride? Everything we know about upcoming MCU attractions",
    "The Collector's Warehouse at Disneyland: how Benicio del Toro's character inspired a Marvel experience",
    "Avengers Campus vs Universal's Marvel Experience: which park wins for Marvel fans?",
    "How Disney Parks are driving the next generation of Marvel card collectors",
    "The best Marvel merchandise at Disney Parks that doubles as collectibles",
    "Disney's Marvel expansion plans: every confirmed and rumored attraction coming 2026-2030",
    "How the Guardians of the Galaxy ride at EPCOT connects to the card market",
  ],

  disney_plus: [
    "The most-watched Marvel series on Disney+ and what they mean for card values",
    "WandaVision effect: how a Disney+ series created one of Marvel's hottest card markets",
    "Loki Season 2 and the multiverse: which cards spiked after the finale",
    "What to watch on Marvel Disney+ in order: the complete collector's guide",
    "The top 5 Marvel Disney+ series ranked by card market impact",
    "Daredevil Born Again on Disney+: which cards to collect before the next season",
    "Wonder Man Disney+ series: the complete guide to collecting before it drops",
    "Secret Invasion aftermath: which Nick Fury cards are worth collecting now",
    "Ms. Marvel and the new generation: why Kamala Khan cards are a long-term hold",
    "The Hawkeye effect: how Kate Bishop cards became one of 2025's best performers",
    "Agatha All Along: which Scarlet Witch and Agatha cards to own before Season 2",
  ],

  best_actors: [
    "The 10 best actors in Marvel MCU history ranked by performance and card value",
    "Robert Downey Jr. as Iron Man: why his cards are the blue-chip investment of the MCU",
    "Chris Evans as Captain America: the complete guide to collecting his Topps Marvel cards",
    "Benedict Cumberbatch as Doctor Strange: actor profile and card cross-reference guide",
    "Tom Holland as Spider-Man: why his cards are the most popular with younger collectors",
    "Chadwick Boseman as Black Panther: the legacy collection every fan should own",
    "Scarlett Johansson as Black Widow: the complete Topps Marvel card guide",
    "Paul Rudd as Ant-Man: underrated actor, undervalued cards — the hidden gem of the MCU",
    "Chris Hemsworth as Thor: which Thor cards have the best long-term potential",
    "The best MCU villain actors and which of their cards are worth collecting",
    "Brie Larson as Captain Marvel: the complete card collecting guide for 2026",
  ],

  kids_marvel: [
    "What kids love most about Marvel in 2026: the characters driving the next generation",
    "Why Spider-Man is every kid's first Marvel hero — and first Marvel card",
    "The best Marvel characters for kids and which Topps cards to start their collection",
    "How to start a Marvel card collection with your kids: a parent's complete guide",
    "Marvel and kids: why the MCU is creating the next generation of card collectors",
    "The top 5 Marvel characters kids love most and their card market impact",
    "Ms. Marvel, Moon Knight, and the new heroes kids are obsessed with",
    "Why Marvel Snap is turning kids into Marvel card collectors",
    "The best Marvel movies for kids to watch before starting a card collection",
    "How Marvel's animated series on Disney+ is creating young collectors",
  ],

  comics_spotlight: [
    "The 10 most loved Marvel comics of all time and their card market connection",
    "Amazing Spider-Man #1 (1963): the comic that started it all and what it means for collectors",
    "The Infinity Gauntlet comic series: why it's the most important Marvel story ever told",
    "Civil War comics vs MCU: which version created more valuable cards?",
    "House of M: the comic that changed Marvel forever and its card market legacy",
    "The best X-Men comics to read before collecting MCU X-Men cards",
    "Secret Invasion comics: the original story and how it compares to the Disney+ series",
    "Why the original Guardians of the Galaxy comics are essential reading for card collectors",
    "The best Doctor Strange comics and which cards they inspired in the Topps Marvel sets",
    "From comic page to card slab: how Marvel's greatest stories become collectible art",
    "The most valuable first appearance comics and their corresponding Topps Marvel cards",
  ],

  card_interest: [
    "The most searched Marvel cards on eBay in 2026 and what collectors are really after",
    "Which Marvel cards are people buying most right now: the complete market breakdown",
    "The top 10 most wanted Topps Marvel cards among serious collectors in 2026",
    "Spider-Man cards dominate: why Peter Parker is the most collected character in the hobby",
    "Why Iron Man cards remain the most sought-after in the entire Topps Marvel catalog",
    "The hottest Marvel chase cards of 2026 and how to find them",
    "What makes a Marvel card truly desirable: the collector psychology behind demand",
    "Autograph cards vs base cards: what collectors actually want in 2026",
    "The most underrated Marvel cards that collectors are sleeping on right now",
    "From casual fan to serious collector: what cards people buy at every stage",
    "Why numbered parallels are what every Marvel card collector really wants",
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
  // New expanded categories
  disney_parks: "Disney Parks & Marvel Rides",
  disney_plus: "Disney+ Marvel Series & Most Watched",
  best_actors: "Best MCU Actors & Character Profiles",
  kids_marvel: "What Kids Love in Marvel",
  comics_spotlight: "Marvel Comics People Love",
  card_interest: "What Cards People Are Most Interested In",
};

// ==================== 9-TEMPLATE ROTATION ====================

/** The 9 active visual templates in rotation order */
export const ROTATION_TEMPLATE_KEYS = [
  "classic",
  "magazine",
  "spotlight",
  "timeline",
  "listicle",
  "cinematic",
  "dossier",
  "comic_strip",
  "disney_experience",
] as const;

export type RotationTemplateKey = typeof ROTATION_TEMPLATE_KEYS[number];

export const TEMPLATE_DISPLAY_NAMES: Record<RotationTemplateKey, string> = {
  classic: "Clean Informational",
  magazine: "Magazine Spread",
  spotlight: "Spotlight Explainer",
  timeline: "Timeline Countdown",
  listicle: "Ranked Countdown",
  cinematic: "Cinematic",
  dossier: "Dossier / Intel File",
  comic_strip: "Comic Strip",
  disney_experience: "Disney Experience",
};

// Keep legacy TEMPLATE_NAMES for any code that still references it by number
export const TEMPLATE_NAMES: Record<number, string> = {
  1: "Clean Informational",
  2: "Magazine Spread",
  3: "Spotlight Explainer",
  4: "Timeline Countdown",
  5: "Ranked Countdown",
  6: "Cinematic",
  7: "Dossier / Intel File",
  8: "Comic Strip",
  9: "Disney Experience",
};

/**
 * Round-robin template counter.
 * Cycles 0 → 8 → 0 → 8 (9 templates)
 * In-memory; resets on server restart — goal is variety, not strict sequencing.
 */
let _templateCounter = -1;

export function getNextTemplate(): number {
  _templateCounter = (_templateCounter + 1) % 9;
  return _templateCounter;
}

/** Returns the template key string for the next rotation slot */
export function getNextTemplateKey(): RotationTemplateKey {
  return ROTATION_TEMPLATE_KEYS[getNextTemplate()];
}

/**
 * Category → best-fit template keys mapping.
 * Each category has 3-4 templates that work especially well for it.
 */
export const CATEGORY_TEMPLATE_AFFINITY: Record<string, RotationTemplateKey[]> = {
  market_trends:      ["timeline", "listicle", "classic", "cinematic"],
  character_spotlight:["spotlight", "dossier", "magazine", "comic_strip"],
  grading_guide:      ["classic", "spotlight", "timeline", "listicle"],
  set_breakdown:      ["magazine", "listicle", "classic", "spotlight"],
  investment_strategy:["dossier", "timeline", "classic", "cinematic"],
  collecting_tips:    ["classic", "listicle", "spotlight", "comic_strip"],
  nlf_news:           ["cinematic", "magazine", "dossier", "classic"],
  behind_the_scenes:  ["dossier", "classic", "magazine", "cinematic"],
  card_history:       ["timeline", "dossier", "magazine", "comic_strip"],
  sports_crossover:   ["listicle", "classic", "spotlight", "cinematic"],
  disney_parks:       ["disney_experience", "magazine", "cinematic", "listicle"],
  disney_plus:        ["disney_experience", "spotlight", "timeline", "classic"],
  best_actors:        ["spotlight", "dossier", "magazine", "comic_strip"],
  kids_marvel:        ["disney_experience", "comic_strip", "listicle", "classic"],
  comics_spotlight:   ["comic_strip", "dossier", "timeline", "magazine"],
  card_interest:      ["listicle", "classic", "spotlight", "cinematic"],
};

// ==================== LAYOUT DATA GENERATION PROMPT ====================

/**
 * Template-specific instructions for the LLM to generate layoutData.
 * Each new visual template needs specific fields populated.
 */
export function getLayoutDataPrompt(templateKey: RotationTemplateKey): string {
  const base = `\n\nLAYOUT DATA — You MUST also return a "layoutData" JSON object with the following fields for the "${templateKey}" (${TEMPLATE_DISPLAY_NAMES[templateKey]}) template:`;

  switch (templateKey) {
    case "classic": // Clean Informational — editorial serif layout
      return base + `
- "pullQuote": A powerful 1-2 sentence quote from the article that captures the key insight
- "factBox": A brief "Did You Know?" fact related to the topic (1-2 sentences)
- "stats": An array of 3-4 stat objects, each with "label" (string), "value" (number), and optional "suffix" (string like "%", "+", "x"). Example: [{"label":"Fanbase Size","value":300,"suffix":"M+"},{"label":"Price Growth","value":47,"suffix":"%"}]
- "heatLevel": One of "blazing", "hot", "rising", or "new" based on topic urgency`;

    case "magazine": // Magazine Spread — asymmetric hero, two-column
      return base + `
- "pullQuote": A bold magazine-style pull quote (1-2 punchy sentences, could be a stat or opinion)
- "stats": An array of 3-4 stat objects with "label", "value" (number), "suffix" (optional)
- "comparison": An object with "title", "headers" [2 strings], "rows" [4-5 objects with "label", "col1", "col2"]
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case "spotlight": // Spotlight Explainer — TOC rail, key-facts chips
      return base + `
- "toc": An array of 4-6 table of contents items, each with "id" (kebab-case), "title" (section title), "level" (1 or 2)
- "keyFacts": An array of 3-5 short fact strings (each under 15 words) to display as chips at the top
- "pullQuote": A memorable expert-style quote from the article
- "stats": An array of 3-4 stat objects with "label", "value" (number), "suffix" (optional)
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case "timeline": // Timeline Countdown — mission clock, horizontal node rail
      return base + `
- "timeline": An array of 4-6 timeline entries, each with "date" (string like "2024 Q1" or "May 2026"), "title" (string), "description" (1 sentence)
- "pullQuote": A dramatic quote that fits the countdown/mission theme
- "stats": An array of 3-4 stat objects with "label", "value" (number), "suffix" (optional)
- "heatLevel": One of "blazing", "hot", "rising", or "new"
- "subtitle": A mission-style subtitle like "T-MINUS 60 DAYS" or "PHASE 3 INITIATED"`;

    case "listicle": // Ranked Countdown — split image/text rank cards
      return base + `
- "rankItems": An array of 5-7 ranked items, each with "rank" (number 1-7), "title" (string), "description" (2-3 sentences), "stat" (a single impressive number or short value like "$2,400" or "#1 searched")
- "pullQuote": The most shareable takeaway from the list
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case "cinematic": // Cinematic — letterbox hero, scene-by-scene
      return base + `
- "pullQuote": A cinematic, dramatic quote (think movie trailer voiceover energy)
- "scenes": An array of 2-3 scene objects, each with "heading" (string like "ACT I: THE SETUP"), "body" (2-3 sentences)
- "stats": An array of 2-3 stat objects with "label", "value" (number), "suffix" (optional)
- "heatLevel": One of "blazing", "hot", "rising", or "new"
- "subtitle": A cinematic tagline like "THE COLLECTOR'S ORIGIN STORY" or "WHEN THE MARKET CHANGED FOREVER"`;

    case "dossier": // Dossier / Intel File — classified header, S.H.I.E.L.D. style
      return base + `
- "profile": An object with: "name" (subject name), "title" (role/classification like "PRIORITY ASSET" or "MARKET INTELLIGENCE"), "stats" (array of {"label":"...","value":"..."} pairs, 4-6 items), "bio" (2-3 sentence intelligence summary), "status" (like "ACTIVE", "CLASSIFIED", or "CONFIRMED")
- "pullQuote": An intel-style quote (authoritative, factual, slightly ominous)
- "timeline": An array of 3-4 timeline entries with "date", "title", "description"
- "heatLevel": One of "blazing", "hot", "rising", or "new"`;

    case "comic_strip": // Comic Strip — panel layout, speech bubbles
      return base + `
- "pullQuote": A punchy comic-book style quote (could be a character speaking or a bold caption)
- "panels": An array of 3-4 panel objects, each with "heading" (panel title in caps like "MEANWHILE..."), "body" (2-3 sentences in comic narration style)
- "stats": An array of 2-3 stat objects with "label", "value" (number), "suffix" (optional)
- "heatLevel": One of "blazing", "hot", "rising", or "new"
- "issueLabel": A comic issue label like "ISSUE #42" or "SPECIAL EDITION"`;

    case "disney_experience": // Disney Experience — postcard mosaic, park-brochure style
      return base + `
- "pullQuote": A warm, enthusiastic quote that captures the magic/excitement of the topic
- "highlights": An array of 3-5 highlight strings (each under 20 words) — the best moments or facts to feature
- "stats": An array of 3-4 stat objects with "label", "value" (number), "suffix" (optional)
- "heatLevel": One of "blazing", "hot", "rising", or "new"
- "subtitle": A Disney-style subtitle like "THE MAGIC IS REAL" or "YOUR NEXT ADVENTURE AWAITS"`;

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
