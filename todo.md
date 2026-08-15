# NLF E-Commerce Store Build

## LeBron James × Doctor Doom Comparison Article
- [x] Research the dominant-but-divisive comparison angle and supporting sources
- [x] Generate a featured image and unique inline images for the article
- [x] Write and publish the LeBron James and Doctor Doom comparison article using the next template in rotation
- [x] Verify integrity and save the article checkpoint
- [x] Reframe the LeBron and Doctor Doom feature image to include both full figures without cutoffs
- [x] Fix portrait-image cropping in the dossier template so full figures remain visible
- [x] Urgently validate the live dossier article render after removing the forced landscape crop
- [x] Add and run a regression test for uncropped dossier portrait images

## Shohei Ohtani × Captain America Follow-Up Article
- [ ] Research Ohtani's two-way achievements and the Captain America comparison angle
- [ ] Generate a featured image and unique inline images for the article
- [ ] Write and publish the Ohtani and Captain America comparison article using the next template in rotation
- [ ] Verify integrity and save the article checkpoint

## Phase 1: Research
- [x] Study hitparade.com design patterns
- [x] Study giantsportscards.com design patterns
- [x] Document key design elements to replicate

## Phase 2: Shopify Setup
- [ ] Create "NLF Variant" (Marvel) product in Shopify - $100, 500 qty
- [ ] Create "Shadows of the Force" (Star Wars) product in Shopify - $100, 500 qty
- [ ] Upload pack image to both products
- [ ] Get variant IDs and checkout URLs

## Phase 3: Assets
- [x] Upload pack image as webdev static asset
- [x] Generate hero/banner images for storefront
- [x] Generate category images (Marvel, Star Wars)

## Phase 4: Frontend Build
- [x] Build Home page with hero, featured products, trust badges
- [x] Build Products/Shop page with product grid
- [x] Build Product Detail page with buy button
- [x] Build About page
- [x] Update navigation (Home, Shop, About)
- [x] Keep Coming Soon / countdown as pre-launch gate
- [x] Wire Buy Now buttons to Shopify checkout URLs
- [x] Mobile responsive design

## Phase 5: Policy Pages
- [x] Build Shipping page with US zone map
- [x] Build Refund Policy page (all sales final)
- [x] Update FAQ page with shipping/returns sections

## Phase 6: Checklist & Pull Tracker System (NEW)
- [x] Design database schema for products, checklists, pulls, shows
- [x] Create database tables and push migrations
- [x] Build admin API routes for managing checklists
- [x] Build admin dashboard for checklist management
- [x] Build admin pull logging interface (for use during live streams)
- [x] Build public checklist pages showing what CAN be pulled
- [x] Build public pull tracker showing what WAS pulled (with dates/shows)
- [x] Build Whatnot section with exclusive live stream repacks
- [x] Build show schedule page
- [x] Integrate checklists into product pages
- [x] Add checklist highlights to homepage
- [x] Write tests for checklist API routes

## Phase 7: Test & Deploy
- [ ] Test all pages and navigation
- [ ] Verify Buy Now links work
- [ ] Save checkpoint
- [ ] Deliver to user

## Misc Updates
- [x] Update Whatnot store URL to https://www.whatnot.com/user/northlandfinds
- [x] Build dedicated 500-pack Marvel Whatnot checklist page with Top Hits / Middle of Pack / Low Floor tiers
- [x] Add CSV bulk import API for checklist items (upload spreadsheet of cards)
- [x] Add CSV bulk import API for pulls (upload spreadsheet of hits)
- [x] Add CSV upload UI to admin dashboard for checklists and pulls
- [x] Add CSV template download buttons
- [x] Display pulled date prominently on checklist cards ("Pulled Mar 15, 2026")

## Stripe Integration (replacing Shopify)
- [x] Add Stripe feature to project
- [x] Configure Stripe API keys (auto-configured)
- [x] Build orders database table
- [x] Build Stripe checkout session API route
- [x] Build Stripe webhook handler for payment confirmation
- [x] Update product pages with Stripe checkout buttons
- [x] Add order management to admin dashboard
- [x] Write tests for Stripe integration

## Whatnot Checklist Population
- [x] Create Whatnot-exclusive Marvel product in database
- [x] Seed 500 checklist items (Top Hits / Middle of Pack / Low Floor)
- [x] Verify Whatnot page displays the full checklist

## Inventory Management System
- [x] Design inventory database schema (cardSets, inventoryCards tables)
- [x] Create database migrations for inventory tables
- [x] Build inventory CRUD API routes (add/edit/delete cards, bulk import)
- [x] Build repack builder API routes (assign cards to repacks, auto-sync checklists)
- [x] Build admin Inventory Manager UI with search, filter, CSV import/export
- [x] Build admin Repack Builder UI (drag cards from inventory to repacks with tier assignment)
- [x] Connect inventory to existing checklist system (auto-sync when cards assigned to repacks)
- [x] Connect pull system to inventory (mark cards as pulled updates inventory)
- [x] Add inventory dashboard stats (total cards, total value, cards allocated, cards pulled)
- [x] Write tests for inventory API routes

## Card Animation Feature
- [x] Write AI video prompts for raw-to-graded card animation (for external software)
- [x] Build interactive 3D card flip animation component for website (raw → graded)
- [x] Integrate card animation into homepage

## Card Slideshow Highlight (Redesign)
- [x] Redesign card animation section into major homepage highlight
- [x] Build slideshow/carousel component with 3D flip effect (raw → graded)
- [x] Move section higher on homepage (right after stats bar)
- [x] Generate custom NLF-branded cosmic card display background
- [x] Test with Hulk card as first showcase card
- [ ] Add more cards to slideshow (waiting for user photos)

## Star Wars Repacks → Coming Soon (June 2026 / Mandalorian Movie)
- [x] Move Star Wars "Shadows of the Force" repack from active products to Coming Soon
- [x] Add June 2026 release date and Mandalorian movie tie-in messaging
- [x] Keep only Marvel NLF Variant repack as purchasable for March 13 launch
- [x] Update homepage featured repacks section (Marvel only)
- [x] Update shop page to reflect Marvel-only availability
- [x] Update Star Wars nav link / section to show Coming Soon status
- [x] Update Footer, About, Subscribe, ComingSoon pages with Star Wars June 2026 messaging
- [x] Test and save checkpoint

## Inventory & Pricing Integration
- [ ] Research and import card inventory from 2025toppsmarvelcards.com
- [ ] Research PriceCharting API for live card pricing
- [ ] Design/update database schema for card inventory with pricing
- [ ] Integrate PriceCharting API on backend for live price lookups
- [ ] Build frontend UI to display inventory with live prices
- [ ] Test and save checkpoint

## Full Card Database & Graded Inventory Integration
- [x] Scrape all 6 card sets from 2025toppsmarvelcards.com (1,709 cards)
- [x] Design database schema for sets, subsets, cards, and graded inventory
- [x] Import all set/card data into NLF database
- [x] Parse and import CGC graded cards (1,282 cards with grades)
- [x] Parse and import AGS submitted cards (851 cards, awaiting grades)
- [x] Build Set Browser page (improved version of 2025toppsmarvelcards.com)
- [x] Build Card Database page with search and set browsing
- [x] Build Graded Inventory page showing NLF's graded collection
- [x] Add grade color-coding (gold=10, silver=9.5, green=9, etc.)
- [ ] Connect cards to repack products (show which cards could be in repacks)

## Comic Book Heroes Base Set Images & Descriptions
- [x] Scrape base set card images from comicbookcard.com (150 cards)
- [ ] Write original descriptions for each base set card (not copied from other sites)
- [x] Upload card images to CDN and update database with image URLs
- [x] Update Card Database UI to show card images and descriptions
- [ ] Test and save checkpoint
- [x] Scrape base set card images from mintcomiccards.com (86 of 120 Marvel Mint cards)
- [ ] Write original descriptions for each Marvel Mint base set card

## Card Database SEO & Image Optimization
- [x] Download and compress Comic Book Heroes card images (WebP, lazy load)
- [x] Use generic character placeholders for sets without card images (Hulk comic art)
- [ ] Write original descriptions for all 1,709 cards (not copied from other sites)
- [x] Simple CSS-only card flip on click (front/back with rotate icon)
- [x] SEO optimization (meta tags, semantic HTML, alt text on all images)
- [x] Image optimization (WebP, ~14KB avg, lazy loading with IntersectionObserver)
- [x] Update Card Database UI with images, descriptions, and card flip
- [ ] Test SEO and page load performance

## Character-Specific Card Images (Chrome + CBH)
- [ ] Upload 200 Chrome character images to CDN (compress to WebP)
- [ ] Upload 148 CBH character images to CDN (compress to WebP)
- [ ] Update Chrome cards (setId=1) imageUrl in database with character-specific images
- [ ] Update CBH cards (setId=2) imageUrl in database with character-specific images
- [ ] Verify images display correctly on Card Database page
- [ ] Save checkpoint

## Additional Character & Banner Images Integration
- [ ] Compress and upload 8 individual character team images (Captain America, Thanos, Star-Lord, Doctor Doom, Cyclops, Galactus, Magneto, Reed Richards) to CDN
- [ ] Compress and upload 3 banner images (heroes, leaders, villains) to CDN
- [ ] Integrate banner images into homepage sections
- [ ] Add banner images as card database set headers
- [ ] Assign character team images to subset/insert cards in Chrome set

## eBay Browse API Price Comps Integration
- [ ] Set up eBay API credentials (Client ID, Sandbox ID, Sandbox Secret)
- [ ] Build eBay OAuth token acquisition (client credentials grant)
- [ ] Build eBay Browse API search endpoint for sold listings
- [ ] Build price aggregation logic (low/avg/high from recent sold listings)
- [ ] Build /admin/ebay-comps page with card name search
- [ ] Add grade filter (CGC 10, 9.5, 9, 8.5, etc.) to search
- [ ] Display price summary table showing low/avg/high
- [ ] Display individual sold listing results with prices and dates
- [ ] Write tests for eBay API routes
- [ ] Complete CBH image database updates (148 cards)

## eBay Integration (Skill-based)
- [ ] Read legendary-card-shop skill for eBay integration guidance
- [ ] Set up eBay credentials (EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_SANDBOX_*, EBAY_VERIFICATION_TOKEN, EBAY_DELETION_ENDPOINT_URL)
- [ ] Build eBay OAuth token helper (client credentials grant)
- [ ] Build Finding API findCompletedItems for sold price comps
- [ ] Build Browse API fallback for active listing comps
- [ ] Build /api/ebay/account-deletion GET challenge endpoint
- [ ] Build /api/ebay/account-deletion POST handler
- [ ] Build /admin/ebay-comps page with card name search
- [ ] Add grade filter (CGC 10, 9.5, 9, 8.5, etc.)
- [ ] Display price summary (low/avg/high) and individual listings
- [ ] Write vitest tests for eBay API routes
- [ ] Register endpoint in eBay Developer Portal

## eBay Integration
- [x] Set up eBay credentials (EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_SANDBOX_*, EBAY_VERIFICATION_TOKEN, EBAY_DELETION_ENDPOINT_URL)
- [x] Build eBay OAuth token helper (client credentials grant)
- [x] Build Browse API search for active listing comps (Finding API deprecated)
- [x] Build /api/ebay/account-deletion GET challenge endpoint
- [x] Build /api/ebay/account-deletion POST handler
- [x] Add eBay tRPC procedures for comps search
- [x] Build /admin/ebay-comps page with card name search and grade filter
- [x] Display price summary (low/avg/high) and individual listings
- [x] Write vitest tests for eBay API routes
- [ ] Register endpoint in eBay Developer Portal (requires publish first)
- [ ] Update EBAY_CLIENT_SECRET with production key after keyset unlock

## Whatnot Checklist Improvements
- [x] Add placeholder images for all checklist cards on Whatnot checklist page
- [x] Build downloadable spreadsheet template for card/price uploads with image URL column
- [x] Build CSV upload system for marking cards as pulled (checkbox column to remove cards)
- [x] Add Export Checklist as CSV button to admin dashboard
- [ ] Test and save checkpoint

## Admin Dashboard eBay Comps Tab
- [x] Add eBay Price Comps tab to main admin dashboard

## Card Database Set Images
- [x] Compress and upload all 6 box images (Chrome, CBH, Mint, Sapphire, Studios, Studios Sapphire) to CDN
- [x] Update database with box image URLs for all 6 sets
- [x] Redesign /cards page set cards with box images and green background matching site theme
- [x] Add Quick Comp button to card detail pages for one-click eBay price lookup

## Shipping Page Map Improvement
- [x] Replace CSS-based US map with proper SVG map using accurate state boundaries
- [x] Keep same green/teal/purple shipping zone color scheme

## Product Launch Date Gating
- [x] Make NLF Variant product page unavailable for purchase until Friday March 13th, 2026
- [x] Show countdown or "Available March 13th" message instead of Buy Now button before launch
- [x] Ensure Buy Now button activates automatically on March 13th
- [x] Server-side checkout enforcement (blocks API calls before launch date)
- [x] Vitest test for launch date gating

## Notify Me Email Collection for Product Launch
- [x] Create launch_subscribers database table (email, product slug, timestamp)
- [x] Add tRPC route to subscribe email for a product launch
- [x] Add Notify Me button with email input on ProductDetail page (pre-launch)
- [ ] Add Notify Me CTA on ProductCard for launch-gated products
- [x] Show success confirmation after subscribing
- [x] Prevent duplicate subscriptions for same email + product
- [x] Add admin view to see collected emails (via admin.launchSubscribers.list)
- [x] Write vitest tests for the subscribe endpoint

## Spreadsheet-Style Checklist Management Sheet
- [x] Review current checklist/card schema and admin routes
- [x] Add image upload endpoint (S3) for card images
- [x] Update bulkCreate to support imageUrl field
- [x] Build spreadsheet-style checklist management page (admin)
- [x] Tab 1: Add Cards — paste/type rows with card name, set, number, parallel, tier, value, image
- [x] Tab 2: Mark Pulled — upload sheet with pulled cards, date, and stream info
- [x] Tab 3: Remove Pulled — view pulled cards and bulk-unpull/remove them
- [x] Support paste-from-spreadsheet (tab-separated) and CSV import
- [x] Add image upload per card row (S3 storage)
- [x] Add image thumbnails in the checklist public view
- [x] Write vitest tests for new/updated endpoints

## Whatnot Compliance & Transparency
- [x] Review and update checklist schema for Whatnot required fields (brand, series name, item condition, quantity)
- [x] Remove estimated value column from public checklist view (only MSRP allowed per Whatnot rules)
- [x] Add finalization statement to each checklist ("As of [date], this series has been finalized...")
- [x] Add manufacturer/brand info prominently on checklist pages
- [x] Add item condition field to checklist items (schema + admin sheet)
- [x] Create Transparency & Compliance page explaining NLF's adherence to platform rules
- [x] Add link to Transparency page in site navigation (navbar + footer)
- [x] Update admin Checklist Sheet to include compliance fields (cardCondition column)
- [x] Ensure checklist detail page shows all Whatnot-required fields (year, player/card name, variation, grade)
- [x] Add "Platform Compliant" badge and Transparency Policy link on checklist detail pages

## Card Image Thumbnails on Public Checklist
- [x] Display card image thumbnails on public checklist detail page
- [x] Show image placeholder icon when no image is uploaded
- [x] Add hover/click to enlarge image functionality (lightbox)
- [x] Ensure images load efficiently (lazy loading)

## Unified Master Spreadsheet & Live Pack Counter
- [x] Redesign admin checklist into single master spreadsheet per series
- [x] Upload all cards + images in one CSV/spreadsheet import (Add Cards tab)
- [x] Inline "pulled" checkbox with date, show name, and episode/time fields
- [x] Same list stays active until all cards pulled — unified Master Sheet tab
- [x] Add show/episode tracking table (show name, date, episode number, packs sold) — existing Shows tab
- [x] Live pack counter on product page (LivePackCounter component)
- [x] Live pack counter updates as cards are marked pulled during shows (30s auto-refresh)
- [x] Sold-out state when series is complete (keep on site, show "Sold Out" badge)
- [x] Series lifecycle: Active → Sold Out → move to next series
- [x] Admin can log packs sold per show (Pack Inventory tab + existing Shows tab)
- [x] Write vitest tests for new endpoints (78 tests passing)

## Follow-up Testing & Verification
- [x] Test pull workflow: select cards, set date/stream, mark as pulled
- [x] Verify live pack counter decrements on product page after pulls (499/500 confirmed)
- [x] Verify pulled cards show date and stream info on the Master Sheet
- [x] Fix any issues found during testing (fixed dbSlug mapping, pack decrement on bulk pull, auto-select product)
- [ ] Prepare site for publishing

## FAQ Page Update
- [x] Review and update FAQ page content for accuracy
- [x] Update repack descriptions: most include a one-touch or graded card
- [x] Align FAQ with recent features (live pack counter, transparency, checklist, Whatnot compliance)
- [x] Remove or update any outdated information (Shopify → Stripe, added one-touch/graded card info, new categories)

## FAQ Grading Companies Update
- [x] Update FAQ to mention AGS, CGC, PSA as main grading companies
- [x] Add details about grading tiers and what they mean (certification + tamper-proof case)

## Value Proposition Messaging (Floor/Middle/Ceiling)
- [x] Update FAQ answers to emphasize strong floor, better middle, healthy ceiling
- [x] Update product descriptions with value proposition messaging
- [x] Update homepage hero/features with floor/middle/ceiling messaging
- [x] Update Transparency page with value commitment language
- [x] Update About page with value proposition messaging
- [x] Update product detail page trust badges with value tier breakdown

## Marvel Mint Card Images Update (All 4 Suits + Autographs)
- [x] Upload 26 Clubs card images (13 front + 13 back) to CDN
- [x] Upload 26 Diamonds card images (13 front + 13 back) to CDN
- [x] Upload 26 Hearts card images (13 front + 13 back) to CDN
- [x] Upload 26 Spades card images (13 front + 13 back) to CDN
- [x] Map all 52 playing cards to Gambit's Deck (GD-1 to GD-52) with front/back
- [x] Map all 36 Chrome Playing Cards (2-10 per suit) with front/back
- [x] Insert 16 missing face cards (A, J, Q, K x 4 suits) into Chrome Playing Cards
- [x] Identify 30 timestamp-named photos as 15 autograph cards (front + back)
- [x] Upload 30 autograph photos to CDN
- [x] Update 15 autograph card records with front/back image URLs
- [x] Remove all Hulk placeholder images (0 remaining)
- [x] Card flip UI already built in with IntersectionObserver lazy loading
- [x] Images already optimized (~100KB avg, CDN handles compression)
- [x] Responsive grid and loading skeletons already in place

## Gold Base Cards - Replace Hulk Placeholders
- [x] Generate AI character art for 23 of 25 gold cards (Hawkeye #94 and Human Torch #98 failed safety filter)
- [x] Upload 23 gold card images to CDN
- [x] Update 23 Gold base card records with proper character art
- [ ] Hawkeye (#94) and Human Torch (#98) still need images
- [ ] Save checkpoint

## Marvel Mint Page - Suit Order Reorganization
- [x] Reorganize Gambit's Deck cards: group by suit (Clubs, Diamonds, Hearts, Spades), sort 2-Ace within each suit
- [x] Reorganize Chrome Playing Cards: same suit grouping and sort order
- [x] Display in clean 4-column layout (one column per suit) with suit headers and symbols
- [x] Test and save checkpoint

## New Pack Series (100-card and 50-card)
- [x] Create 100-card $100 pack product in database (draft status, ID 30001)
- [x] Create 50-card $100 pack product in database (draft status, ID 30002)
- [x] Add both packs to static products.ts for shop page (Coming Soon)
- [x] Test and save checkpoint

## Checklist Visibility & Duplication
- [x] Exempt /checklists, /checklist/*, /cards, /graded, /transparency routes from coming soon gate
- [x] Activate new pack products (draft → active)
- [x] Duplicate 100 checklist items from 500-pack series into both new packs (placeholder data)
- [x] Test and save checkpoint

## Pack Series Fixes
- [x] Reset 500-Pack Series pulled count to 0/500, packs remaining 500/500
- [x] Rename "100-Card Series" to "100-Pack Series", totalPacks=100, packsRemaining=100
- [x] Rename "50-Card Series" to "50-Pack Series", totalPacks=50, packsRemaining=50
- [x] Update static products.ts to match new names

## Gold Base Cards - Replace AI Art with Real Photos
- [x] Identify 25 real Gold card photos by character (all matched correctly)
- [x] Upload 25 photos to CDN
- [x] Update 25/25 Gold card database records with real photo URLs
- [x] Save checkpoint

## Master AI Character Reference List
- [x] Query all Marvel Mint characters with image status
- [x] Create master reference document for requesting AI art later (MASTER_CHARACTER_LIST.md)

## Marvel Mint Card Type Display Order
- [x] Reorder card types: Bronze (1-50), Silver (51-75), Gold (76-100), Platinum (101-120)
- [x] Update card type filter tabs to match this order
- [x] Sort cards within "All" view by type order then card number

## 50-Pack Series Cleanup
- [x] Remove 50 extra placeholder items from 50-Pack Series (had 100, now has correct 50)

## Bug Fixes
- [x] Fix React hooks ordering error in ChecklistDetail.tsx (useState called after early return)

## Pre-Launch Site Changes
- [x] Remove launch countdown page - show full site immediately (COMING_SOON_MODE = false, code preserved)
- [x] Disable product purchases until March 13th (launchDate added to all products, countdown + disabled buttons)
- [x] Home page shows products as not available for sale until March 13th (hero CTA updated)
- [x] Blur checklist card details to keep contents a surprise until launch
- [x] Blur ENTIRE checklist content (tier headers, counts, cards — everything) with "CHECKLIST HIDDEN" overlay
- [x] Keep launch/coming soon page code intact for future reuse (COMING_SOON_MODE flag in App.tsx, set to false)

## Popup Fix
- [x] Remove GoHighLevel developer instructions from email capture popup and Subscribe page
- [x] Replace gift emoji in popup with NLF logo image

## GoHighLevel API Integration
- [x] Get GHL API key from Private Integrations (NLF Website Integration created)
- [x] Store GHL API key and Location ID as secrets
- [x] Create server-side tRPC procedure for GHL contact creation (server/ghl.ts + public router)
- [x] Connect email capture popup to GHL API
- [x] Connect Subscribe page to GHL API
- [x] Test email submission flow end-to-end
- [x] Send email notification to admin@nlfservices.com for every new email form submission (via Manus notifyOwner)
- [ ] Set up GHL workflow automation for backup email notification (scheduled for tomorrow)

## Replace Hulk Placeholder Images Across All Sets (In Progress)
- [x] Audit all card sets for Hulk placeholder images (1,148 cards missing across 5 sets)
- [x] Map existing character images to correct cards (467 reused from other sets)
- [x] Generate AI art batch 1 (82 characters generated, 194 cards updated)
- [x] Upload batch 1 images to CDN and update database
- [ ] Generate AI art batch 2 (remaining ~233 unique characters) — interrupted, 478 cards still missing
- [ ] Upload batch 2 images and update database
- [ ] Verify all sets display correct character images

Current status: 1,238/1,725 cards have images (72%). Remaining: Chrome 23, Sapphire 5, Studios 329, Studios Sapphire 121

## Bug Fix: getBySlug undefined error
- [x] Fix public.products.getBySlug returning undefined for "shadows-of-the-force" product (return null instead of undefined, guard queries with dbSlug check)

## Product Image Replacement
- [x] Replace NLF Variant product image with new space/cosmic generated image
- [x] Replace Shadows of the Force product image with new generated image
- [x] Replace 100-Pack Series product image with new generated image
- [x] Replace 50-Pack Series product image with new generated image

## Remove Graded Inventory from Public Site
- [x] Remove Graded Inventory from public navigation
- [x] Remove Graded Inventory route/page from public access

## Hide Recent Pulled on Checklists
- [x] Remove/hide Recent Pulled section from public checklist pages

## Hero Image Update
- [x] Replace hero section pack image with NLF Variant product image

## Auto Card Photo Processing
- [x] Build server-side card image processor using LLM vision + sharp
- [x] Integrate auto-processing into admin card upload flow (always on)
- [x] Test with sample card photos (Wolverine stand photo, Doctor Doom flat scan)
- [x] Auto-crop to card face, remove background, place on dark themed background

## Shop Restructure — New Product Lines
- [x] Variant Series: Cosmic Drop (500 packs, $139) — available March 13th (rename from NLF Variant)
- [x] Variant Series: Chrome Edition (100 packs, $139) — available March 13th (rename from 100-Pack)
- [x] Remove old 50-Pack Series and Star Wars Shadows of the Force
- [x] The Snap Collection (100pk + 500pk) — Coming Soon
- [x] Multiverse Vault: Origins (100pk + 500pk) — Coming Soon
- [x] Multiverse Vault: Parallel Edition (100pk + 500pk) — Coming Soon
- [x] Multiverse Vault: Legendary Drop (100pk + 500pk) — Coming Soon
- [x] Update products.ts with new structure
- [x] Create/update database products (static data)
- [x] Update homepage and shop page
- [x] Generate product images for new series (Snap, Origins, Parallel, Legendary)
- [x] Save checkpoint

## Hide Whatnot from Public (Keep Shareable Link)
- [x] Remove Whatnot from main navigation
- [x] Remove Whatnot from homepage sections (none found)
- [x] Remove Whatnot from footer links
- [x] Keep /whatnot route accessible via direct URL for sharing

## Product Pages for Snap Collection & Multiverse Vault
- [ ] Ensure product detail pages handle Coming Soon products properly
- [ ] The Snap Collection product page with image and Coming Soon status
- [ ] Multiverse Vault: Origins product page with image and Coming Soon status
- [ ] Multiverse Vault: Parallel Edition product page with image and Coming Soon status
- [ ] Multiverse Vault: Legendary Drop product page with image and Coming Soon status
- [ ] Verify all product pages display correctly with images

## Launch Date Updates
- [ ] Move Variant Series: Cosmic Drop (500 packs) launch to Friday March 27th
- [ ] Keep Variant Series: Chrome Edition (100 packs) on March 13th

## Homepage Card Showcase - Real Card Photos
- [x] Process 6 real card photos for homepage showcase (resize/compress for fast loading)
- [x] Upload optimized card images to CDN
- [x] Update homepage card showcase carousel with all 6 cards (front+back): Hulk, Spider-Man, Invisible Woman, Mighty Thor, Galactus, Daredevil

## Card Showcase Updates
- [x] Remove Daredevil and Galactus from homepage card showcase carousel (keep Hulk, Spider-Man, Invisible Woman, Mighty Thor)
- [x] Fix upside-down card images on mobile (EXIF orientation issue - re-process images with orientation fix)
- [x] Simplify showcase to show front-only raw card photos (no flip to back, no graded transformation)

## Whatnot QR Code & Live Stream Promotion
- [x] Process and upload Whatnot QR code images to CDN
- [x] Redesign homepage Whatnot/live stream section with prominent QR code
- [x] Add Whatnot QR code to other key pages (Whatnot page, footer, etc.)
- [x] Test QR code display across desktop and mobile

## Grading Company References Update
- [x] Update all grading references to include AGS prominently alongside CGC, PSA, BGS
- [x] Update homepage card showcase grading text
- [x] Update About page grading references
- [x] Update Star Wars page grading references
- [x] Update eBay Comps panel with AGS grade options
- [x] Update Inventory Manager with AGS grade options
- [x] FAQ already had AGS references (no change needed)

## Card Database Image Replacement
- [x] Card images already in database from previous import (CloudFront CDN)
- [x] Set different background colors for each subset (1975, 2025, 1976)

## Era-Based Color Themes for Card Database
- [x] Add era-based color themes to CBH card database page (1975=gold/amber, 1976=blue/silver, 2025=emerald/green)
- [ ] Later: Add subset-based color themes to Marvel Mint (Bronze, Silver, Gold, Platinum)

## Card Display Fix
- [ ] Fix card database to show front of card by default (currently showing back)

## Cosmic Card Backgrounds & Skill
- [x] Download actual card image from comicbookcard.com and test composite onto cosmic background
- [x] Update FlipCard component to use cosmic era backgrounds with glow effects
- [ ] Create skill for importing card images onto cosmic backgrounds

## Remove Card Flip & Use AI Images
- [x] Remove card flip animation from all cards in Card Database - show front image only
- [x] Replace card photos (from comicbookcard.com) with AI-generated images for CBH cards (Doctor Doom #4, Wolverine #99)
- [x] Remove backImageUrl references from card display
- [x] Keep cosmic era backgrounds and glow effects on non-flipping cards
- [x] Remove 'Click cards to flip' instruction text from set header

## Launch Date Change: March 13 → March 27, 2026
- [x] Update all frontend references from March 13 to March 27
- [x] Update all backend/server references from March 13 to March 27
- [x] Update database product launch dates from March 13 to March 27
- [x] Update hero banner, announcements, countdown timers
- [x] Test and save checkpoint

## Popup Changes
- [x] Remove discount offer from email popup
- [x] Move popup to top right corner

## Update Checklists & Remaining Dates to March 27, 2026
- [x] Find all remaining March 13 references in code, checklists, and database
- [x] Update checklist pages/components with March 27 dates (ChecklistDetail.tsx pre-launch blur date + reveal message)
- [x] Update ComingSoon.tsx countdown target date to March 28 UTC
- [x] Update Shop.tsx Variant Series section dates
- [x] Update ProductDetail.tsx countdown, availability, and drops text
- [x] Verified: no remaining March 13 / 2026-03-14 references in any .ts/.tsx files
- [x] Only remaining March 13 refs are in todo.md (historical log items) — correct, no action needed
- [x] Test and save checkpoint

## Remove Coming Soon Page
- [x] Remove ComingSoon.tsx component file
- [x] Remove /coming-soon route from App.tsx (was conditional, not a route)
- [x] Remove COMING_SOON_MODE flag and all associated admin login/logout/modal logic
- [x] Simplify AppRouter to always show full site with Navigation, CartDrawer, routes, and Footer
- [x] EmailCapturePopup now always shown (was gated behind !COMING_SOON_MODE)
- [x] Removed unused imports (useState, useEffect, useLocation from App.tsx)
- [x] Test and save checkpoint

## Card Display Component (7 Themes)
- [x] Analyze reference HTML file for exact implementation details
- [x] Generate 7 space nebula background images (one per theme color)
- [x] Build CardDisplay page component with 7 switchable themes
- [x] Implement card frame with corner ornaments, shimmer strip, scanline overlay
- [x] Implement file upload with fade-in transition and remove functionality
- [x] Implement 25 floating particles color-matched to active theme
- [x] Implement theme switcher dots with hover tooltips
- [x] Add Cinzel and Crimson Text Google Fonts
- [x] Add route to App.tsx (standalone, no nav/footer)
- [x] Test all 7 themes — backgrounds switch, accents change, particles recolor
- [x] Save checkpoint

## Display Card Button + Download + Mint Themes
- [x] Add "Display Card" button to Card Database cards that opens /card-display pre-loaded with card image and matching theme
- [x] Pass card image URL and theme via URL params to /card-display
- [x] Add download button to Card Display page (canvas-based, html2canvas doesn't support OKLCH)
- [x] Add Marvel Mint subset themes to Card Database (Bronze, Silver, Gold, Platinum borders/glows)
- [x] Keep Gambit set cards unchanged (no themed borders/glows) — verified
- [x] Add "Back to Card Database" navigation button on CardDisplay
- [x] Test all features
- [x] Save checkpoint

## Replace All Remaining Card Photos with AI Character Art
- [x] Query database to identify all cards still using actual card photos (174 cards, 87 unique characters)
- [x] Generate AI character art replacements for all 87 characters (parallel generation, 87/87 success)
- [x] Upload 87 AI images to CDN and update 174 database records (0 failures)
- [x] Verify all cards in Card Database now show AI art instead of card photos
- [x] Save checkpoint

## Fix Duplicate Character Images Across Subsets
- [ ] Query all sets to find characters sharing the same image URL across different subsets
- [ ] Generate unique AI art for each duplicate instance (new rule: same character in different subsets must have unique images)
- [ ] Upload new images to CDN and update database
- [ ] Verify no duplicates remain across any set
- [ ] Save checkpoint

## Remove Hulk Placeholders + Fix Duplicates + Comic-Style Art
- [x] Find all cards using Hulk placeholder image that aren't actually Hulk
- [x] Find all duplicate images across subsets (same character, same image in different subsets)
- [x] Combine into master list of cards needing new unique images
- [x] Generate unique AI art — comic-book style versions for 2025 Topps Chrome (103/111 done, 8 failed)
- [x] Upload 103 Chrome images to CDN and update database
- [ ] Generate remaining 8 Chrome images (Silver Surfer, Colossus, 3 Nightcrawlers, 2 Ghost Riders, Scarlet Witch)
- [ ] Verify no Hulk placeholders remain on non-Hulk cards
- [ ] Verify no duplicate images within any set
- [ ] Save checkpoint

## Marvel Studios Set — MCU Actor-Inspired Art
- [x] Pull full card list for 2025 Topps Marvel Studios set (543 cards, 434 needing images)
- [x] Identify all cards needing images (NULL + duplicates + wrong character)
- [x] Generate stylized MCU actor-inspired art — batch 1: 150/150, batch 2: 21/150 (106 unique cards matched)
- [x] Upload 106 images to CDN and update database
- [ ] Generate remaining ~328 Marvel Studios cards (batch 3 still needed)
- [ ] Verify all Marvel Studios cards have unique, correct character images
- [ ] Save checkpoint

## Fix Marvel Zombies Card (Superman → Marvel Zombies)
- [x] Regenerate MZ-1 Marvel Zombies card with Zombie Captain America and Zombie Iron Man (was showing Superman - DC character)
- [x] Upload to CDN and update database
- [x] Regenerate MR-2 Wolverine Marvel Reflections card (was showing Batman - DC character)
- [x] Regenerate I-5 Daredevil Indestructible card (showing wrong character)

## Copy Chrome Images to Sapphire Set
- [x] Map Chrome card images to matching Sapphire cards by character/subset (197 matched out of 225)
- [x] Update Sapphire card imageUrl fields in database (10 batches executed)

## Comic-Book Style Artist Card Art
- [x] Generate comic-book style AI art version of Steve McNiven autograph card (artist as comic character alongside Captain America)
- [x] Assign comic artist art to Chrome AR-1 Steve McNiven card

## Image Optimization & Mobile Responsiveness
- [x] Audit current image sizes and loading performance
- [x] Add loading="lazy" and decoding="async" to all img tags across all components
- [x] Add width/height/sizes attributes to card images for layout shift prevention
- [x] Add global CSS image optimization (content-visibility, max-width, object-fit)
- [x] Tighten mobile card grid gaps (gap-2 on mobile, gap-4 on tablet, gap-6 on desktop)
- [x] Make stats grids responsive (2-col on mobile, 4-col on desktop)
- [x] Optimize Home hero section for mobile (smaller min-height, better text scaling)
- [x] Add mobile-first typography scaling
- [x] Add touch target minimum size (44px) for coarse pointers
- [x] Verify lazy loading working (only 15 images loaded on Chrome page instead of 358)
- [x] Test on mobile viewport and verify improvements
- [x] Save checkpoint

## Marvel Studios Remaining Images (Batch 2-4)
- [ ] Query remaining ~328 Marvel Studios cards needing images
- [ ] Generate MCU-inspired art batch 1 (~150 cards, starting with Iron Man characters)
- [ ] Generate MCU-inspired art batch 2 (~150 cards)
- [ ] Generate MCU-inspired art batch 3 (remaining cards)
- [ ] Upload all images to CDN and update database
- [ ] Save checkpoint

## Comprehensive SEO Implementation
- [x] Install react-helmet-async for per-page meta tag management
- [x] Build reusable SEO component (title, description, OG tags, Twitter Cards, canonical URL)
- [x] Add default OG meta tags to index.html (og:title, og:description, og:image, og:url)
- [x] Add Twitter Card meta tags to index.html
- [x] Add JSON-LD structured data: Organization schema
- [x] Add JSON-LD structured data: Product schema on product pages
- [x] Add JSON-LD structured data: BreadcrumbList on key pages
- [x] Create robots.txt in client/public
- [x] Create dynamic sitemap.xml server route with all public pages (includes 7 card sets)
- [x] Add per-page SEO to Home, Shop, About, FAQ, Shipping, Cards, Checklists, etc. (18 pages)
- [x] Add canonical URLs to prevent duplicate content
- [x] Move noscript pixel to body to fix parse5 errors
- [x] Test and save checkpoint

## FAQ Schema Integration
- [x] Wire faqJsonLd helper into FAQ page with all 31 Q&A pairs for Google rich results

## Individual Character Pages (SEO Content)
- [x] Create character_content table in database schema (characterName, slug, setId, historyMarkdown, metaDescription, keyFacts, status)
- [x] Build tRPC procedures for character page data (getCharacter, generateCharacterContent, allCharacters)
- [x] Build CharacterPage component with 1000+ word LLM-generated history, card gallery, key facts sidebar, SEO meta tags
- [x] Generate character history content via LLM on first visit (auto-triggers, cached in DB)
- [x] Build Characters index page (/characters) with search, alphabet filter, pagination (881 characters)
- [x] Add character page routes to App.tsx (/characters and /characters/:slug)
- [x] Add character pages to dynamic sitemap.xml (881 character URLs)
- [x] Link character names from Card Database grid/table views to character pages
- [x] Add Characters link to navigation bar and footer
- [x] Write vitest tests for character content endpoints (14 tests passing)
- [x] Save checkpoint

## Related Characters Section
- [x] Build backend tRPC procedure for fetching related characters (shared sets ranking)
- [x] Build getRelatedCharacters DB helper (SQL query: shared sets + card count ranking)
- [x] Build frontend RelatedCharactersSection component with 6-col card grid, images, hover effects
- [x] Link related character cards to their individual character pages
- [x] Write vitest tests for related characters endpoint (5 new tests, 19 total passing)
- [x] Test end-to-end in browser (Spider-Man → Iron Man navigation verified)
- [x] Save checkpoint

## Individual Card Detail Pages
- [x] Review card data structure and plan card detail page schema (card_detail_content table added)
- [x] Build backend DB helpers (getCardBySetAndNumber, getAdjacentCards, getSameCharacterCardsInSet, getCardDetailContentByCardId, upsertCardDetailContent, getAllCardDetailSlugs, parseParallels)
- [x] Build tRPC procedures for card detail data + LLM-generated set-specific character content (cardDetail, generateCardContent)
- [x] Build CardDetailPage component (card art, parallel breakdown with rarity colors, set-specific character story, prev/next navigation, more cards of same character)
- [x] Wire up routing (/cards/:setSlug/:cardNumber) and link card images from card database (grid view, table view, search results)
- [x] Add card detail pages to sitemap
- [x] Write vitest tests for card detail endpoints (18 tests: 12 parseParallels + 6 DB helpers)
- [x] Test end-to-end in browser (Iron Man #1 Chrome verified with all sections)
- [x] Save checkpoint

## Random Card Button
- [x] Build backend tRPC procedure (randomCard) using SQL RAND() to return a random card
- [x] Add getRandomCard DB helper to db.ts
- [x] Add Random Card shuffle icon button to navigation bar (desktop + mobile menu)
- [x] Test end-to-end in browser (3 clicks: Fisk #DD-25, Iron Man #IM-6, Agatha Harkness #6 - all different)
- [x] Save checkpoint

## Bug Fix: Wrong Hero Image on Character Pages
- [x] Investigated: Card #178 in Chrome/Sapphire has characterName='Nightcrawler' but image file is 'CHROME-178_Star-Lord' (data import mismatch)
- [x] Fixed image selection: useMemo now prefers cards whose image filename contains the character name words, falls back to first card with image
- [x] Moved useMemo before early returns to fix React hooks order error
- [x] Tested: Nightcrawler page now correctly shows CBH-129_Nightcrawler image instead of Star-Lord
- [x] Save checkpoint

## BUG: "Raw & Graded Hits" / "Our Collection" section still showing on homepage
- [ ] Remove the Raw & Graded Hits / Our Collection carousel section from Home.tsx
- [ ] Save checkpoint

## Change launch date from March 27 to April 27
- [x] Find and replace all March 27 references to April 27 across entire site
- [ ] Save checkpoint and publish

## CRITICAL: Restore all 34 deleted files from checkpoint 785d7bf
- [ ] Restore all deleted page files (CardShows, MCUIntel, MCUIntelArticle, SubscriberHub, JarvisProtocol, MatrixPortal, SubmitShow)
- [ ] Restore all deleted component files (ArticleManager, DoomsdaySection, HoneypotField, MarvelousTop5, Top5Manager, USMapSVG, USMapSilhouette)
- [ ] Restore all deleted server files (routers/articles, routers/matrix, routers/subscriber, routers/top5, ghlSync, lib/greenscreen)
- [ ] Restore all deleted test files
- [ ] Restore cardShowsData.ts and drizzle migrations
- [ ] Restore Market Intel pages from checkpoint 5b8f198
- [ ] Verify App.tsx routes and Navigation.tsx links
- [ ] Verify server routers are wired
- [ ] Run integrity check and save checkpoint

## Remove "Raw & Graded Hits" / CardShowcase permanently
- [x] Remove CardShowcase component file (deleted)
- [x] Remove any CardShowcase imports/usage from Home.tsx and anywhere else (none found - not imported anywhere)
- [x] Remove any related database tables/data (none found - no showcase table in schema)
- [x] Remove any related server routers/procedures (none found)
- [ ] Save checkpoint

## Add Comic Cons & Collectible Events section to Card Shows page
- [x] Run integrity check before changes (schema exports exist, TS errors are stale LSP cache)
- [x] Compile comic con data from 4 sources + user tier list
- [x] Build comicConsData.ts with tier system (Tier 1-4)
- [x] Add Comic Cons section to CardShows.tsx (below card shows, visually separated)
- [x] Include search, state filter, month filter, tier filter
- [x] Run integrity check before checkpoint (81/81 passed)
- [x] Save checkpoint

## Homepage Improvements — More Info + Simpler Sign-up + GHL CRM
- [x] Add "What is a Repack?" explainer section to homepage
- [x] Add "How It Works" step-by-step section to homepage (Browse → Pick → Unbox → Collect)
- [x] Add inline email capture form in "Join the Legend" section (submit directly, no redirect to /subscribe)
- [x] Ensure inline email form syncs to GHL CRM (reuse existing subscribe.submit tRPC mutation)
- [x] Add social links (X/Twitter, Facebook, Instagram, Whatnot) to footer with real URLs

## Marvel Card Hub Page — Community Resources
- [x] Research top 5 Marvel news websites
- [x] Research top 5 Marvel YouTube podcasts/channels
- [x] Build Marvel Card Hub page with news links and auto-updating latest YouTube video embeds
- [x] Create server-side tRPC route to fetch latest videos from YouTube channels via RSS
- [x] Add route to App.tsx and navigation entry
- [x] Write vitest tests for YouTube router (13 tests passing)
- [x] Update integrity check script with new page/route (85/85 checks passing)

## Email Capture Popup Improvements
- [x] Center popup properly on screen (especially on mobile)
- [x] Green background with black border and white text
- [x] Ensure popup doesn't overlap important content (centered with backdrop overlay)

## Shop Page — Gambit 52-Card Repack & Pyramid Layout
- [x] Generate Gambit-themed product image
- [x] Add Gambit's Deck — 52 Singles product to products.ts ($600, May 22 launch, visible checklist)
- [x] Redesign Shop page with pyramid layout — Gambit's Deck featured at top
- [x] Ensure other products appear below in pyramid tiers (Gambit > Variant Series > Snap > Multiverse Vault > Sealed Boxes)
- [x] Test and save checkpoint (232 tests passing, 85/85 integrity checks)

## Gambit's Deck Checklist — Open/Reveal
- [x] Investigate checklist visibility logic (reveal date, hidden state)
- [x] Open/reveal the checklist for nlf-marvel-52-singles so it's visible to all visitors (REVEALED_SLUGS exemption)
- [x] Test and save checkpoint (checklist visible, 232 tests, 85/85 integrity)

## Homepage Pyramid Layout
- [x] Add pyramid product showcase to homepage — Gambit's Deck on top, two Variant Series below
- [x] Test and save checkpoint (232 tests, 85/85 integrity)

## Transparency Page — Remove Platform Names
- [x] Replace "Whatnot" with generic "live streams" / "on stream" / "platform policies" language (6 replacements)
- [x] No eBay or Fanatics Live mentions found on Transparency page
- [x] Ensure no specific platform names remain in visible text (only /whatnot route path kept)
- [x] Test and save checkpoint (232 tests, 85/85 integrity)

## Whatnot PSSP Compliance Fixes
- [x] Homepage: Remove "strong floor, loaded middle, healthy ceiling" from hero
- [x] Homepage: Remove value comparisons from "What is a Repack?" section
- [x] Homepage: Remove "Better Value" card comparing to hobby box prices (now "Curated Packs")
- [x] Homepage: Rewrite "Why NLF?" section (now: 100% Authentic, Quality Throughout, No Filler, Chase Cards)
- [x] Product pages: Remove floor/ceiling/value language from all product descriptions
- [x] Product pages: Remove floor/ceiling bullet points from all product features
- [x] Product pages: Replace Strong Floor / Better Middle / Healthy Ceiling badges with 100% Authentic / Full Checklist / Hand-Curated
- [x] Transparency page: Remove floor/ceiling language from hero, "Why This Matters" section, and compliance cards
- [x] Checklist pages: Date-stamped finalization statement already exists (built previously)
- [x] Checklist pages: Fix "Full checklist published" badge — now shows "Checklist reveals at launch" for hidden checklists
- [x] Checklist pages: Remove "great value" from Base Cards tier (now: "Quality base cards from authentic Topps releases")
- [x] Checklist pages: Remove "Guaranteed hits" from Hit Cards tier (now: "Premium cards")
- [x] FAQ page: Review and update value language in answers (6 answers rewritten)
- [x] SEO.tsx: Remove floor/ceiling from meta descriptions and JSON-LD
- [x] About.tsx: Remove floor/ceiling from mission statement and story section
- [x] Run integrity check and save checkpoint (232 tests, 85/85 integrity)

## Gambit's Deck Product Page — Checklist Preview
- [x] Add checklist preview section to /product/gambit-deck-52 showing what cards are in the set
- [x] Pull checklist data from tRPC and display by tier (Chase, Hit, Base)
- [x] Link to full checklist page for detailed view (Full Details + View Full Checklist CTA)
- [x] Test and save checkpoint (232 tests, 85/85 integrity)

## Our Process Page
- [x] Build Our Process page with step-by-step process (placeholder images)
- [x] Steps: Card Sourcing, Sorting & Organization, Grading & Quality Check, Sealing the Hits, Final Packaging, Random Spot Assignment
- [x] Add Superman/DC joke in the randomization section ("Sorry, Clark. This is a Marvel house.")
- [x] Add route to App.tsx (/our-process) and navigation entry
- [x] Update integrity check script with new page/route (88/88 checks)
- [x] Test and save checkpoint (232 tests, 88/88 integrity)

## Contact Info Cleanup
- [x] Remove all phone numbers from the site (Contact page phone section removed)
- [x] Change all email addresses to contact@nlfservices.com (Footer, Contact, About)
- [x] Also fixed remaining floor/ceiling language on About page
- [x] Test and save checkpoint (232 tests, 88/88 integrity)

## Checklists Page Cleanup
- [ ] Remove checklists not tied to Shop products
- [ ] Only show checklists for products currently in the Shop
- [ ] Test and save checkpoint

## Checklists Page Cleanup
- [x] Filter Checklists page to only show Gambit's Deck (nlf-marvel-52-singles)
- [x] Hide all other checklists from the listing page
- [x] Updated hero description and stats bar to reflect preview-only state
- [x] Fixed "Proven Value" text to "Collector Confidence" (PSSP compliance)
- [x] Test and save checkpoint (232 tests, 88/88 integrity)

## Business Address Update
- [x] Update address to 6390 McKinley St NW, Anoka, MN 55303 across the site
- [x] Update Contact page (location section), Footer (bottom bar), SEO/JSON-LD (structured data)
- [x] Test and save checkpoint (232 tests, 88/88 integrity)

## Gambit's Deck Release Date Change
- [x] Update Gambit's Deck release date from May 22nd to April 24th (products.ts: comment, badge, launchDate)
- [x] Test and save checkpoint (232 tests, 88/88 integrity)

## Checklists Page — Show All Sets with Lock Logic
- [x] Show all product sets on the Checklists page (deduplicated by product line)
- [x] Lock checklists until 1 week before launch date
- [x] Gambit's Deck stays fully visible as transparency preview (ALWAYS_REVEALED_SLUGS)
- [x] Coming Soon products show as locked with no reveal date
- [x] Test and save checkpoint (232 tests, 88/88 integrity)
## Our Process Page — Real Photos & Grading Companies
- [x] Replace Step 2 (Sorting) placeholder with real sorting table photo
- [x] Add grading company mentions (CGC, AGS, PSA, etc.) to Step 3
- [ ] Replace remaining step placeholder images as user uploads photos
## The Collector — Blog System (Phase 6)
- [x] Create blog_posts table in database schema
- [x] Add blog database helpers (CRUD) to server/db.ts
- [x] Create blog router (public + admin) in server/routers/blog.ts
- [x] Wire blog router into routers.ts
- [x] Build The Collector listing page (featured + recent posts, categories)
- [x] Build individual blog post page with rich content rendering
- [x] Add blog management to AdminDashboard (create, edit, publish posts)
- [x] Add The Collector to navigation
- [x] Add routes to App.tsx (/the-collector, /the-collector/:slug)
- [x] Draft 4 starter blog articles
- [x] Add SEO and social sharing to blog pages
- [x] Test and save checkpoint
- [x] AI article generation with LLM integration (auto-generate content)
- [x] AI image generation for each article (auto-generate featured images)
- [x] Manual writing template page for user-authored content
- [x] Auto-publish scheduler: hourly today (24 articles), then 3x/day ongoing
- [x] SEO optimization: schema markup, meta tags, internal linking, keywords
- [x] Investment-focused content angle in all generated articles
- [x] Ensure all blog articles always have AI-generated images related to their topic
- [x] Fix image generation reliability in blog system (3-attempt retry with fallback prompts)
- [x] Regenerate images for existing articles missing them
- [x] Audit all blog articles for non-Topps references (Fleer, Upper Deck, etc.)
- [x] Remove or rewrite articles mentioning non-Topps products (deleted all 3 problematic articles)
- [x] Update AI generation prompts to be Topps-only focused
- [x] Emphasize Topps licensing advantage and unlicensed products losing value
- [x] Delete Article 1 (non-Topps "cards doubled" article)
- [x] Rewrite Article 3 (Spider-Man guide) to be Topps-only
- [x] Rewrite Article 4 (Portfolio guide) to be Topps-only
- [x] Check Articles 5, 6, 8 for non-Topps references and fix
- [x] Update AI generation prompt with NLF core talking points
- [x] Add Topps licensing advantage narrative to AI prompts
- [x] Add migration from comics/Pokémon/sports cards narrative
- [x] Add Pokémon new US printing facility / new wax era angle
- [x] Add Marvel as family gateway hobby narrative
- [x] Add MCU movie/series hooks to AI prompts (Wonder Man, Spider-Man Brand New Day, Avengers Doomsday, Endgame re-release)
- [x] Add sports crossover comparison angle to AI prompts (Doom=Ohtani, Spider-Man=Jordan, etc.)
- [x] Update topic pools with new MCU and sports crossover topics
- [x] Create centralized blog-content-strategy.ts with master system prompt
- [x] Add sports_crossover category to schema, blog router, scheduler, and all frontend components
- [x] Generate 8 fresh Topps-focused articles with AI images (all clean, zero non-Topps mentions)
- [x] Auto-scheduler also generating clean articles using centralized strategy

## Social Media Sharing for Blog Posts
- [x] Build reusable SocialShareButtons component (X/Twitter, Facebook, LinkedIn, Reddit, Email, copy link)
- [x] Integrate sharing buttons into BlogPost page (inline header + floating sidebar + bottom bar)
- [x] Ensure share URLs use production domain (northlandlegendaryfinds.com)
- [x] Style sharing buttons to match dark theme with hover effects
- [x] Test sharing links generate correct URLs with title/excerpt
- [x] Save checkpoint

## Blog Auto-Scheduler Fix
- [x] Investigate why blog scheduler is not generating new content (it IS working — 21 articles exist)
- [x] Check server logs for scheduler errors (ECONNRESET on DB, 500 on image gen)
- [x] Fix scheduler issues — added retry logic for DB ops (3 retries with backoff), image gen (3 retries with fallback prompts)
- [x] Added DB-backed generation tracking (survives server restarts)
- [x] Added topic deduplication to avoid repeat articles
- [x] Verify scheduler generates and publishes articles reliably
- [x] Save checkpoint

## SEO Audit & Sitemap Fix
- [x] Audit Google indexing status (confirmed: site IS indexed by Google)
- [x] Check robots.txt (properly configured)
- [x] Check sitemap.xml (existed but was missing blog posts and key pages)
- [x] Add 21 blog post URLs to dynamic sitemap
- [x] Add missing pages to sitemap: /the-collector, /card-shows, /our-process, /card-hub, /mcu-intel, /matrix, /whatnot-drops, /login
- [x] Sitemap now has 2,928 URLs (up from 2,899)
- [x] Verify meta tags, OG tags, Twitter cards all present on homepage
- [ ] User action needed: Set up Google Search Console and verify domain ownership
- [ ] User action needed: Set up Bing Webmaster Tools
- [ ] User action needed: Submit sitemap URL to Google Search Console and Bing

## Blog Category Diversity Fix
- [x] Fix scheduler to never generate same category twice in a row (checks last 2 categories from DB)
- [x] Add category rotation logic to ensure diverse content mix (avoids last 2 categories, DB-backed)
- [x] Space out existing "Character vs Sports Legend" articles so they don't cluster (Wolverine/LeBron Mar 31, Iron Man/Brady Mar 28, Spider-Man/Jordan Mar 27)
- [x] Redistributed all 21 articles with round-robin interleaving across 7 days
- [x] Verify articles display with good category variety when sorted by date
- [x] Save checkpoint

## Google Analytics & GoHighLevel Tracking
- [x] Add Google Analytics (G-CR444D1BXY) tracking script site-wide (in <head>)
- [x] Add GoHighLevel external tracking (tk_5e6eeee5cecd4141a974a611606e39e8) site-wide (before </body>)
- [x] Verify both scripts in index.html alongside existing Meta Pixel
- [x] Save checkpoint

## Disable Blog Auto-Scheduler
- [x] Disable automatic blog content generation (AUTO_GENERATE_ENABLED = false)
- [x] Save checkpoint and publish

## NLF Cross-Site Widgets Integration
- [x] Add NLF Cross-Site Network Bar (Shop NLF, Comic Book Cards, Mint Comics)
- [x] Add Click-to-Call/Text FAB widget (+1 763-710-3772) with Call Us / Text Us options
- [x] Add Cookie Consent Banner with accept/decline and fbq consent grant
- [x] Ensure widgets don't conflict — nav offset adjusted to top-[30px] for network bar
- [x] Verified all three widgets render correctly on dev server
- [x] Save checkpoint

## Fix AI Image Style — Realistic Photography Instead of Fake AI Art
- [x] Update blog-content-strategy.ts image prompts to use photography style (not comic art)
- [x] Update blog-scheduler.ts featured image prompt + fallback prompts to use realistic style
- [x] Update blog router generateArticle featured image prompt + fallback prompts to use realistic style
- [x] Update regenerateImages function prompt to use realistic style
- [ ] Regenerate featured images for existing articles with new photography style (requires credits)
- [ ] Verify images look natural and credible (not obviously AI-generated)
- [ ] Save checkpoint

## ORDER 66 — Blog Layout Engine v1.5 (12-Template Rotation System)
- [x] Add layoutTemplate (int 1-12) and layoutData (JSON) columns to blog_posts schema + push migration
- [x] Build shared blog design elements (PullQuote, FactBox, StatCounters, HeatBadge, LightboxGallery, BlogNewsletter, RelatedArticlesCarousel, GreenDivider, AlertBanner, ProfileCard, Timeline, StickyTOC, ComparisonTableView)
- [x] Build blogLayoutTypes.ts with LayoutData, StatItem, TimelineEntry, GalleryImage, ComparisonTable, PersonProfile types
- [x] Build Template 1: Field Report (image-left/text-right split)
- [x] Build Template 2: Personnel Dossier (character profile card)
- [x] Build Template 3: Data Brief (stats-heavy analytical)
- [x] Build Template 4: Intercepted Transmission (timeline + alert)
- [x] Build Template 5: Situation Room (dashboard feel with stats + comparison)
- [x] Build Template 6: Asset Gallery (image gallery with lightbox)
- [x] Build Template 7: Strategic Analysis (two-column comparison)
- [x] Build Template 8: Flash Alert (urgent/breaking news)
- [x] Build Template 9: After-Action Report (timeline debrief)
- [x] Build Template 10: Technical Schematic (sticky TOC + detailed breakdown)
- [x] Build Template 11: Surveillance Log (image-right/text-left chronological)
- [x] Build Template 12: Command Briefing (executive summary)
- [x] Build BlogTemplateRouter to route posts to correct template by number
- [x] Update BlogPost.tsx to use template router with legacy fallback for existing posts
- [x] Add round-robin template counter (getNextTemplate) to blog-content-strategy.ts
- [x] Add getLayoutDataPrompt() for template-specific LLM instructions (12 templates)
- [x] Add BLOG_JSON_SCHEMA_WITH_LAYOUT extended JSON schema with all layoutData fields
- [x] Update blog router generateArticle to use template rotation + layoutData generation
- [x] Update blog router bulkGenerate to use template rotation + layoutData generation
- [x] Update blog-scheduler.ts to use template rotation + layoutData generation
- [x] Run tests (232 passed) and integrity checks (81/81 passed)
- [x] Save checkpoint

## Hide NLF Marvel 52 Singles Checklist Until Launch
- [x] Hide checklist items and card count on /checklist/nlf-marvel-52-singles until launch date
- [x] Show "CHECKLIST HIDDEN" overlay with launch date message instead of full checklist
- [x] Hide Total Cards and Packs Left stats (show lock/clock icons instead)
- [x] Remove card count from hidden overlay message
- [x] Update Checklists listing page: removed from ALWAYS_REVEALED_SLUGS, now shows Locked badge + Checklist Coming Soon
- [x] Removed Gambit Preview Banner from listing page
- [x] Updated description text to remove Gambit-specific transparency preview mention
- [x] Save checkpoint

## Blog Engine Rollout — Full Activation
- [x] Generate 2 test articles to verify ORDER 66 template rendering (Template #1 Field Report + Template #2 Personnel Dossier)
- [x] Bulk generate 12 articles (one per template) to exercise all layouts — all 12 templates published
- [x] Update The Collector listing page with heat badges, template-type indicators, and Flash Alert styling
- [x] Regenerate images — legacy articles already had new images; redistributed templates evenly (3 per template across all 12)
- [x] Re-enable the auto-scheduler (3 articles/day at 8am, 1pm, 6pm CT with ORDER 66 template rotation)
- [x] Sitemap already fully implemented at /sitemap.xml with all dynamic content (cards, characters, blog posts, products) + robots.txt pointing to it
- [x] Run tests (232 passed) and integrity checks (81/81 passed)
- [x] Save checkpoint

## Whatnot Referral Landing Page (Facebook Ads Funnel)
- [x] Build dedicated landing page at /free-credit
- [x] Hero section: "$15 FREE to Shop Live Card Breaks" with strong CTA
- [x] Explain how Whatnot works and the $15 credit referral deal (How It Works + FAQ sections)
- [x] Showcase NLF repack products / what they'll find on shows (alternating image/text layout)
- [x] Primary CTA button → Whatnot referral link (whatnot.com/invite/northlandfinds)
- [x] Secondary CTA → Shop repacks on the site
- [x] Lead capture form (first name + email for future drops, drawings, events)
- [x] GHL form integration via existing subscribe mutation (source: whatnot-referral-landing)
- [x] Facebook Pixel tracking (ViewContent, Lead, WhatnotReferralClick events)
- [x] Add route to App.tsx + sitemap entry
- [x] Mobile-responsive design (most FB ad traffic is mobile)
- [x] Tests written and passing (9 tests)
- [x] Save checkpoint

## Site Map Page (Auto-Discovery)
- [x] Build /sitemap page with auto-discovered routes grouped by category (6 sections, 31 pages)
- [x] Dedicated blog articles section pulling from tRPC blog.list (41 articles with thumbnails, categories, dates)
- [x] Auto-updates when new pages/routes are added to SITE_SECTIONS registry
- [x] SEO meta tags and breadcrumb JSON-LD
- [x] Add route to App.tsx, sitemap.xml, and footer link
- [x] Write tests (4 tests, 245 total passing)
- [x] Save checkpoint

## Remove Cross-Site Links (mintcomiccards.com & riseofdoom.com)
- [x] Find all references to mintcomiccards.com and riseofdoom.com (found in index.html only)
- [x] Remove Network Bar (entire NLF Network bar with Comic Book Cards + Mint Comics links)
- [x] Remove Network Bar CSS styles
- [x] Remove Network Bar padding script
- [x] No footer links to sister sites found (footer was clean)
- [x] No other cross-site references found (grep confirmed zero matches)
- [x] Verify no NLF content or functionality was removed (81/81 integrity checks passed)
- [x] Save checkpoint

## Email Popup Behavior Fix
- [x] Popup shows once on initial visit (2s delay)
- [x] If user closes popup (X or backdrop), stays dismissed for entire session (sessionStorage)
- [x] Only re-trigger on exit intent (mouse leaves top of page) if user hasn't subscribed
- [x] Exit intent only fires once per session
- [x] Never show again after successful subscription (localStorage permanent)
- [x] All 245 tests passing, 81 integrity checks OK
- [x] Save checkpoint

## Newsletter Signup Component (GHL Dual Capture)
- [x] Build NewsletterSignup component with GHL hidden iframe dual-capture
- [x] GHL Form ID: 5SL68SbkAFgq85FPiJw6, Subaccount: KFJlOhDocOFLVA5rLqVh
- [x] Fields: Email (required), First Name (optional)
- [x] Dual capture: local DB via tRPC + hidden GHL iframe POST
- [x] Add newsletter section to homepage (replaced old inline subscribe)
- [x] Add newsletter to footer (compact variant)
- [x] Add sidebar widget on TheCollector blog listing page (sticky sidebar)
- [x] Verify tracking pixels: FB 839598775754379 (2x), GHL tk_5e6eeee5cecd4141a974a611606e39e8 (1x), GA4 G-CR444D1BXY (2x)
- [x] Verify no cross-site links remain (0 matches for mintcomiccards, riseofdoom, comicbookcard)
- [x] 81/81 integrity checks passed, 245/245 tests passing
- [x] Checkpoint saved

## /free-credit CRO Optimization (Facebook Ad Landing Page)
- [x] Remove/delay email popup on /free-credit (suppressed, exit-intent only after 30s)
- [x] Hide main navigation on /free-credit (standalone route, logo-only header)
- [x] Consolidate all CTAs to single goal: "Claim Your $15 Free Credit" (yellow buttons)
- [x] Add social proof/trust bar below hero (5-star, 1700+ collectors, 100% checklists, live)
- [x] Condense "Why Whatnot?" and "What You'll Find" sections (tighter copy, 3-card grid)
- [x] Add sticky mobile CTA button at bottom of screen (shows after scrolling past hero)
- [x] Facebook Pixel fires WhatnotReferralClick on CTA clicks + Lead on form submit
- [x] GHL dual-capture on lead form (tRPC API + hidden iframe)
- [x] Images optimized (CDN-hosted, existing assets)
- [x] All other pages/content preserved (81/81 integrity checks)
- [x] 245/245 tests passing, checkpoint saved

## /free-credit Content Update - Shows Section
- [x] Update "What You'll Find on Our Shows" — now 4 cards: Singles Shows, Box & Case Breaks, Combo Shows, Giveaways & Community
- [x] Giveaways for ALL fans (not just buyers), rewards for loyal community, helping new streamers level up
- [x] 245/245 tests passing
- [x] Checkpoint saved

## Loyalty/Rewards Program (Hidden - Ready for Future Launch)
- [x] Design loyalty tier system (Collector/Silver/Gold/Legendary)
- [x] Build DB schema: loyalty_members table with points, tier, join date
- [x] Build DB schema: loyalty_transactions table for points history
- [x] Build DB schema: loyalty_rewards and loyalty_redemptions tables
- [x] Build tRPC procedures: enroll, getTierInfo, checkStatus, getRewards (public)
- [x] Build tRPC procedures: getDashboard, redeemReward (protected/member)
- [x] Build tRPC procedures: adminListMembers, adminAdjustPoints, adminManageReward, adminStats (admin)
- [x] Build /rewards landing page (public-facing signup/info page with hero, tiers, earn methods, FAQ)
- [x] Points logic: earn per $1 spent, bonus for referrals, social follows, drawing entries, birthday, signup
- [x] Tier thresholds: Collector (0), Silver (500), Gold (2000), Legendary (5000)
- [x] Tier perks: early access, exclusive repacks, free shipping, bonus drawing entries, multipliers
- [x] GHL integration: tag loyalty members in CRM via createGHLContact with loyalty-member tag
- [x] GHL dual-capture: hidden iframe backup form submission (same pattern as newsletter)
- [x] Facebook Pixel: track loyalty VIP signup as Lead event
- [x] Route added at /rewards but NOT linked in main nav (hidden until launch)
- [x] Added to sitemap page registry
- [x] Write 27 vitest tests (all passing)
- [x] Save checkpoint

## Homepage Repositioning Phase 1: Collector-First Identity
- [x] Generate character images (Doctor Doom, Iron Man, Spider-Man, Fantastic Four, Black Panther)
- [x] Generate new collector-first hero banner
- [x] Upload all images to CDN
- [x] Restructure homepage: new hero with collector-first messaging and character imagery
- [x] Restructure homepage: reorder sections (collector content first, commerce second)
- [x] Add character images throughout homepage sections (Iron Man, FF, Black Panther, Spider-Man)
- [x] Update stats bar to highlight collector resources (1,709+ cards, 6 sets, 200+ characters, Market Intel)
- [x] Build "Your Fandom, Your Way" expansion roadmap section (Marvel, Star Wars, Disney, WWE, UFC, Boxing)
- [x] Update Navigation order (Card Database first, Shop moved down, The Collector elevated)
- [x] Update SEO meta tags for collector-first positioning
- [x] Update announcement bar to collector-first messaging
- [x] New "Collector's Journey" section with alternating image/text layout and character cards
- [x] New "Explore the Collection" section with Spider-Man card and CTA buttons
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Run integrity check and save checkpoint

## Homepage Rework: New Collector Focus (Repacks Secondary)
- [x] Rework hero: "LOVE MARVEL OR STAR WARS? START HERE." — fan-first, not collector jargon
- [x] Rewrite Collector's Journey: "I GREW UP ON THIS" / "WE DO THIS TOGETHER" / "I WANT TO LEARN MORE" — no jargon
- [x] Add "New to Collecting?" section: Pick Your Fandom → Learn the Basics → Browse the Cards
- [x] Reorder sections: Welcome → Journey → Doomsday → Top5 → Explore → Fandom Roadmap → Whatnot → THEN repacks
- [x] Push all product/repack sections to bottom of page (sections 10-13 of 14)
- [x] Simplify jargon: "numbered parallels" → "rare versions", "slabs" → "professionally graded cards", etc.
- [x] CTAs fan-first: "Discover Your Heroes", "New to Collecting?", "Explore Characters"
- [x] Whatnot section reframed: "JOIN THE COMMUNITY" with "FREE to watch", "CHAT with other fans", "WIN giveaways"
- [x] What is a Repack rewritten: "curated gift box" analogy, plain language throughout
- [x] Trust section: "100% Real Cards", "Free Resources", "Full Transparency", "Built by Fans"
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Save checkpoint

## Whatnot Stream CTA — Make It Very Noticeable
- [x] Moved Whatnot from position 9 to position 3 — right after stats bar, before everything else
- [x] Full redesign: intense purple/red gradient background, 7xl "STREAM WITH US" headline, pulsing LIVE indicator, animated ring effects
- [x] 3-column layout: big bold text + QR code + FREE/LIVE/CHAT/WIN feature cards
- [x] White CTA button on purple bg for maximum contrast, mobile QR code fallback
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Save checkpoint

## Fandom Roadmap Date Updates
- [x] Change UFC from "Coming Soon" to "Summer 2026"
- [x] Change Disney from "Coming 2027" to "Fall 2026"
- [x] Change WWE from "Coming Soon" to "Fall 2026"
- [x] Change Boxing from "Coming Soon" to "Fall 2026"

## Legacy Legends Section — Actor-Focused Premium Section
- [x] Generate slab-style card images: Hopkins/Odin, McKellen/Magneto, Stewart/Professor X, Black Panther/Wakanda Forever
- [x] Upload images to CDN (all 4 cards on CloudFront)
- [x] Build Legacy Legends section on homepage (section 8, between Explore Collection and Fandom Roadmap)
- [x] Gold/amber ambient glow, spotlight hover effects, slab-style card presentation
- [x] Badge system: "Debut Auto" (Hopkins, McKellen, Stewart), "No Autograph Exists" (Boseman)
- [x] Actor name, character name, and significance note per card
- [x] Expansion-ready LEGACY_LEGENDS array — just add new objects to add more actors
- [x] Respectful, premium, legacy-focused tone — Boseman note mentions his passing and tribute significance
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Save checkpoint

## Fix Whatnot QR Code Sitewide
- [x] Replace old QR code in Home.tsx, Footer.tsx, Whatnot.tsx, WhatnotDeal.tsx
- [x] All 4 files updated with correct NLF-WhatNOT QR code from CDN

## Simplify Navigation — 8 Focused Items
- [x] Main nav: Marvel Characters, Repack, Shop Now, Events, About, FAQ, Card Database, Marvel Resources
- [x] Marvel Resources dropdown: The Collector (Blog), Market Intel (nested with 6 articles), Transparency, Our Process, Card Hub
- [x] Removed clutter — 12 items reduced to 8 visible + 1 dropdown
- [x] Mobile menu matches desktop with collapsible Marvel Resources and nested Market Intel
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Save checkpoint

## Add Whatnot Nav Tab
- [x] Add Whatnot to main navigation bar linking to /whatnot
- [x] Save checkpoint

## Rename Gambit's Deck to Topps Marvel Mint Collection
- [x] Renamed product from "Gambit's Deck" to "Topps Marvel Mint Collection"
- [x] Updated description: highlights 2025 Topps Marvel Mint, complete Gambit set, other great cards
- [x] Updated subtitle: "52 Premium Marvel Mint Packs — Complete Gambit Set Inside"
- [x] Updated features list and product line tagline
- [x] Save checkpoint

## Whatnot + Free Credit Combo Page
- [x] Added $15 FREE CREDIT section to /whatnot page with 3-step how-to, claim CTA, and email capture form
- [x] GHL integration + Facebook Pixel Lead tracking on whatnot page form
- [x] /free-credit remains as standalone Facebook ad landing page (untouched)
- [x] Correct Whatnot QR code deployed across all 4 pages (Home, Footer, Whatnot, WhatnotDeal)
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Save checkpoint

## Fix Whatnot Page Issues
- [x] Free credit section confirmed present in Whatnot.tsx (lines 195-328)
- [x] Removed ALL "exclusive repacks" / "Whatnot Exclusive" language from Whatnot.tsx
- [x] Hero: "EXCLUSIVE LIVE STREAM REPACKS" → "LIVE CARD BREAKS ON WHATNOT"
- [x] "Whatnot Exclusive" card → "Giveaways & Deals"
- [x] "WHATNOT EXCLUSIVE PRODUCTS" → "WHATNOT LIVE PRODUCTS"
- [x] "Whatnot Only" badge → "Live Show" badge
- [x] Updated ChecklistDetail.tsx badge: "Whatnot Exclusive" → "Whatnot Live"
- [x] Updated SEO description to remove "exclusive" language
- [x] All 272 tests passing, 81/81 integrity checks green
- [x] Save checkpoint

## Consolidate Whatnot Pages — Keep Only /free-credit
- [ ] Remove /whatnot route from App.tsx
- [ ] Remove /whatnot-deal route from App.tsx
- [ ] Update Whatnot nav tab to point to /free-credit
- [ ] Update any internal links pointing to /whatnot or /whatnot-deal
- [ ] Run tests and integrity check
- [ ] Save checkpoint

## Consolidate Whatnot Pages — Keep Only /free-credit
- [ ] Remove /whatnot and /whatnot-deal routes from App.tsx
- [ ] Update Whatnot nav tab to point to /free-credit (label stays "Whatnot")
- [ ] Update any internal links pointing to /whatnot or /whatnot-deal
- [ ] Run tests and integrity check
- [ ] Save checkpoint

## Consolidate Whatnot Pages
- [ ] Remove /whatnot-deal route from App.tsx (user confirmed removal)
- [ ] Keep /whatnot as main Whatnot page (nav tab "Whatnot" links here)
- [ ] Keep /free-credit as standalone Facebook ad landing page
- [ ] Update any internal links pointing to /whatnot-deal
- [ ] Run tests and integrity check
- [ ] Save checkpoint

## Whatnot Nav Tab Styling
- [x] Style Whatnot nav tab with green border and yellow text to make it stand out (desktop + mobile)
- [x] Save checkpoint

## Remove Broken /whatnot/checklist Route
- [x] Remove /whatnot/checklist/:slug route from App.tsx
- [x] Remove WhatnotChecklist import from App.tsx
- [x] Remove /whatnot-drops from sitemap (dead route)
- [x] Fix product card link on /whatnot page (/whatnot/checklist → /checklist)
- [x] Update Whatnot product description in DB (removed 'Whatnot-exclusive' language)
- [x] Run integrity check and tests (81/81, 272/272)
- [x] Save checkpoint

## Whatnot Page Redesign — Promo First, Awesome Design
- [x] Move $15 free credit promo to the top as the hero section
- [x] Rearrange page flow: Promo Hero → 3-Step Claim → 500-Pack Explainer → Upcoming Shows → Live Products → Past Shows → Follow CTA
- [x] Make the page visually stunning with premium design (animated bg, hover effects, color-coded steps)
- [x] Verify visually and run integrity check + tests (81/81, 272/272)
- [x] Save checkpoint

## Whatnot Page — Fix Referral Program Copy to Match Official Terms
- [x] Update hero copy: $15 OFF YOUR FIRST LIVE PURCHASE (not "$15 FREE")
- [x] Update 3-step flow: Sign Up via Our Link → $15 Credit Added → Use It on Your First Buy
- [x] Update trust badges: No Minimum Spend, Auto-Applied at Checkout, 30-Second Signup
- [x] Updated FAQ: 90-day expiry, first purchase only, auto-follow
- [x] Update WhatnotDeal.tsx (/free-credit) with same accurate terms (22 edits)
- [x] Update all CTA buttons: "Claim Your $15 Free Credit" → "Get My $15 Credit"
- [x] Run integrity check + tests (81/81, 272/272)
- [x] Save checkpoint

## Add Prominent Whatnot Profile CTAs to /whatnot Page
- [x] Audit current page for existing Whatnot profile links (found 10 existing)
- [x] Add sticky floating "Visit Our Whatnot" button (green gradient, pulsing dot, appears after scrolling past hero)
- [x] Add mid-page "VISIT OUR WHATNOT STORE" banner (green themed, between 500-pack and Upcoming Shows)
- [x] Hero already has prominent "Follow on Whatnot" + "Get My $15 Credit" buttons
- [x] Total: 12+ clickable Whatnot links across the page
- [x] Run integrity check and tests (81/81, 272/272)
- [x] Save checkpoint

## Follow on Whatnot Button — Yellow & Black
- [x] Change all 3 "Follow on Whatnot" buttons on /whatnot page from purple/white to yellow bg + black text
- [x] Save checkpoint

## About Us Page — Founder Story with Family Photos
- [x] Upload all 42 family photos to CDN
- [x] Rewrite About Us page with story-driven layout: Section 8 → Northland Fence → NLF with Landon
- [x] Include key photos: Me and the Boy, Vegas Retreat, Star Wars cruiser, Boxing, MN Card Show, etc.
- [x] Flexible image+text layouts (image left/right alternating, galleries)
- [x] Run integrity check and tests (81/81, 272/272)
- [ ] Save checkpoint

## About Us — Text Edits
- [x] Update Builder section: replace "handed her the keys" with daughter and her husband now run Northland Fence
- [x] Tone down arrogant language across About page (more humble, authentic)
- [x] Fix hero subtitle — says "Section 8" twice, rewrite to avoid repetition

## Bug Fixes
- [x] Fix nested <a> tag error on homepage — <a> cannot contain a nested <a>
- [x] Rewrite The Hustle section: warmer tone about dad, card show drop-offs, wheel and deal, drive to do better for own family
- [x] Rename "Landon's Marvel Moments" section to cover both Marvel & Star Wars → "Out of This World Moments"
- [x] Rewrite The Next Chapter section: nostalgia toy stores, lightsaber battles in the house, now ripping cards
- [x] Replace Next Chapter quote with "I've seen the dark side. I choose the light."
- [x] Replace "Me and the boy" photo in Next Chapter section with new uploaded photo
- [x] Replace Next Chapter photo with MN Sports Cards store photo
- [x] Fix MN Sports Cards photo cropping — changed to 3/4 aspect ratio with object-top to show sign
- [x] Upload 12 new photos for Out of This World Moments grid to CDN
- [x] Replace/expand Out of This World Moments grid with 12 new photos (4 rows x 3)
- [x] Swap Star Wars Cruise (pos 3) and Landon & Sissy (pos 10) in Out of This World grid
- [x] Upload 3 new photos (Avengers vs Villains, Mama Star Wars Cruise, Sleepboy) to CDN
- [x] Fix Millennium Falcon photo display (added object-top)
- [x] Expand Out of This World grid to 15 photos (5 rows of 3)
- [x] Replace Galaxy's Edge photo with new photo, rename label to "Ready to Rip"
- [x] Replace Millennium Falcon photo (showing black) with Landon & Thor photo
- [x] Replace boxing photo in The Hustle section with family dinner (Texas trip) photo
- [x] Replace The Hustle section photo with Landon & I Hayride photo (baby Landon in Northland Fence beanie)

## Characters Page Redesign
- [x] Add Doctor Doom featured hero section at top of Characters page
- [x] Add Top 10 MCU Characters ranked list with character card images
- [x] Add team sections (Avengers, X-Men, Guardians of the Galaxy, Fantastic Four, Villains)
- [x] Upgrade character grid cards to show character images from database
- [x] Keep existing search/filter/pagination for full database below teams
- [x] Add new tRPC endpoint to fetch character images for featured characters

## More Teams & Character Detail Hero Images
- [x] Add Thunderbolts team section to Characters page
- [x] Add Young Avengers team section to Characters page
- [x] Add Sinister Six team section to Characters page
- [x] Add character card art as hero image on CharacterPage detail pages
- [x] Test and verify all new sections display correctly
- [x] Fix Avengers: Doomsday release date from "MAY 1, 2026" to December 2026 (DO NOT change again unless user says so)
- [x] Rewrite Legacy Legends descriptions to highlight actors' real accomplishments (Oscars, iconic roles, cultural impact) not just card investing
- [x] Add Robert Downey Jr. as 5th Legacy Legend (Oscar winner Oppenheimer, Iron Man decade, returning as Doctor Doom)
- [x] Generate RDJ/Iron Man slab-style card image for Legacy Legends
- [x] Add "Read more" toggle to Legacy Legends cards so descriptions stay compact

## Facebook Landing Page
- [x] Create dedicated Facebook landing page at /facebook route
- [x] Hero section: "JOIN OUR STREAM" - $5,000 in Marvel trading card giveaways, no purchase necessary
- [x] $15 Whatnot credit section (same as Whatnot page referral link)
- [x] Giveaway details: Free Packs, Free Boxes, Free Graded and Raw cards
- [x] Legal disclaimers compliant with Whatnot TOS and Facebook ad policies
- [x] CTA to follow on Whatnot and join the stream
- [x] Newsletter/email signup to capture leads
- [x] Register route in App.tsx
- [x] Create Facebook ad strategy document with copy recommendations
- [x] Rename Facebook landing page route from /facebook to /giveaway
- [x] Move email popup to lower-left corner of the site (all pages)
- [ ] Upload 8 card images (Specter, Thor, Magneto, Nighthawk, Wolverine, Gambit, Molecule Man, Okoye) to CDN
- [x] Add card images throughout the giveaway page to make it visually stunning

## Giveaway Page Card Showcase Gallery
- [x] Add 8 Marvel card artwork images scattered throughout /giveaway page as floating/angled card displays
- [x] Add cinematic card showcase strip between hero and prize sections
- [x] Add floating card accents alongside How To Enter and Bonus sections
- [x] Add card fan gallery above the Final CTA section
- [x] Add hover effects and animations to all card images
- [x] Make Whatnot invite link (whatnot.com/invite/northlandfinds) prominently accessible everywhere on /giveaway page
- [x] Make Whatnot invite link (whatnot.com/invite/northlandfinds) prominently accessible everywhere on /giveaway page
- [x] Fix broken/incorrect links on /giveaway page (all links verified correct)
- [x] Fix all "Follow us on Whatnot" links site-wide to use invite link (whatnot.com/invite/northlandfinds) instead of store URL
- [x] Build admin-configurable countdown timer for giveaway page (set any date/time, live countdown display)
- [x] Add prominent clickable Whatnot invite link just below the $5,000 GIVEAWAYS headline on /giveaway page
- [x] Add "This might sound too good to be true" authenticity section to /giveaway page — explain community passion, showing cards, reading perspectives
- [x] Update giveaway page to mention NLF repacks are part of the giveaways
- [x] Add repack business launch teaser (launching later this month) to giveaway page
- [x] Add fast shipping pride messaging to /giveaway page
- [x] Add "cards for all types of collectors and budgets" messaging to /giveaway page

## Page Content Manager
- [x] Create pageContent DB table for editable page sections
- [x] Create backend routes for getting/updating page content (admin + public)
- [x] Build admin Page Content Manager UI in dashboard with editable fields
- [x] Make Giveaway page read editable content from DB (headline, description, prizes, Whatnot link, authenticity section)
- [x] Fallback to hardcoded defaults when no DB content exists
- [x] Remove $5,000 giveaway headline and related dollar amount references from /giveaway page
- [x] Rebuild /giveaway page as lean Facebook funnel: hero + CTA to Whatnot + $15 credit bonus, minimal content, fast conversion
- [x] Remove current hero section from /giveaway page and make $15 credit bonus section the main hero
- [x] Generate QR code for https://whatnot.com/invite/northlandfinds and replace current QR on /giveaway page (with NLF$15 center, saved to Google Drive)
- [x] Regenerate QR code with yellow NLF$15 text and square center box
- [x] Regenerate QR code with NLF logo in center (no text), linking to whatnot.com/invite/northlandfinds
- [x] Remove email signup form and QR code/Scan to Follow sections from /giveaway page

## Giveaway Page — Card Images & Centered Layout
- [x] Upload 5 Marvel card images (Doom, Gambit, Iron Man, Wolverine, Magneto) to CDN
- [x] Add card images to giveaway page for visual appeal
- [x] Center all text and CTAs on giveaway page (desktop and mobile)
- [x] Fix hero description text (removed $5,000 DB override, hardcoded correct copy)
- [x] Update card showcase CTA text: "Join a live stream..." → "Check out our streams..."
- [x] Remove "Cards You Could Win on Stream" heading from giveaway page
- [x] Update all Star Wars "June 2026" references to "Fall 2026" across the entire site (Footer, Home, StarWars, Subscribe, SiteMap)
- [x] Remove Star Wars from homepage hero — refocus on Marvel/MCU only
- [x] Update hero headline from "LOVE MARVEL OR STAR WARS?" to "LOVE MARVEL? START HERE."
- [x] Update hero description to focus on MCU/Marvel only
- [x] Update SEO title/description on homepage + default SEO to be Marvel-focused
- [x] Update announcement bar to remove Star Wars mention
- [x] Update Footer description and nav link (removed Star Wars, changed to Coming Soon)
- [x] Updated New to Collecting and Roadmap sections to remove Star Wars mentions
- [ ] Add MCU countdown section to homepage with dual movie countdowns
- [ ] Avengers: Doomsday (Dec 18, 2026) — main emphasis, large countdown
- [ ] Spider-Man: Brand New Day (July 31, 2026) — secondary countdown
- [ ] Live countdown timer (days, hours, minutes, seconds)
- [x] Fix hero description — change "just saw Avengers: Doomsday" to anticipation wording (movie not released yet)
- [x] Build "Marvel Cards to Collect Right Now" page (also works as Facebook ad landing page)
- [x] Hero section with strong hook for cold Facebook traffic
- [x] Top trending cards section tied to upcoming movies (Doomsday, Spider-Man)
- [x] Trending characters section with reasons why they're hot
- [x] Beginner tips section — what makes a card valuable
- [x] CTAs throughout pushing to shop, card database, Whatnot streams
- [x] Register route in App.tsx and add navigation links
- [x] Hide product checklists until their release date (don't reveal checklist contents before launch)
- [x] Update Checklists.tsx: unlock only after launch date (not 1 week before)
- [x] Update ChecklistDetail.tsx: use per-product launch date instead of hardcoded global date
- [x] Gate checklist data on server side so it's not sent before release
- [x] Audit XML sitemap — ensure all pages including /trending are listed
- [x] Add any missing pages to sitemap for Google crawling (added 13 pages: /trending, /giveaway, /market-intel + 5 articles, /star-wars, /marvel-card-hub, /submit-show, /whatnot)
- [x] Ensure future pages/blogs are always added to sitemap (blog posts already auto-added from DB)
- [x] Build reusable character card listing template page (auto-pulls from all checklists)
- [x] Create server-side tRPC query to get cards by character name across all products
- [x] SEO-optimize template for "character name + Topps Marvel cards + graded" keywords
- [x] Link character pages from /trending page
- [x] Register dynamic route /trending/:slug in App.tsx
- [x] Add character pages to sitemap for Google crawling (dynamic from DB)
- [x] Ensure new checklists auto-populate character pages without manual updates
- [x] Generate QR code linking to https://whatnot.com/invite/northlandfinds
- [x] Replace existing QR code on /whatnot page with new one (both top and bottom sections)
- [x] Replace Doctor Doom card image with Spider-Man CGC card on giveaway page
- [x] Wire MCU countdown timer into homepage (Doomsday Dec 2026 + Spider-Man July 2026) — already live
- [x] Add distinct background colors to each homepage section (black, green, purple, gold) to create visual breaks
- [x] Add image for Kang on /characters page
- [x] Add image for Red Skull on /characters page
- [x] Add sticky Doomsday countdown ticker at top of homepage that follows user on scroll
- [x] Add clickable links on Doomsday countdown ticker to navigate to /mcu-intel page
- [x] Add lightning/electrical shock effects to Doomsday countdown ticker (Doctor Doom inspired)
- [x] Rename MCU Intel to MCU News across entire site (page title, nav, links, references)
- [x] Add character-themed colors to MCU News article cards (Spider-Man red/blue, Doomsday green, etc.)
- [x] Generate unique character-themed thumbnail images for each MCU News article
- [x] Complete removal of ALL remaining MCU Intel references - replace with MCU News everywhere
- [x] Write featured Avengers: Doomsday article for MCU News page with green Doom theme and thumbnail

## CinemaCon 2026 Doomsday Article
- [x] Write CinemaCon Avengers Doomsday article and add to MCU News page
- [x] Generate CinemaCon-themed featured image for article
- [x] Insert article into database as featured + published

## CinemaCon 2026 Article Series (6 articles)
- [x] Article 1: Infinity Vision — Disney's IMAX Killer (publish NOW)
- [x] Article 2: Doomsday Trailer Breakdown — Every Scene Described (schedule 6am tomorrow)
- [x] Article 3: Steve Rogers Returns — Chris Evans Is Back (schedule 11am tomorrow)
- [x] Article 4: X-Men Meet the Avengers — Every Mutant Confirmed (schedule 3pm tomorrow)
- [x] Article 5: Doom Catches Mjolnir — Most Powerful MCU Villain (schedule 6pm tomorrow)
- [x] Article 6: Dune 3 vs Doomsday — December Box Office War (bonus article)
- [x] Generate featured images for all 6 articles
- [x] Schedule publishing for articles 2-6 at specified times

## Navigation Update
- [x] Add MCU News link to navigation bar with red lettering to highlight it

## Homepage MCU News Section
- [x] Add Latest MCU News section to homepage that auto-displays recent published articles

## Article Publishing Schedule (April 17, 2026)
- [x] Publish Doomsday Trailer Breakdown article NOW (~2:40pm CT)
- [x] Schedule Steve Rogers Returns for 3:30pm CT
- [x] Schedule X-Men Meet Avengers for 5:00pm CT
- [x] Schedule Doom Catches Stormbreaker for 7:00pm CT

## Automated Daily Publishing (6am / 12pm / 7pm CT)
- [x] Build auto-publish system that publishes draft articles at 6am, 12pm, 7pm CT daily
- [x] Articles use scheduledAt field — scheduler checks every 5 min and auto-publishes
- [x] Updated blog auto-generation from 8am/1pm/6pm to 6am/12pm/7pm CT
- [x] Added publishScheduledArticles() to db.ts for MCU News articles

## Facebook Posts for Scheduled Articles
- [x] Write Facebook post for Doomsday Trailer Breakdown
- [x] Write Facebook post for Steve Rogers Returns
- [x] Write Facebook post for X-Men Meet Avengers
- [x] Write Facebook post for Doom Catches Stormbreaker

## MCU News Page Bug Fix
- [x] Fix featured article card on MCU News page — excerpt text overlapping image, title cut off on mobile

## New MCU Articles - April 17 Batch (from Google News)
- [x] Research all Doomsday trailer news + Endgame re-release news
- [x] Write article about Avengers Endgame re-release (new footage, Infinity Vision, Sept 25)
- [x] Write article about Doomsday trailer leak controversy
- [x] Write article about RDJ as Doctor Doom (scarred face, motion capture, accent)
- [x] Write article about X-Men/Gambit/Magneto officially joining MCU
- [x] Generate featured images for all new articles
- [x] Insert articles into database with scheduled publishing (6am/12pm/7pm CT Apr 18 + 6am Apr 19)
- [x] Write Facebook posts for the new articles

## CinemaCon Anti-Leak & Anticipation Article
- [x] Research CinemaCon 2026 security measures to prevent trailer leaks
- [x] Research all other trailers shown at CinemaCon 2026 (not just Doomsday)
- [x] Write article about CinemaCon lockdown + other trailers building anticipation
- [x] Generate featured image for the article
- [x] Insert article into database with scheduled publishing (12pm CT April 19)
- [x] Write Facebook post for the article

## Facebook Like/Follow Page Integration
- [ ] Add Facebook Follow/Like CTA button in the site footer
- [ ] Add Facebook Follow CTA on MCU News article pages (after article content)
- [ ] Add Facebook community section on homepage
- [ ] Ensure Facebook icon links in footer/header go to NLF Facebook page

## New Article Batch — April 18, 2026
- [ ] Article 10: Spider-Man Brand New Day CinemaCon Breakdown (hero image + FB image + article + FB post)
- [ ] Article 11: Edward Norton Hulk Variant Rumors (hero image + FB image + article + FB post)
- [ ] Article 12: Doomsday $700M Budget Analysis (hero image + FB image + article + FB post)
- [ ] Article 13: Doomsday Trailer Not Released Online Yet (hero image + FB image + article + FB post)
- [ ] Article 14: Topps Finest Fantastic Four 65th Anniversary (hero image + FB image + article + FB post)
- [ ] Article 15: Marvel/DC Crossover Comics Collected (hero image + FB image + article + FB post)
- [ ] Article 16: Dune 3 vs Doomsday December Box Office War (hero image + FB image + article + FB post)
- [ ] Article 17: Trading Card Market Booming - TCGPlayer CEO (hero image + FB image + article + FB post)

## Image Fix — Doomsday Trailer Leak Article
- [x] Replace Superman image on avengers-doomsday-trailer-leak-cinemacon-real-or-ai article with funny Doctor Doom in pink suit

## Article Layout Variations & Multi-Image Support
- [ ] Build alternating article layout templates (image-top, image-right/text-left, image-left/text-right)
- [ ] Add layout field to articles database schema
- [ ] Support multiple inline images per article (not just hero image)
- [ ] Cycle layouts automatically so each article looks different
- [ ] Generate 2-3 images per article (hero + inline images)

## Card Site Links in Articles
- [x] Add rotating card site links to ALL articles (mintcomiccards.com, comicbookcard.com, riseofdoom.com) — never same site back-to-back

## Giveaway Page Redesign
- [x] Redesign giveaway page with more hype, energy, and better layout for Whatnot singles shows
- [ ] Write Facebook post driving people to Whatnot singles show via giveaway page

## Giveaway Page Mobile Optimization
- [x] Add multiple Whatnot invite buttons (whatnot.com/invite/northlandfinds) throughout the page
- [x] Optimize entire giveaway page for mobile (iOS & Android) — killer mobile experience
- [x] Add sticky mobile CTA bar at bottom of screen (yellow $15 Credit + green Our Shows)
- [x] Make all buttons full-width on mobile with 48px+ touch targets
- [x] Add snap-scroll to mobile card showcase for better swipe experience
- [x] Add dual CTAs (invite + upcoming shows) to every section
- [x] Responsive text sizing (smaller on mobile, larger on desktop)
- [x] Safe area padding for iOS notch/home indicator

## Giveaway Page Button Color Fix
- [x] Change black buttons to alternate green/purple per section on giveaway page

## Giveaway Page Two-Color Buttons Per Section
- [x] Make each section's two buttons different colors (one green, one purple), alternating lead per section

## MCU News Daily Rotating Featured Article
- [x] Implement daily round-robin rotation for featured/hero article on MCU News page
- [x] Featured article changes automatically each morning (by day of year modulo article count)
- [x] Also rotate the full article grid daily so different articles get top placement

## Giveaway Page - Add NLF Repacks
- [x] Add NLF Repacks to hero description text
- [x] Add NLF Repacks as a prize category in "What We Give Away" section

## Whatnot Page Redesign
- [x] Make Whatnot page (/whatnot) match the same design/content as the Giveaway page (/giveaway)

## New MCU News Articles - April 19, 2026
- [x] Research latest Marvel Doomsday/MCU news topics (CinemaCon, test screenings, F4 box office, Phase 6)
- [x] Write 5 articles with AI-generated images, card collecting tie-ins, and Collector's Corner
- [x] Publish all 5 articles immediately (breaking CinemaCon news)
- [ ] Schedule future article batches at 6AM/11AM/5PM rotation

## Daily Topps Marvel Trading Card Articles
- [ ] Research Topps reclaiming Marvel/Disney license in 2025
- [ ] Write first article: Topps returns to Marvel in 2025 after reclaiming licensing rights
- [ ] Publish first article immediately
- [ ] Schedule daily recurring task for Topps Marvel articles at 6AM/11AM/5PM

## MCU News Sort Order Fix
- [x] Remove daily round-robin rotation from MCU News page
- [x] Sort articles newest to oldest (standard chronological)
- [x] Fix and publish Topps Marvel license article (ID: 300055)

## Repack Launch Date Update
- [x] Update all repack products to launch date May 21, 2026
- [x] Updated Gambit's Deck, Variant Series, Snap Collection, Multiverse Vault (all 11 repacks)
- [x] Updated Shop.tsx section headers (DROPPING MAY 21ST)
- [x] Updated product line taglines
- [x] Snap Collection and Multiverse Vault now marked as available (not Coming Soon)
- [x] Article: Marvel Returns to Hall H — SDCC 2026 Doomsday Panel (published Apr 21)
- [x] Article: Avengers Endgame Doomsday Retcon — Re-Release with New Footage (published Apr 21)
- [x] Article: Avengers Doomsday CinemaCon Trailer Breakdown — Every Detail (published Apr 21)
- [x] Article: Doctor Doom Stops Stormbreaker — 6 Jaw-Dropping Trailer Moments (published Apr 21)
- [x] Updated integrity check script: MCUIntel.tsx → MCUNews.tsx references
- [x] Change notification email from pulljack1979@gmail.com to contact@nlfservices.com (resolved: disabled Manus notifications, GHL handles all)
- [x] Route form notification emails to contact@nlfservices.com instead of Manus account email (resolved: disabled Manus notifications)
- [x] Remove notifyOwner email notifications from form submissions (subscribe, card show) — GHL handles contacts
- [ ] Article: Complete MCU Release Calendar 2025-2027 (movies, series, cartoons)
- [ ] Article: Every Upcoming MCU Disney+ Series Ranked by Hype
- [ ] Article: Marvel Animation Renaissance — Your Watch Party Guide
- [ ] Article: Which MCU Phase 6 Movies Will Have the Best Trading Cards?
- [ ] New Page: MCU Spotlight with 3 rotating round-robin templates
- [ ] Template A: Actor left, character/card info right, chase cards below
- [ ] Template B: Full-width hero banner, actor bio below, chase cards grid
- [ ] Template C: Split diagonal, cards prominent, actor/series info
- [ ] Orange placeholder images (1,2,3) with dimensions labeled
- [ ] Actor-to-character-to-card cross-reference system
- [ ] Chase cards section per character
- [ ] Backend: spotlight data model and tRPC procedures
- [ ] Route /mcu-spotlight and navigation entry
- [x] Add concept images to MCU Release Calendar article (Doomsday, Spider-Man, Secret Wars, Punisher, X-Men 97, VisionQuest, Endgame)

## Daredevil Born Again Deep-Dive Article
- [x] Research Daredevil Born Again cast, episodes, plot, card market impact
- [x] Generate featured and inline images for article
- [x] Write full article with actor-to-card cross-references
- [x] Publish article to database
- [x] Verify article displays correctly

## Trading Card Grading Articles (3-part series)
- [x] Research PSA acquisitions, GemRate data, antitrust lawsuit, pricing
- [x] Research grading arbitrage / crossover strategy
- [x] Research authentication vs premium grading, Pokemon dominance
- [x] Generate hero images for all 3 articles (5 images total)
- [x] Write Article 1: "PSA's Monopoly Play" — acquisitions, antitrust, pricing
- [x] Write Article 2: "The Grading Arbitrage" — crossover strategy guide
- [x] Write Article 3: "Does Grading Even Matter?" — authentication vs premium slabs
- [x] Publish all 3 articles to database
- [x] Set "Does Grading Even Matter?" as featured article

## Grading Article Image Overhaul
- [x] Regenerate all grading article images with Marvel card focus and comic/animated style
- [x] Generate NORAD-style secret grading facility image with "CLOSED TO PUBLIC" vault door
- [x] Update all 3 grading articles with new images in database
- [x] Verify updated articles display correctly

## Grading Article Images - Marvel Only Fix
- [x] Identify all DC (Superman, Batman) and Pokemon images in grading articles
- [x] Regenerate all non-Marvel images with Marvel-only characters (Spider-Man, Iron Man, Wolverine, etc.)
- [x] Update all 3 grading articles in database with Marvel-only images
- [x] Verify no DC or Pokemon content remains in any article images

## Grading Articles - Marvel Only Images + Staggered Dates
- [x] Regenerate ALL grading article images with Marvel-only characters (no DC, no Pokemon)
- [x] Update "Does Grading Even Matter?" - keep Apr 24 publish date
- [x] Update "PSA's Monopoly Play" - change to May 1 publish date (draft)
- [x] Update "The Grading Arbitrage" - change to May 8 publish date (draft)
- [x] Verify no DC or Pokemon content in any article images

## Topps Marvel Set Articles (New Request)
- [ ] Research and write 2025 Topps Marvel Studios Chrome article
- [ ] Research and write 2025 Topps Comic Book Heroes article
- [ ] Research and write 2025 Topps Marvel Collect article
- [x] Research and write 2025 Topps Marvel Mint article (published Apr 25)
- [ ] Generate Marvel-only images for all 4 articles
- [ ] Publish all 4 articles to database

## Topps Marvel Set Articles (Daily - Apr 25-28)
- [ ] Apr 25: 2025 Topps Marvel Studios Chrome - Collector's Buyer Guide
- [ ] Apr 26: 2025 Topps Comic Book Heroes - The Art Collector's Set
- [x] Apr 25: 2025 Topps Marvel Mint - The Hidden Gem of 2025 (PUBLISHED)
- [ ] Apr 28: 2025 Topps Marvel Collect - Digital Meets Physical
- [ ] Generate Marvel-only images for all 4 set articles

## Grading Articles - Staggered Weekly
- [ ] May 1: PSA's Monopoly Play publish date update
- [ ] May 8: The Grading Arbitrage publish date update

## SDCC 2026 Articles (Future - June/July)
- [ ] Jun 12: SDCC 2026 Marvel Card Collector's Survival Guide
- [ ] Jun 19: Every SDCC Exclusive Marvel Card Ever Made
- [ ] Jul 3: SDCC 2026 Preview - Marvel Announcements That Could Move the Card Market

## Draft/Schedule System
- [x] Add scheduledAt support to article router input schema
- [x] Add scheduled date picker to ArticleManager editor
- [x] Show scheduled date badge on draft articles in list view
- [x] Add "Publish Now" rocket button for draft articles
- [ ] Set up daily scheduled task for auto-publishing drafts (existing blog-scheduler handles this)

## Interactive Articles Section
- [x] Add "interactive_social" category to articles schema
- [x] Add Interactive filter to admin ArticleManager
- [x] Filter interactive articles from public MCU News page
- [ ] Create batch of interactive poll content with images for Facebook
- [ ] Interactive articles never auto-publish - always stay as drafts for manual social posting

## Top 15 Strongest Marvel Characters Article
- [x] Read NLF Article Publisher skill and references
- [x] Generate featured image (cosmic showdown / Doctor Doom)
- [x] Generate inline images (cosmic entity, magic user)
- [x] Write full article with 15-character ranking and Collector's Corner
- [x] Create and run publish script
- [x] Run integrity check
- [x] Save checkpoint
- [x] Provide direct link and Facebook post to user

## Avengers: Endgame 7th Anniversary Article
- [ ] Research Endgame re-release details (September 2025/2026)
- [ ] Read NLF Article Publisher skill and references
- [x] Generate featured image (Endgame anniversary themed)
- [x] Generate inline images (iconic moments, card market)
- [ ] Write full article with anniversary + re-release + card market tie-ins
- [ ] Create and run publish script
- [ ] Run integrity check
- [x] Save checkpoint
- [x] Provide direct link and Facebook post to user

## Avengers: Endgame 7th Anniversary Article
- [x] Research Endgame re-release details (September 2025/2026)
- [x] Read NLF Article Publisher skill and references
- [x] Pull Thanos cards from database (Marvel Mint + Marvel Studios Chrome)
- [x] Generate featured image (Endgame anniversary themed)
- [x] Generate inline images (iconic moments, card market)
- [x] Write full article with anniversary + re-release + Thanos cards + card market tie-ins
- [x] Create and run publish script
- [x] Run integrity check
- [x] Save checkpoint
- [x] Provide direct link and Facebook post to user

## Update Endgame Article with Real Card Images
- [x] Find actual Thanos card images (Marvel Mint #77, Marvel Studios Chrome #100, Gambit's Deck H-8)
- [x] Find actual Iron Man card images (Marvel Studios Chrome #1, R-5 Reflections)
- [x] Upload card images to CDN (5 images)
- [x] Update article contentMarkdown with real card images and subsection headings
- [x] Verify all 5 card images render correctly on live site
- [x] Run integrity check (81/81 passed)
- [x] Save checkpoint and deliver to user

## Remove Non-Topps Cards from Endgame Article + Facebook Post
- [x] Query current article content from database
- [x] Replace Iron Man #1 image with correct Topps Chrome version (was Upper Deck)
- [x] Remove Iron Man/Doom R-5 Reflections insert (not confirmed Topps) image and section
- [x] Keep only Topps cards: Thanos #77 Mint, Thanos H-8 Gambit's Deck, Thanos #100 Chrome, Iron Man #1 Chrome
- [x] Update article text to flow properly after removals
- [x] Verify no non-Topps references remain
- [x] Write attention-catching Facebook post
- [x] Save checkpoint and deliver

## 10 New Articles for Dashboard Queue
- [x] Article 1: Topps Takes Over the NFL Draft 2026
- [x] Article 2: 2025 Topps Marvel Mint — From $450 Retail to $600+ Aftermarket
- [x] Article 3: SDCC 2026 Collector's Preview — What Topps Exclusives Could Drop
- [x] Article 4: 2026 Topps Finest Fantastic Four — First Look and Collector's Guide
- [x] Article 5: The Topps Marvel Timeline — Every 2025-2026 Release Ranked
- [x] Article 6: Why SDCC Exclusive Cards Are the Hottest Investment in the Hobby
- [x] Article 7: Iron Man to Doctor Doom — The Robert Downey Jr. Card Collecting Guide
- [x] Article 8: 5 Topps Marvel Cards Under $50 That Could 10x Before Doomsday
- [x] Article 9: Topps Collector Destination — How the Hobby Is Going Mainstream
- [x] Article 10: SDCC 2026 Hall H Preview — Every Marvel Announcement That Could Move the Card Market
- [x] Generate 10 featured images
- [x] Write and publish all 10 articles
- [x] Run integrity check (81/81 passed)
- [x] Save checkpoint and deliver

## Top 15 Strongest Characters Article — Comic-Realistic Images
- [x] Review current article content and existing images
- [x] Generate 10 comic-realistic character artworks (Thor, Thanos, Galactus, Loki, Scarlet Witch, Death, Franklin Richards, God Emperor Doom, Living Tribunal, One Above All)
- [x] Upload images to CDN
- [x] Update article with character images (alternating left/right float, #1 centered full-width)
- [x] Verify all 10 images render correctly on live site
- [x] Save checkpoint and deliver

## Article: 2025 Topps Comic Book Heroes Hidden Gem
- [x] Research 1975/1976 Topps Marvel sticker sets history
- [x] Extract checklist and odds data from PDFs
- [x] Research eBay sold prices and PriceCharting market data
- [x] Analyze missing characters and 2026 speculation
- [x] Generate 5 article images (featured, vintage, market, missing, speculation)
- [x] Write full article with all sections and Collector's Corner
- [x] Publish article to database
- [x] Pass all 81 integrity checks

## Articles: Avengers Doomsday & Secret Wars Card Collecting Guides (April 30, 2026)
- [x] Analyze YouTube video on Doomsday/Secret Wars storylines
- [x] Research confirmed cast (23+ characters) and rumored characters
- [x] Research card market data (PriceCharting, eBay sold prices)
- [x] Generate featured images for both articles
- [x] Write Doomsday card collecting guide (30+ characters, tiered strategy, budget guide)
- [x] Write Secret Wars card collecting guide (Battleworld leads, multiverse variants, set recommendations)
- [x] Publish both articles to database
- [x] Integrity check passed (81/81)

## Articles: Marvel Mint, Doom Comic Cuts, Gambit's Deck, AGS Grading (May 2026)
- [x] Research 2025 Topps Marvel Mint SDCC set details (Topps Ripped, ChecklistInsider)
- [x] Research riseofdoom.com for Doctor Doom Comic Cuts context
- [x] Research mintcomiccards.com for Gambit's Deck checklist
- [x] Research AGS grading technology and comparison to PSA/CGC/TAG
- [x] Generate featured and inline images for all four articles
- [x] Write and publish Marvel Mint SDCC article
- [x] Write and publish Doctor Doom Comic Cuts article
- [x] Write and publish Gambit's Chrome Deck article
- [x] Write and publish AGS Grading comparison article
- [x] Verify all 81 integrity checks pass

## Article: Comics Explained (Rob Jefferson) — May 2026
- [x] Research Comics Explained YouTube channel (2.62M subs, 1B+ views, 3,714 videos)
- [x] Research Rob Jefferson background (Robert Jefferson, 25+ years reading comics)
- [x] Generate featured image (comic book desk with Marvel graphic novels and podcast mic)
- [x] Write article covering channel overview, Marvel deep dives, collector relevance
- [x] Publish to database with card sites: TCGPlayer, eBay, PSA
- [x] Integrity check passed (81/81)

## Fix: Gambit's Deck Featured Image — DC/Batman Characters Detected
- [x] Regenerate gambit-deck-featured.jpg with STRICTLY Marvel-only characters (no DC/Batman)
- [x] Upload new image to CDN
- [x] Update article in database with new image URL
- [x] Run integrity check (81/81)
- [x] Save checkpoint

## Rewrite: Avengers Doomsday Card Collecting Guide - Topps Only
- [ ] Remove all references to Upper Deck, Panini, and other unlicensed brands
- [ ] Rewrite to focus exclusively on Topps products (Marvel Mint, Chrome, Cosmic, etc.)
- [ ] Update article in database
- [ ] Verify changes on live site

## Rewrite: Avengers Doomsday Card Collecting Guide - Topps Only
- [x] Remove all references to Upper Deck, SkyBox, Panini, Impel, Fleer, and other unlicensed brands
- [x] Rewrite to focus exclusively on Topps products (Marvel Mint, Chrome, Chrome Studios, Comic Book Heroes, The Collector)
- [x] Update article in database
- [x] Verify no non-Topps brand references remain (verification passed)
- [x] Run integrity check (81/81)

## Fix: Remove Specific Pricing from Avengers Doomsday Article
- [x] Fetch current article content
- [x] Remove all specific dollar amounts and pricing references
- [x] Replace with evergreen language (e.g., "commanding premium prices", "budget-friendly")
- [x] Update article in database
- [x] Save checkpoint

## Tony Stark vs Doctor Doom Article (May 5, 2026)
- [x] Analyze YouTube video on Tony Stark vs Doom parallels (7Q_sYAZgwR8)
- [x] Analyze YouTube video on Doom kills Kang concept (xjrsvzKKYSg)
- [x] Research from ComicBook.com, Den of Geek, Kevin Feige quotes
- [x] Generate featured image (split duality composition)
- [x] Generate inline images (Doom vs Kang Council, Stark/Doom parallels, God Emperor Doom)
- [x] Write full article with 7 sections + Collector's Corner
- [x] Publish to database as featured article (category: analysis)
- [x] Run integrity check (81/81 passed)

## Top 10 MCU Villains Article
- [x] Research top MCU villains for the list
- [x] Write full article (Doctor Doom #1, Thanos #2)
- [x] Generate featured image
- [x] Publish to database
- [ ] Create Facebook post for the article

## Avengers Doomsday 14-Article Series (May 2026)
- [ ] Article 1: The Original Six — Who Returns for Doomsday? (TEAM)
- [ ] Article 2: Top 5 Cards to Buy Before Thunderbolts Drops (FILLER)
- [ ] Article 3: The Thunderbolts — From Villains to Heroes (TEAM)
- [ ] Article 4: Secret Wars 1984 vs 2015 — A Collector's Guide (FILLER)
- [ ] Article 5: The Fantastic Four — Doom's Greatest Enemies (TEAM)
- [ ] Article 6: MCU Phase 6 Rumor Roundup (FILLER)
- [ ] Article 7: The Young Avengers — Next Generation Assembled (TEAM)
- [ ] Article 8: Grading Guide: When to Send Cards to PSA vs CGC (FILLER)
- [ ] Article 9: The X-Men — Mutants Enter the MCU (TEAM)
- [ ] Article 10: 5 Undervalued Doom Cards Right Now (FILLER)
- [ ] Article 11: Doom's Army — The Cabal Assembles (TEAM)
- [ ] Article 12: Multiverse of Madness Card Market 1 Year Later (FILLER)
- [ ] Article 13: The Multiverse Avengers — Every Variant Assembled (TEAM)
- [ ] Article 14: Weekly Card Market Movers (FILLER)
- [ ] Generate featured images for all 14 articles
- [ ] Interlink all articles to each other
- [ ] Schedule daily publishing (1 per day starting May 7)
- [ ] Every article links to Whatnot page (mandatory)
- [ ] Rotate links to comicbookcard.com, riseofdoom.com, mintcomiccards.com

## Avengers Doomsday 14-Article Series — PUBLISHED
- [x] Article 1: The Original Six — Who Returns for Doomsday? (republished May 12 6am)
- [x] Article 2: Top 5 Cards to Buy Before Thunderbolts Drops (published May 8)
- [x] Article 3: The Thunderbolts — From Villains to Heroes (republished May 12 12pm)
- [x] Article 4: Secret Wars 1984 vs 2015 — A Collector's Guide (published May 10)
- [x] Article 5: The Fantastic Four — Doom's Greatest Enemies (republished May 12 6pm)
- [x] Article 6: MCU Phase 6 Rumor Roundup (published May 12)
- [x] Article 7: The Young Avengers — Next Generation Assembled (republished May 13 6am)
- [x] Article 8: Grading Guide: When to Send Cards to PSA vs CGC (published May 14)
- [x] Article 9: The X-Men — Mutants Enter the MCU (republished May 13 12pm)
- [x] Article 10: 5 Undervalued Doom Cards Right Now (published May 16)
- [x] Article 11: Doom's Army — The Cabal Assembles (republished May 14 6am)
- [x] Article 12: Multiverse of Madness Card Market 1 Year Later (published May 18)
- [x] Article 13: The Multiverse Avengers — Every Variant Assembled (republished May 14 12pm)
- [x] Article 14: Weekly Card Market Movers (published May 20)
- [x] All 14 articles have Whatnot links (northlandlegendaryfinds.com/whatnot)
- [x] All 14 articles have rotating partner links (comicbookcard.com, riseofdoom.com, mintcomiccards.com)
- [x] All 14 articles interlinked to each other
- [x] Scheduled daily publishing (1 per day starting May 7)
- [x] Verified on live site

## Yellow Whatnot CTA Button on All Articles
- [x] Add prominent yellow CTA button to every MCU News article page
- [x] Tone: community invite, NOT salesy — "free giveaways + $15 credit for new users"
- [x] Button links to /whatnot page (referral funnel)
- [x] Make it a permanent component so all future articles automatically get it
- [x] Goal: Facebook boost → article → trust → Whatnot signup → referral credits pay for ads
- [x] Test on live articles
- [x] Fixed malformed partner link text in all 14 articles
- [x] Save checkpoint

## Mid-Article Whatnot Banner (Page Break)
- [x] Add a mid-article yellow Whatnot banner that acts as a visual page break
- [x] Position after first major section (catches readers while engaged)
- [x] Different copy from bottom CTA to avoid repetition
- [x] Clean, eye-catching but not intrusive design
- [x] Automatic for all articles (template-level, not content-level)
- [x] Test on live dev server
- [x] Save checkpoint

## Fix Article Publish Dates (No Future Dates)
- [x] Update all 14 Doomsday articles to have past/present dates (not future)
- [x] Spread dates across Apr 25 - May 8, 2026 (one per day)
- [x] Verify on live site
- [x] Save checkpoint

## 2025 Topps Marvel Mint Gambit Chrome Deck Article
- [x] Research: Read checklist PDF and odds PDF
- [x] Research: Find top eBay sold listings / PriceCharting data for Gambit Deck cards
- [x] Extract card images from zip, organize by suit (52 front images)
- [x] Upload all 52 card images to CDN via manus-storage
- [x] Generate featured image (chrome cards with Gambit energy)
- [x] Write article with "All-Star Game" angle, top sales, Whatnot giveaway mention
- [x] Added Avengers: Doomsday / Spider-Man: Brand New Day cast connection angle
- [x] Build interactive card slideshow organized by suit (Hearts, Diamonds, Clubs, Spades)
- [x] Created dedicated /gambit-deck page with full gallery component
- [x] Added to sitemap
- [x] Verify on live site
- [x] Save checkpoint

## NLF Cosmic Hits - Checklists Page Rework
- [x] Rebrand checklists page from "Product Checklists" to "NLF Cosmic Hits"
- [x] Rework page to follow Hit Parade's simple grid layout (product image + name + View Checklist button)
- [x] Build modal/popup for viewing individual checklists (flat card list with pulled/available status)
- [x] Update navigation label from "Checklists" to "Cosmic Hits" (nav, footer, sitemap)
- [x] Ensure admin can still mark cards as pulled after each stream (existing admin routes preserved)
- [x] Test and save checkpoint (275 tests, 81/81 integrity)

## NLF Cosmic Hits - Remove Products (Building Later)
- [x] Remove product cards from /checklists page (keep page shell/branding only)
- [x] Show "Coming Soon" or placeholder messaging instead
- [x] Save checkpoint

## NLF Cosmic Hits - Show Variant Series Images + Coming Soon Only
- [x] Add Variant Series product images (Cosmic Drop purple bag + Chrome Edition silver bag) to the page
- [x] Ensure page shows Coming Soon only — no prices, no details, no checklists
- [x] Save checkpoint

## MCU Spotlight - Replace Placeholder Images
- [x] Replace Placeholder 1 (600x750 actor portrait) with character images for Daredevil, Doctor Doom, Spider-Man
- [x] Replace Placeholder 2 (600x340 scene/promo image) with character images
- [x] Replace Placeholder 3 (1100x300 chase cards banner) with character banner images
- [x] Save checkpoint

## Weekly Auto-Update for Card Shows & Market Intel
- [ ] Determine best approach for weekly auto-updates (AGENT cron vs Heartbeat)
- [ ] Set up weekly scheduled task for card shows page refresh
- [ ] Set up weekly scheduled task for market intel page refresh
- [ ] Save checkpoint and deploy

## Remove Marvel Resources from Navigation Bar
- [x] Remove "Marvel Resources" button/dropdown from the navigation component
- [x] Save checkpoint

## Card Shows - Past Shows Filter
- [x] Add filter tabs (Upcoming / All Shows / Past Shows) to Card Shows page
- [x] Grey out past shows with "PAST" badge (keep visible for SEO)
- [x] Default view shows upcoming shows only
- [x] Past shows still render full details for SEO backlink value
- [x] Save checkpoint

## MCU News - Auto-Rotate Featured Articles
- [x] Change featured articles logic to auto-rotate (newest + 3 days ago + 4 days ago)
- [x] Remove hardcoded featured article selection
- [ ] Save checkpoint

## Hide Shop Page
- [x] Remove Shop from navigation bar
- [x] Remove Shop from footer links
- [x] Remove Shop from any other visible references (MobileMenu, SiteMap, About, Home)
- [x] Keep Shop page code intact (just hidden)
- [x] Save checkpoint

## Add 2026 Topps Finest Fantastic Four Set
- [ ] Research full checklist for 2026 Topps Finest Fantastic Four
- [ ] Add set to card database with same layout as existing sets
- [ ] Save checkpoint

## New Article Batch — Creator Spotlights, History, Doomsday Teams
- [x] Research: Avengers Doomsday confirmed teams and rosters
- [x] Research: Jack Kirby biography and Marvel legacy
- [x] Research: Stan Lee biography and Marvel legacy
- [x] Research: Jonathan Hickman and his Marvel runs (Secret Wars, FF, X-Men)
- [x] Research: 1975 Topps Marvel stickers/cards history
- [x] Generate featured images for all articles
- [x] Write & publish: Jack Kirby creator spotlight
- [x] Write & publish: Stan Lee creator spotlight
- [x] Write & publish: Jonathan Hickman creator spotlight
- [x] Write & publish: History of Marvel Trading Cards (1975 Topps origin)
- [x] Write & publish: Avengers team breakdown (Doomsday)
- [x] Write & publish: X-Men team breakdown (Doomsday)
- [x] Write & publish: Fantastic Four team breakdown (Doomsday)
- [x] Write & publish: Full Doomsday roster "All Together" article
- [x] Each article has: Whatnot CTA, subtle collecting angle, Facebook post at end
- [x] Stagger publish dates (2-3 per day)
- [x] Write & publish: Wolverine character spotlight
- [x] Write & publish: Doctor Doom character spotlight
- [x] Write & publish: Spider-Man character spotlight
- [x] Write & publish: Thor character spotlight
- [x] Write & publish: Captain America (Sam Wilson) character spotlight
- [x] Write & publish: Doctor Strange character spotlight
- [x] Write & publish: Magneto character spotlight
- [x] Write & publish: Loki character spotlight
- [x] Save checkpoint

## More Character Spotlight Articles
- [x] Write & publish: Cyclops character spotlight
- [x] Write & publish: Gambit character spotlight
- [x] Write & publish: Storm character spotlight
- [x] Write & publish: Scarlet Witch character spotlight
- [x] Write & publish: Black Panther character spotlight
- [x] Write & publish: Shang-Chi character spotlight
- [ ] Save checkpoint

## Add 2026 Topps Finest Fantastic Four Set to Card Database
- [ ] Upload box image and create set entry
- [ ] Insert all base cards and insert sets
- [ ] Save checkpoint

## Extract All Facebook Posts
- [x] Extract Facebook posts from all 16+ articles into one document
- [ ] Save checkpoint

## Doctor Doom Origin Story Article — Cynthia Von Doom & Mephisto (Mother's Day 2-Part Series)
- [x] Research: Doctor Doom's mother Cynthia, Mephisto deal, Triumph and Torment
- [x] Research: Screen Rant MCU theory for Doomsday connection
- [x] Write Part 1: Mother's Day — Cynthia's sacrifice (published today, featured)
- [x] Write Part 2: Triumph and Torment twist (auto-publishes tomorrow 9am CDT, featured)
- [x] Include card images from CBH/Sapphire (Doom, Strange)
- [x] Include Whatnot CTA and Facebook posts for both parts
- [x] Publish both to database
- [ ] Save checkpoint

## SEO Upgrades (Video Strategy Implementation)
- [x] Add Organization JSON-LD schema to site-wide layout (brand, logo, social links)
- [x] Add Article JSON-LD schema to individual article pages (author, datePublished, image)
- [x] Add FAQ JSON-LD schema to article pages (Collector's Corner sections)
- [x] Add BreadcrumbList JSON-LD schema to all pages
- [x] Improve robots.txt for search engine crawling
- [x] Generate dynamic XML sitemap including all articles, character pages, card shows
- [x] Run PageSpeed Insights audit and fix flagged issues (DNS prefetch, preconnect, meta robots)
- [x] Audit meta descriptions across all pages for uniqueness and keyword targeting
- [x] Verify heading hierarchy (single H1, proper H2/H3 nesting) across pages
- [x] Add Bing meta verification tag for Bing Webmaster Tools
- [x] Add Google Search Console verification meta tag
- [ ] Prep instructions for user to verify domains in GSC and Bing

## Automated Marketing System
- [x] Redesign website popup with better offer, design, and dynamic content
- [ ] Build weekly newsletter email template in GHL (draft/paused - not sending)
- [ ] Set up GHL newsletter workflow automation (paused state)
- [x] Build auto-social post generator (article → Facebook post draft)
- [ ] Create card market alert system concept (future phase)

## The Little Things - Community/Journey/Giveaway Page
- [x] Build "The Little Things" page with personal story, giveaways, and community vibe
- [x] Add giveaway entry section (email signup for giveaway access)
- [x] Add personal journey narrative (hanging with son, embarrassing wife, the hobby)
- [x] Add community highlights section
- [x] Add page to navigation
- [x] Add page to sitemap

## Bug Fix: The Little Things Page Not Working
- [x] Diagnose why /the-little-things page isn't loading (works on dev, needs publish)
- [x] Fix the issue (page works, just needs publish to go live)
- [x] Verify page works on live site (verified on dev server)
- [x] Save checkpoint

## Marvel Families Article Series
- [x] Research Marvel families (Richards, Summers/Grey, Magneto, T'Challa/Storm, etc.)
- [x] Plan article series with card market tie-ins (Topps Marvel Mint, CBH, Chrome, Sapphire)
- [x] Generate hero images for each family article
- [x] Write and publish all family articles to database
- [x] Include Facebook posts for each article
- [x] Interlink all family articles
- [x] Run integrity checks and save checkpoint

## Marvel Families Article Series (Expanded)
- [x] Generate hero images for all 7 articles (1 overview + 6 deep dives)
- [x] Generate inline images (2-3 per article, ~15 total)
- [x] Write overview article "Marvel's Greatest Families" with all 6 families, comic citations, Doomsday ties
- [x] Write deep dive: The Richards Family
- [x] Write deep dive: The Summers-Grey Dynasty
- [x] Write deep dive: The House of Magnus
- [x] Write deep dive: The Parker Family
- [x] Write deep dive: The Royal Family of Wakanda
- [x] Write deep dive: The Wolverine Family
- [x] Interlink overview to all 6 deep dives and vice versa
- [x] Add all articles to sitemap (auto-included via dynamic sitemap)
- [x] Run integrity checks
- [x] Save checkpoint
- [x] Include Doctor Doom/Sue Storm alternate reality marriage (Secret Wars 2015) in Richards deep dive
- [x] Tie Doom's obsession with Reed's family into Avengers Doomsday angle
- [x] Generate image of Doom on Battleworld throne with Sue Storm

## Community Engagement Article — "Help Us Build Your Dream Repack"
- [x] Generate hero image (community/repack brainstorm theme)
- [x] Write article covering: pack sizes (100/500/1000), complete sets, exclusive inserts, team lots, budget to high-end
- [x] Include all product ideas: encased Topps Marvel set 1-120, Gambit Deck cards, Doctor Doom insert sets, team packs
- [x] Add community call-to-action (comment, email, social media feedback)
- [x] Include Facebook post for sharing
- [x] Publish to database
- [x] Verify article displays correctly
- [x] Run integrity checks
- [x] Save checkpoint with direct links
- [x] Update community repack article with scarcity system (limited card allocation per series)
- [x] Add live stream exclusivity detail (sets only available through Whatnot streams)
- [x] Add pre-auction sales concept
- [x] Save checkpoint
- [x] Add Rainbow Chase section to community repack article (/50, /25, /10, /5, /1 parallels)
- [x] Save checkpoint

## Meta Integration
- [x] Build Meta Conversions API (CAPI) server-side tracking
- [x] Add CAPI events: PageView, ViewContent, Lead, AddToCart, Purchase, Search, custom
- [x] Deduplicate with browser Pixel via event_id
- [x] Create frontend hook (useMetaTracking) for dual-firing browser + server events
- [x] Build Facebook Graph API posting module (text, link, photo, scheduled posts)
- [x] Build Facebook auto-posting infrastructure in Social Post Generator
- [x] Add "Publish to Facebook" button (requires Page Access Token from user)
- [x] Add Facebook connection status indicator in admin
- [x] Add env vars for META_CAPI_ACCESS_TOKEN, META_PIXEL_ID, FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN
- [x] Write vitest tests for CAPI and Facebook API modules (11 tests passing)
- [x] Run integrity checks (81/81 passing) and save checkpoint

## Fix Community Repack Article - Wrong Information
- [x] Fix "Complete Sets" section — removed all base card/refractor references
- [x] Rewrote to focus on NUMBERED parallel sets only (/99, /50, /25, /10, /5, /1)
- [x] Fixed budget tier "base card bundles" → "curated character bundles"
- [x] Updated excerpt to reflect numbered-only focus
- [x] Removed "Chrome Refractor" phrasing from scarcity example
- [x] Verified: no "base set", "base run", "refractor finish", or "base card bundles" remain
- [x] Save checkpoint

## Community Repack Article — Alternating Image/Text Layout
- [ ] Check if article renderer supports HTML for side-by-side layouts
- [ ] Generate character-specific images (Doom, Gambit, team shots, etc.)
- [ ] Rebuild article with alternating layout (img left/text right, then text left/img right)
- [ ] Verify layout renders correctly on desktop and mobile
- [ ] Save checkpoint

## Team Articles — Republish Dates Updated (May 12-14)
- [x] Update 7 team articles to publish across May 12 (yesterday), May 13 (today), May 14 (tomorrow)
- [x] Original Six: May 12 6am CDT
- [x] Thunderbolts: May 12 12pm CDT
- [x] Fantastic Four: May 12 6pm CDT
- [x] Young Avengers: May 13 6am CDT
- [x] X-Men: May 13 12pm CDT
- [x] Doom's Army (Cabal): May 14 6am CDT
- [x] Multiverse Avengers: May 14 12pm CDT
- [x] Verified on MCU News page — articles showing with correct dates
- [x] Save checkpoint

## Fix: Email Capture Popup X Button on Mobile
- [x] Make close/X button easily accessible on mobile (not blocked or off-screen)
- [x] Ensure popup doesn't block content on mobile
- [x] Test on mobile viewport
- [x] Save checkpoint

## Punisher: One Last Kill Article + Facebook Post
- [x] Research show details, reviews, fan reactions, MCU connections
- [x] Generate featured image for article
- [x] Write article covering the show and what people are saying
- [x] Publish article to database
- [x] Write Facebook engagement post asking fans how they liked it
- [x] Verify article on site
- [x] Save checkpoint

## Article Fan Voting Feature
- [x] Create articleVotes database table (articleId, reaction, visitorId, createdAt)
- [x] Add tRPC procedures for casting votes and getting vote counts
- [x] Build FanVoting UI component with emoji reactions and live results bar
- [x] Integrate voting component into MCUNewsArticle page
- [x] Test voting end-to-end
- [x] Save checkpoint

## Fan Vote Improvements
- [x] Move Fan Vote to top of article (right after header/featured image)
- [x] Restyle Fan Vote with bold red background to stand out
- [x] Build "Voting Grounds" section on MCU News page showing all active polls
- [x] Add backend route for fetching all article vote summaries
- [x] Test visually and save checkpoint

## Custom Marvel Voting Icons
- [x] Generate Hulk Smash icon for "Loved It"
- [x] Generate Mjolnir icon for "Worthy"
- [x] Generate Doctor Strange Time Stone icon for "Needed More Time"
- [x] Generate Thanos Infinity Gauntlet thumbs down icon for "Not For Me"
- [x] Upload icons and update FanVoting component
- [x] Update reaction labels and keys
- [x] Test and save checkpoint

## Voting Grounds Position & Style Fix
- [x] Move Voting Grounds to top of MCU News page (above search/filters)
- [x] Give Voting Grounds a red gradient background matching Fan Vote style
- [x] Test and save checkpoint

## Hide The Little Things Page
- [x] Remove The Little Things from navigation until content is built out
- [x] Keep the page/route intact but hidden from nav

## Voting Grounds Tab Fix
- [x] Add red "Voting Grounds" pill/tab to category filter bar on MCU News
- [x] Move Voting Grounds section back below timeline (not at very top)
- [x] Clicking tab scrolls to or filters to Voting Grounds section
- [x] Restyle: black background with red border (not solid red bg)
- [x] Test and save checkpoint

## Top Women of the MCU Article
- [x] Research top MCU women in upcoming films (Doomsday, F4, Thunderbolts, Spider-Man)
- [x] Research their comic history and card market values
- [x] Generate featured image for article
- [x] Write article with Collector's Corner and card site rotation
- [x] Publish to database
- [ ] Create Facebook engagement post
- [x] Verify article on site
- [ ] Save checkpoint

## Dedicated Voting Grounds Page + Nav Changes
- [x] Create standalone /voting-grounds page with all active polls
- [x] Add "Voting Grounds" to nav bar between Cosmic Hits and Events (green border, red text)
- [x] Change MCU News nav text to blue lettering
- [x] Add route in App.tsx
- [x] Test visually and save checkpoint

## Article Template Layout Variations (Keep Content Fresh)
- [x] Design 4-5 different article layout templates for visual variety
- [x] Template 1: Classic (current layout — hero image top, content below)
- [x] Template 2: Magazine-style (large pull quote, side images, multi-column sections)
- [x] Template 3: Spotlight/Profile (character focus with stats sidebar, card gallery)
- [x] Template 4: Timeline/Event (visual timeline, event-based with milestones)
- [x] Template 5: Listicle/Ranking (numbered entries with card thumbnails, comparison table)
- [x] Implement template selection logic (auto-assign or manual per article category)
- [x] Test all templates render correctly
- [x] Save checkpoint

## SEO Schema Markup (JSON-LD Structured Data)
- [ ] Audit current meta tags and schema implementation
- [ ] Add Organization schema (site-wide)
- [ ] Add WebSite schema with SearchAction (site-wide)
- [ ] Add Article/NewsArticle schema on MCU News articles
- [ ] Add BreadcrumbList schema on all pages
- [ ] Add Product schema on shop/product pages
- [ ] Add FAQPage schema on FAQ page
- [ ] Add CollectionPage schema on card database pages
- [ ] Add ItemList schema on listicle articles
- [ ] Verify Open Graph and Twitter Card meta tags
- [ ] Test with Google Rich Results standards
- [ ] Save checkpoint

## Collector's Corner + Affiliate Link System
- [x] Design affiliateLinks database table (name, url, imageUrl, category, characterTags, active, position)
- [x] Push database migration
- [x] Build tRPC routes for affiliate link CRUD (admin only)
- [x] Build admin Affiliate Links manager page
- [x] Build Collector's Corner component (auto-matches links by article tags/characters)
- [x] Integrate Collector's Corner into MCUNewsArticle page (all templates)
- [x] Add card site rotation defaults (COMC, MySlabs, eBay, Whatnot) as seed data (built into component)
- [x] Test component renders correctly with and without affiliate links
- [x] Save checkpoint

## Vision Quest Article
- [x] Research Vision Quest show (cast, plot, release date, trailer)
- [x] Research card market relevance for Vision, White Vision, Wanda
- [x] Add YouTube embed support to article content rendering
- [x] Generate featured image
- [x] Write full SEO article with embedded trailer
- [x] Publish to database
- [x] Verify article on site (YouTube embed working, Spotlight template rendering)
- [ ] Write Facebook post
- [x] Save checkpoint

## Movies & Series Section (Orange Branding)
- [x] Research Iron Man (2008) — box office, budget, reception, trailer, card market
- [x] Design database schema for movies/series entries
- [x] Build Movies & Series listing page with orange branding
- [x] Build Movie detail template (box office, budget, profit, legacy)
- [x] Build Series detail template (episodes, streaming data, renewal status)
- [x] Add Movies & Series to main navigation with orange letters
- [x] Publish Iron Man (2008) as first entry with embedded trailer
- [x] Verify on site
- [x] Add Movies & Series to sitemap
- [x] Save checkpoint (3175f321)

## Card Base Set Image Upload (User-Provided Photos)
- [x] Compress Marvel Mint 100 card images to WebP and upload to CDN
- [x] Compress CBH 149 front + 149 back card images to WebP and upload to CDN
- [x] Update database imageUrl for Marvel Mint cards (100 base cards)
- [x] Update database imageUrl and backImageUrl for CBH cards (149 cards)
- [x] Fix CDN URLs to use /manus-storage/ relative paths
- [x] Verify images display on Card Database pages
- [x] Save checkpoint (353c781a)

## Gambit's Deck Cleanup (Marvel Mint)
- [x] Identify and remove non-Topps Gambit cards from database (52 "GAMBIT'S DECK" GD-* entries deleted)
- [x] Reorder Gambit's Deck: 2 through Ace, Clubs → Diamonds → Hearts → Spades
- [x] Verify on live site — 4-column layout shows correct order
- [x] Save checkpoint (ddaf66ef)

## Marvel Mint Image Fixes (Platinum + Autograph)
- [x] Identify cards needing replacement: 6 Platinum + 15 Autograph = 21 total
- [x] Regenerate 6 Platinum cards (Thor #105, Hulk #109, Dr Strange #110, Prof X #117, Invisible Woman #118, Gambit #119)
- [x] Regenerate 15 Autograph cards (A-1 through A-15) as full-bleed character art
- [x] Upload and update database
- [x] Verify on live site
- [x] Save checkpoint (f0384b1b)

## Fix Broken Images on Movies & Series Page
- [x] Identify all entries with broken/missing image URLs (29 broken, all 403 errors)
- [x] Generate replacement images and update database (6 batches, all 29 fixed)
- [x] Verify all images load correctly (confirmed on live site)
- [x] Write Knull article — comparison to Doctor Doom, Thanos, and other MCU big bads
- [x] Knull article: include comparison list of similar cosmic-level villains (Kang, Thanos, Doom, Galactus, etc.)
- [x] Build "Sell Your Cards" section/page — currently buying Topps Marvel products only (at /sell-cards with photo upload + DB + owner notifications)
- [x] Move "Movies & Series" nav item to between "Events" and "About"

## Voting & Social Media
- [x] Seed all voting polls with 105 starting votes (167 articles x 105 votes = 17,565 total)
- [x] Create upgraded Facebook banner with QR code in Doom's hand
- [x] Randomize voting grounds vote distributions so each article looks different (50/35/10/5 ratio with variation)
- [x] Improve email capture popup readability — better contrast, larger text, cleaner layout
- [x] Remove Quick Comp and Display buttons from all card database set views
- [x] Publish Secret Wars cast speculation article with 3 generated images (article #174)
- [x] Publish PSA grading news article (PSA $200M investment, #NoPSAMay boycott, GemRate.com) with Marvel-specific images
- [x] Create 10 "Who Would Win?" articles with character-themed colors and 3 images each
- [x] Article 1: Wolverine vs Captain America (Yellow/Blue vs Red/White/Blue)
- [x] Article 2: Storm vs Thor (White/Silver vs Blue/Gold)
- [x] Article 3: Magneto vs Iron Man (Red/Silver vs Red/Gold)
- [x] Article 4: Jean Grey (Phoenix) vs Scarlet Witch (Orange/Gold vs Red/Purple)
- [x] Article 5: Hulk vs Colossus (Green vs Silver/Red)
- [x] Article 6: Cyclops vs Captain America (Blue/Gold vs Red/White/Blue)
- [x] Article 7: Deadpool vs Spider-Man (Red/Black vs Red/Blue)
- [x] Article 8: Doctor Doom vs Magneto (Green/Silver vs Red/Purple)
- [x] Article 9: Black Panther vs Wolverine (Purple/Black vs Yellow/Blue)
- [x] Article 10: Thor vs Hulk Rematch (Blue/Gold vs Green)
- [x] Create 10 "Who Would Win?" articles with character-themed colors, 3 images each, backdated 5/10-5/19
- [x] Build Who Would Win page template with character-specific color theming

## NLF Marvel Mint Series 1 Repack Checklist Page
- [x] Build NLF Series 1 Checklist page (SlabMethod-style format)
- [x] Add route /nlf-series-1 to App.tsx
- [x] Add page to sitemap
- [x] Style with dark theme matching existing site
- [x] Group cards by parallel type with section headers
- [x] Show all 84 cards with year/brand/set/parallel/card#/character/serial#/grade
- [x] Add summary stats section
- [x] Run integrity check and save checkpoint

## Memorial Day Article & Article Templates Overhaul
- [ ] Rebuild Memorial Day article with unique Northland Fence-style layout (side-by-side image/text, bold headers, distinct from generic template)
- [ ] Create 7 distinct article page templates so no two articles look the same
- [ ] Integrate template selection into article publishing system
- [x] Remove Fan Vote and Card Market Impact sections from article pages

## Patriotic Article Template Fixes
- [x] Remove blocked /manus-storage/ image references from Memorial Day article DB content
- [x] Fix duplicate blockquote display in patriotic template (strip from section body when shown as pull quote)
- [x] Override dark page wrapper for patriotic template (white background, hide default header/back nav)
- [x] Add "Back to MCU News" link inside patriotic template's own white bar
- [x] Add article title/excerpt to patriotic template hero overlay
- [x] Wrap post-template CTAs in container for patriotic template layout
- [x] Add American flag background (13 red/white stripes, blue canton with stars) to patriotic template
- [x] Add "Memorial Day Weekend 2026" watermark text in background (diagonal, repeated)
- [x] Add social media sharing buttons component (Facebook, Instagram, copy link) for ALL articles
- [x] Integrate sharing buttons at top and bottom of every MCU News article (standard layout)
- [x] Revert patriotic article template to dark/black background matching other articles (remove white bg and flag background)
- [x] Research Fallen Son: The Death of Captain America full 5-issue storyline
- [x] Write long-form article covering the complete Fallen Son story (all 5 stages of grief)
- [x] Generate multiple dramatic images for the article (one per issue/stage)
- [x] Publish article to database with patriotic template, images, and Collector's Corner

## Facebook/Instagram Social Posting & Token Monitoring
- [x] Build token expiration monitoring (check daily, persistent admin alert when <14 days to expiry)
- [x] Build social media posting backend (tRPC procedures for Facebook Page + Instagram posting)
- [x] Build admin dashboard UI for social posting with token expiration alert banner

## Fallen Son 3-Part Article Series
- [ ] Split long Fallen Son article into 3 parts (Denial/Anger, Bargaining/Depression, Acceptance/Funeral)
- [ ] Add "Read the Comic" links on each part (Marvel Unlimited + eBay for specific issues)
- [ ] Add next/prev part navigation between articles
- [ ] Draft Facebook posts for each part (cliffhanger strategy to drive daily return visits)
- [ ] Get user approval on Facebook post before publishing

## Pedro Pascal Article (Mandalorian + Reed Richards)
- [ ] Research Pedro Pascal, Mandalorian movie release, Reed Richards/Fantastic Four/Doctor Doom
- [ ] Generate images (Fantastic Four ship, Razor Crest, Pedro Pascal themed)
- [ ] Write full Pedro Pascal article with card market tie-ins and repack callout
- [ ] Publish article to database
- [ ] Add placeholder section for user's 1/1 Pedro Pascal Auto card photo
- [ ] Draft Facebook post for user review

## 7 Distinct Article Templates (May 22, 2026)
- [ ] Read current article rendering code
- [ ] Design Template 1: Full-width hero, pull quotes on side
- [ ] Design Template 2: Side-by-side alternating image/text (Northland Fence style)
- [ ] Design Template 3: Magazine-style with columns, drop caps, inset images
- [ ] Design Template 4: Dark cinematic with full-bleed images and overlay text
- [ ] Design Template 5: Card showcase focused — grid gallery with analysis blocks
- [ ] Design Template 6: Timeline/story format — vertical progression with milestones
- [ ] Design Template 7: Newsletter/editorial — clean, minimal, highlighted callout boxes
- [ ] Implement template rotation logic (1-7 cycling based on article order)
- [ ] Test with 10 VS battle articles
- [ ] Verify each template looks distinct and professional
- [ ] Save checkpoint

## Template Rotation & Drafts Dashboard
- [x] Implement 7-template auto-rotation for MCU News articles (classic→magazine→spotlight→timeline→listicle→cinematic→dossier)
- [x] Update getArticleTemplate() to use article ID for deterministic rotation
- [x] Update VS battle articles (1410001-1410010) to use rotating templates
- [ ] Build Drafts dashboard page for article management
- [ ] Add drafts route to admin navigation
- [x] Post Fallen Son Part 1 to Facebook and Instagram
- [x] Post all 10 VS battle articles to Facebook and Instagram (with first comments)
- [x] Movies & Series page: show newest movies/series at top, reverse chronological order

## Facebook Drafts Dashboard (Admin)
- [x] Add social_posts tracking table (article_id, fb_post_id, ig_media_id, posted_at, post_content, image_url)
- [x] Build tRPC routes for social post status tracking and publishing
- [x] Build AI image generation for social media posts (custom graphics per article)
- [x] Build AI post content generation (caption, hashtags, first comment)
- [x] Build Facebook Drafts tab in admin dashboard (Social Media tab)
- [x] Show articles not yet posted to FB/IG with generated image preview
- [x] Add one-click publish to FB and IG from dashboard
- [x] Add first comment field for each post
- [x] Add regenerate image/content buttons
- [x] Show post history (already posted articles with links)

## Automated Facebook Comment Reply System
- [ ] Add facebook_comment_replies table to schema (postId, commentId, commenterName, commentText, generatedReply, status, repliedAt)
- [ ] Add DB helper functions for comment replies CRUD
- [ ] Add getPostComments and replyToComment to facebook-api.ts
- [ ] Build commentReplies tRPC router (fetchNewComments, generateReply, approve, reject, sendReply)
- [ ] Build AI reply generation (casual, community-focused, on-brand NLF voice)
- [ ] Build CommentRepliesManager admin UI (Comments tab in Social section)
- [ ] Show original comment + generated reply + approve/reject/edit buttons
- [ ] Post approved replies via Facebook Graph API
- [ ] Set up heartbeat job to check for new comments every 4 hours
- [ ] Only engage with comments from last 7 days
- [ ] Skip spam/emoji-only/single-word/page's own comments
- [ ] Write vitest tests for comment replies

## Automated Facebook Comment Reply System
- [x] Add facebook_comment_replies database table with status tracking
- [x] Add getPostComments and replyToComment to facebook-api.ts
- [x] Create commentReplies tRPC router (fetch, generate, approve, reject, send)
- [x] Build CommentRepliesManager admin UI in Social tab
- [x] Create /api/scheduled/check-comments endpoint for heartbeat
- [x] Write vitest tests for comment reply system (all 335 tests pass)
- [x] Set up heartbeat schedule for periodic comment checking

## GHL Facebook Comment Automation (replacing custom system)
- [x] Remove custom comment reply system (router, UI, scheduled endpoint removed; schema table kept)
- [x] Research GHL API for Facebook comment automation
- [x] Implement GHL-based comment automation integration (conversations viewer, contacts viewer, setup guide)
- [x] Create server/ghl-conversations.ts API module
- [x] Create ghlAdmin router with search/get endpoints
- [x] Build GHLCommentManager admin UI component with setup guide + live data tabs
- [x] Write tests for GHL conversations module (10 tests passing)
- [x] Test and checkpoint

## GHL Full Integration (Social Planner, Contacts, Workflows)
- [ ] Build GHL Social Planner API module (get accounts, create/schedule posts)
- [ ] Build Social Planner UI in admin (compose post, schedule, select FB/IG accounts)
- [ ] Connect existing Social Drafts to publish via GHL Social Planner API
- [ ] Enhance contact management (add/remove tags, add notes, view timeline)
- [ ] Build contact segmentation view (filter by tags, source, activity)
- [ ] Add workflow trigger API (trigger GHL workflows from NLF events)
- [ ] Auto-trigger workflows on new subscriber, purchase, loyalty signup
- [ ] Build unified GHL dashboard tab in admin panel
- [ ] Write tests for GHL Social Planner and contact management
- [ ] Checkpoint and deliver

- [x] Redesign /shop page as Whatnot-exclusive repack showcase (no buy buttons)
- [x] Feature Infinity Series 1 with completed checklist link
- [x] Show Infinity Series 2 & 3 as "building now" / coming soon
- [x] Add June 7th Whatnot live show launch CTA
- [x] Remove all purchase/cart functionality from shop page
- [x] Add "All packs ripped live on Whatnot" messaging

- [x] Clean up navbar - remove inconsistent green borders on nav items
- [x] Reduce nav clutter - group secondary items into "More" dropdown
- [x] Improve mobile nav - better hamburger menu with grouped sections
- [x] Make nav styling consistent across all items

## SXSW London Article Update (June 2, 2026)
- [x] Generate 5 comic-style images for SXSW London article
- [x] Update article content with confirmed SXSW London news (Phase Zero, Dom Latveria Coffee, Incursions)
- [x] Add images throughout article body (coffee shop, flag, Phase Zero, incursions, Topps Chrome)
- [x] Update title, excerpt, tags, related characters, and sources
- [x] Verify template rotation (spotlight - correct after magazine)
- [x] Run NLF integrity check (81/81 passed)
- [x] Enforce template rotation rule: every article MUST use different template from previous (requires user approval to break)

## New Article: Doomsday Trailer Prediction (June 2, 2026)
- [x] Research IGN wrong predictions, Spider-Man Brand New Day timeline, Endgame re-release
- [x] Determine next template in rotation (after spotlight) → timeline
- [x] Generate 8 comic-style images for the article (hero, IGN wrong, July conflict, Endgame return, buzz machine, post-credits, biggest movie, card market)
- [x] Write contrarian prediction article (no SDCC, no Spider-Man, Endgame re-release Sept 25, mystery builds hype)
- [x] Publish article to database with timeline template
- [x] Run NLF integrity check (81/81 passed)
- [x] Provide direct link to published article

## Article Rewrite: Doomsday Trailer - Russo Legend Angle (June 2, 2026)
- [x] Research movies that succeeded without traditional trailers (Blair Witch, Cloverfield, Paranormal Activity, Endgame)
- [x] Found Joe Russo quote about considering zero marketing for Endgame (Empire Magazine 2019)
- [x] Rewrite article with new angle: "What if there is no trailer? Russos could become a different kind of legend"
- [x] Include comparison table (Blair Witch, Cloverfield, Paranormal Activity, Endgame)
- [x] Include "Move over James Cameron" section
- [x] Keep all 8 comic-style images
- [x] Keep timeline template (correct rotation)
- [x] Run NLF integrity check (81/81 passed)

## Article Poll Feature (June 4, 2026)
- [x] Add article_polls and article_poll_votes tables to database schema
- [x] Run db:push to migrate new tables
- [x] Add tRPC procedures: polls.getByArticle, polls.vote, polls.hasVoted (one vote per visitor)
- [x] Build ArticlePollWidget React component with funny options and live animated results
- [x] Embed ArticlePollWidget in MCUNewsArticle page (all non-patriotic templates)
- [x] Seed Doomsday trailer prediction poll with 5 funny options including "I just want to see Doom make an espresso"
- [x] Write and pass vitest tests for polls (6 tests, 337 total passing)
- [x] Post first comment on Facebook linking to the poll
- [ ] Save checkpoint

## Facebook Smart Comment Bot (June 5, 2026)
- [x] Read periodic-updates reference for heartbeat/webhook architecture
- [x] Add site_content_index table to database schema (stores indexed article content for bot knowledge)
- [x] Add bot_settings table (enabled toggle, reply delay, personality prompt)
- [x] Add bot_reply_log table (tracks what the bot replied to and when)
- [x] Build content indexer that syncs all published articles into knowledge base
- [x] Build Facebook webhook endpoint (/api/facebook/webhook) to receive comment notifications
- [x] Build AI reply generator using site knowledge base + NLF brand voice
- [x] Build admin toggle UI in admin dashboard (Social tab)
- [x] Set up heartbeat endpoint (/api/scheduled/bot-reindex) for periodic re-indexing
- [x] Write and pass vitest tests for bot system (357 total passing)
- [x] Save checkpoint

## Facebook Bot — Full Automation (June 5, 2026)
- [x] Audit Facebook post publishing flow (socialDrafts publishToFacebook, socialPosts publishToFacebook)
- [x] Add fb_monitored_posts table to track every published FB post with its post ID
- [x] Auto-register post in fb_monitored_posts whenever a post is published to Facebook
- [x] Build /api/scheduled/bot-poll-comments Heartbeat endpoint (polls comments on all monitored posts)
- [x] Wire comment polling into processComment() for auto-reply or review queue
- [x] Heartbeat polls every 5 minutes via /api/scheduled/bot-poll-comments
- [x] Remove manual webhook setup requirement — polling replaces real-time webhook
- [x] Update admin UI: Monitored Posts tab with live post list, last polled time, comment/reply counts
- [x] Write and pass 8 new automation tests (365 total passing)
- [x] Save checkpoint

## Bot Kill Switch Passphrase (June 5, 2026)
- [ ] Add killSwitch tRPC procedure: "I am Iron Man" disables, "I am inevitable" re-enables
- [ ] Add kill switch input to admin bot panel UI (prominent, always visible)
- [ ] Save checkpoint

## Bot Kill Switch Passphrase (June 5, 2026)
- [x] Add killSwitch tRPC procedure: "I am Iron Man" or "I am inevitable" toggles bot on/off
- [x] Add kill switch input to admin bot panel UI header (always visible)
- [x] Save checkpoint

## Movies & Series Page Reorder (June 5, 2026)
- [ ] Audit /movies-series page current layout and data
- [ ] Feature Avengers: Doomsday prominently at the top (hero/featured slot)
- [ ] Feature Spider-Man prominently second
- [ ] Move Secret Wars below Doomsday and Spider-Man
- [ ] Save checkpoint

## Wolverine vs Spider-Man — Doomsday Rumor Article (June 5, 2026)
- [ ] Research Wolverine vs Spider-Man Doomsday rumor and talking points
- [ ] Generate hero battle image (Wolverine claws vs Spider-Man web, Doomsday backdrop)
- [ ] Generate Facebook post image (scroll-stopping, meme-energy)
- [ ] Write full article with interactive vote poll
- [ ] Publish article to NLF site
- [ ] Write Facebook post + follow-up comment
- [ ] Write Grok prompt for ad image version
- [ ] Save checkpoint

## Wolverine vs Spider-Man Doomsday Article (June 2026)
- [x] Research Wolverine vs Spider-Man Doomsday opening scene rumor
- [x] Generate hero image: two universes colliding (Raimi NY vs Fox X-Men world)
- [x] Generate Facebook scroll-stopper image
- [x] Write full article with 6 sections + card market angle + sources
- [x] Seed article to DB with spotlight template (id: 1890002)
- [x] Create community poll: "Does Tobey survive?" with 5 options + 2,130 seeded votes (id: 30001)
- [x] Fix JSON field types (tags, sources, relatedCharacters stored as proper arrays)
- [x] Write Facebook post + first comment for engagement push
- [x] Save checkpoint

## Facebook Token Auto-Refresh Automation
- [x] Build automated Facebook token refresh scheduled handler (POST /api/scheduled/fb-token-refresh)
- [x] Register FB token refresh route in server/_core/index.ts
- [x] Save FB_APP_SECRET and new never-expiring FB_PAGE_ACCESS_TOKEN as secrets
- [x] Write vitest tests for the token refresh handler
- [x] Deploy site and register heartbeat cron job (monthly, 1st of each month) via manus-heartbeat CLI

## NLF Smart Lead Form (Multi-Funnel)
- [ ] Add lead_submissions table to DB schema (name, phone, email, interests, source_page, ghl_contact_id, created_at)
- [ ] Build tRPC procedure: submitLead — validates, saves to DB, pushes to GHL with interest-based tags
- [ ] Build reusable LeadForm component: first name, last name, phone, email, interest multi-select checklist
- [ ] Interest options: Marvel Cards, Whatnot Shows, Market Intel / eBay Comps, Repacks, Character Deep Dives, MCU News & Spoilers
- [ ] Disable autocomplete on all form fields (autocomplete="off", no autofill)
- [ ] Add honeypot field for bot detection
- [ ] Show success confirmation with personalized message based on selected interests
- [ ] Place form on: Home page (hero section or below), About page, MCU News page
- [ ] Admin dashboard: add Lead Submissions panel showing all submissions with interest tags and GHL sync status
- [ ] Write vitest tests for submitLead procedure
- [ ] Save checkpoint

## Navigation Improvements
- [x] Remove Shop link from nav and More dropdown
- [x] Remove cart icon from nav bar
- [x] Remove /login link from nav (keep user avatar for logged-in users only)
- [x] Add dropdown to MCU News: Movies & Series, Nerd Gossip
- [x] Add dropdown to Card Database: Artist Directory, Cosmic Hits
- [x] Add dropdown to Whatnot: Events / Card Shows
- [x] Reorganize More dropdown: About, FAQ, Voting Grounds
- [x] Clean up mobile menu to match new structure
- [ ] Save checkpoint

## AI Chat Assistant (Admin Dashboard)
- [x] Add adminChat tRPC procedure with LLM + database context (user count, article count, GHL leads, card inventory)
- [x] Build AI Chat panel component for admin dashboard
- [x] Add AI Chat tab/section to admin dashboard sidebar
- [x] Wire up chat with streaming responses
- [x] Add suggested starter questions (How many leads this week? What articles are published? etc.)
- [ ] Save checkpoint

## Repack Showcase (Future — Doomsday Launch)
- [ ] Design repack showcase page architecture (multiple sets: Doom Exclusives, Doomsday sets, limited parallels)
- [ ] Build /repacks page with set cards, product images, and countdown to availability
- [ ] Add "Notify Me" form tied to repack interest funnel
- [ ] Save checkpoint

## Daily Article Pipeline & SEO (June 2026)
- [ ] Add article_pipeline_topics table to schema (tracks used topics + art style rotation index)
- [ ] Add redditPostCopy field to socialPostDrafts table
- [ ] Push DB migrations
- [ ] Build server/scheduled-daily-article.ts (AGENT cron callback endpoint)
- [ ] Register scheduled-daily-article route in server/_core/index.ts
- [ ] Create AGENT cron (3x daily: 6am, 11am, 5pm CT) for daily article generation
- [ ] Generate Scorpion hero image (oil painting style) and publish first article
- [ ] Add Reddit post copy display to Social Drafts admin tab
- [ ] Save checkpoint and deploy

## 10-Template Article System & Expanded Content Categories (June 2026)
- [x] Add 3 new article templates to ArticleTemplates.tsx: CharacterProfile, DisneyExperience, CollectorSpotlight
- [x] Update ArticleTemplate type to include 3 new template names
- [x] Update ROTATION_TEMPLATES array to cycle through all 10 templates
- [x] Update ArticleTemplateRenderer switch to handle 3 new templates
- [x] Update articles DB schema: add new categories (disney_parks, disney_plus, kids_marvel, comics_spotlight, best_actors, card_interest)
- [x] Run pnpm db:push to migrate new categories to DB
- [x] Update blog-content-strategy.ts: add TOPIC_POOLS for 6 new categories with 8+ topics each
- [x] Update CATEGORY_LABELS for new categories
- [x] Update CATEGORY_TEMPLATE_AFFINITY for new categories
- [ ] Update NLF_BLOG_SYSTEM_PROMPT to include new content pillars (future task)
- [ ] Update blog-scheduler.ts FALLBACK_PROMPTS for new categories (future task)
- [ ] Update templateLayout enum in schema.ts to include 3 new templates (future task)
- [x] Verify all 10 templates render distinctly on /mcu-news article pages
- [x] Update TemplateShowcase page to preview all 10 templates

## 7 Signature Articles — Human Voice, Unique Layouts
- [ ] Update NLF_BLOG_SYSTEM_PROMPT with human voice rules (short sentences, opinions, collector tone, no AI tells)
- [ ] Add 7 new signature topics to TOPIC_POOLS
- [ ] Generate hero images for all 7 articles (unique per article, no duplicates)
- [ ] Generate Facebook scroll-stopper images for all 7 articles (different from hero images, bold/dramatic)
- [ ] Write & publish Article 1: "The Logan Paul Effect — What Happens When an A-List Actor Wears a Doctor Doom Card?"
- [ ] Write & publish Article 2: "Marvel Is Generational. Pokemon Is Not."
- [ ] Write & publish Article 3: "The Full Marvel Ecosystem — Why No Other IP Touches Every Generation"
- [ ] Write & publish Article 4: "RDJ's Doctor Doom Rookie Card — We're Watching a Logan Paul Moment Build in Slow Motion"
- [ ] Write & publish Article 5: "Avengers Doomsday Will Dethrone Avatar. Here's Why."
- [ ] Write & publish Article 6: "Topps Didn't Buy the Marvel License to Lose to Pokemon"
- [ ] Write & publish Article 7: "Spider-Man Will Reunite the Community"
- [ ] Each article uses a different layout template (no two the same)
- [ ] Each article has Facebook post copy in social drafts
- [ ] Verify all 7 articles appear in admin drafts for review

## Article Queue — Next Up
- [x] Write article based on: https://youtu.be/NW8DzX4mE6w — published "The Avengers Just Accidentally Created the Multiverse" (collector_spotlight template)

## Spider-Man: Brand New Day Article
- [x] Browse 5 eBay sold listings for card comps (Spider-Man BGS 10 Black /10, Scorpion 1/1, Punisher Black Auto /10, Dr. Doom Comic Cut 1/1 HULK, Jean Grey Gold /10)
- [x] Generate 3 article images (NYC web city hero, Scorpion villain, Spider-Man cards collector)
- [x] Write and publish article with cinematic template — slug: spiderman-brand-new-day-trailer-record-breaking-card-market
- [x] Integrity check passed 81/81
- [x] Checkpoint saved

## Doomsday Countdown & Email Signup Enhancements
- [x] Add Doomsday countdown widget to article detail pages (especially Doomsday articles)
- [x] Add email signup form to /doomsday countdown page (news, giveaways, etc.) — integrate with GHL

## Editorial Article: Marvel Cards Hidden Asset
- [x] Research editorial thesis from user PDF
- [x] Analyze 4 YouTube videos (Steve Aoki x2, Dana White x2)
- [x] Determine next template in rotation (magazine)
- [x] Generate 3 unique article images (vault, celebrity collector, convention)
- [x] Write long-form editorial with all 4 YouTube embeds
- [x] Include Collector's Corner with Card Ladder, MySlabs, Whatnot rotation
- [x] Internal links to /doomsday and Doomsday article
- [x] Publish article to database (ID 2310001, featured)
- [x] Integrity check 81/81 passed

## Article Ecosystem: Celebrity Collectors Series
- [x] Research Tom Brady card collecting involvement
- [x] Research Cards HQ store and celebrity connection
- [x] Plan ecosystem structure and internal linking
- [x] Generate unique images for each sub-article (8 images across 4 articles)
- [x] Write and publish Steve Aoki article (magazine template, Jun 12)
- [x] Write and publish Dana White article (cinematic template, Jun 15)
- [x] Write and publish Cards HQ article (collector_spotlight template, Jun 10)
- [x] Write and publish Tom Brady article (dossier template, Jun 17)
- [x] Update main Hidden Asset hub article with Celebrity Collectors Series section
- [x] Verify template rotation: collector_spotlight → magazine → cinematic → dossier (all different)
- [x] Staggered publish dates across past 9 days
- [x] Integrity check 81/81 passed

## Artist Portfolio Completion
- [x] Make all artists clickable in Artists.tsx (remove comic-auto-only restriction)
- [x] Add TBA state to ArtistProfile.tsx for artists without bios ("Full Portfolio Coming Soon" with tier badge)
- [x] Research 28 top-tier sketch card artists for real bios (all found)
- [x] Add 28 sketch artist bios to ArtistProfile.tsx with websites and notable works
- [x] Verify all artist profile pages render correctly
- [x] Integrity check 81/81 passed
- [x] All 386 tests passing (37 test files)

## Cards Page - Year-Based Organization (2024-2026)
- [x] Add 2024 sets to database (Chrome Marvel, Chrome Sapphire Marvel)
- [x] Add 2025 Chrome Deadpool to database
- [x] Add 2026 sets to database (Brooklyn Collection Cap 85th, Chrome Marvel Comics)
- [x] Fix Finest Fantastic Four year from 2025 to 2026
- [x] Redesign /cards page to organize by year (2026, 2025, 2024)
- [x] Unique background color per year (purple=2026, green=2025, orange=2024)
- [x] Year section headers with badges (UPCOMING & NEW, CURRENT YEAR, INAUGURAL YEAR)
- [x] "Coming Soon" badge for sets with 0 cards
- [x] Box images for all new sets uploaded to CDN
- [x] All 392 tests passing (37 test files)

## Performance Optimization
- [x] Audit bundle size (was 6MB single chunk, 1.1MB gzipped)
- [x] Add code splitting / lazy loading for all 70+ route pages (React.lazy + Suspense)
- [x] Manual chunks: streamdown-vendor, react-vendor, trpc-vendor, radix-vendor, icons-vendor
- [x] Main bundle reduced from 6MB to 499KB (89KB gzipped) - 92% reduction
- [x] Heavy deps (mermaid, shiki, katex) only load when viewing articles
- [ ] Further image optimization (proper lazy loading, sizing hints) - future improvement

## Set Detail Pages for New Sets
- [x] Build Coming Soon detail page state for sets with 0 cards (box image, description, subscribe CTA)
- [x] All new sets have proper detail pages with Coming Soon state
- [x] 392 tests passing (37 test files)

## Brooklyn Collection Captain America 85th Set Page
- [x] Extract full checklist from PDF (267 cards, 13 subsets)
- [x] Extract odds/parallel info from PDF
- [x] Insert all 267 cards into database with proper card types and parallels
- [x] Match character images from Marvel Mint where possible (102 cards got real images)
- [x] Verify page renders with all subset filters working
- [x] All 392 tests passing (37 test files)

## Checklist-Only Set Pages (Finest FF, Chrome Deadpool, Chrome Marvel Comics)
- [x] Extract Finest Fantastic Four checklist from Excel (704 cards, 30 subsets)
- [x] Extract Chrome Deadpool checklist from Excel (314 cards, 22 subsets)
- [x] Build Chrome Marvel Comics checklist (530 cards, 7 subsets)
- [x] Insert all cards into database (set IDs: 60001, 90003, 90005)
- [x] Default to list/checklist view for sets without images (useEffect + useRef pattern)
- [x] Brooklyn Collection also defaults to list view (no images)
- [x] All 392 tests passing (37 test files)

## 2024 Sets Checklist Population
- [x] Extract 2024 Topps Chrome Marvel checklist from PDF (260 cards across 17 subsets)
- [x] Extract 2024 Topps Chrome Sapphire Marvel checklist from PDF (185 cards across 6 subsets)
- [x] Insert all cards into database with correct column names
- [x] Both sets auto-default to list/checklist view (no images)
- [x] All 392 tests passing (37 test files)

## Brand New Day Presales Article (June 20, 2026)
- [x] Research Brand New Day presale records (Screen Rant, Deadline, Variety)
- [x] Generate 3 unique article images (hero, triple-event lobby, collector desk)
- [x] Determine next template in rotation (listicle)
- [x] Write article with YouTube embed, box office table, Collector's Corner
- [x] Publish article to database via publish script
- [x] Run integrity check (81/81 passed)
- [x] Save checkpoint

## Fix: Brand New Day Presales Article (June 20, 2026)
- [x] Remove duplicate hero image from inline article body (same image appears as featured AND inline)
- [x] Change template from 'listicle' to 'spotlight' (proper round-robin, not used recently)

## Fix: Card Sets Order on /cards Page (June 20, 2026)
- [x] Reorder card sets by release date with newest first

## Chasing Doom Segment Page (June 21, 2026)
- [x] Build "Chasing Doom" page on NLF with Patrick's full bio/origin story
- [x] Include RDJ/Doctor Doom/sobriety parallel narrative
- [x] Include family story (Laura, Landon, Kaya)
- [x] Generate hero image for the page
- [x] Add routing (hidden - no nav link yet, direct URL only)
- [ ] Add to sitemap (LATER - when Patrick says go)
- [x] Design for eventual spin-off to chasingdoom.com

## Chasing Doom Interactive Timeline (June 21, 2026)
- [x] Build interactive road trip timeline component for Trip Updates section
- [x] Include visual route line, stop markers, dates, descriptions, and finds
- [x] Make it expandable/clickable for each stop
- [x] Integrate into ChasingDoom.tsx replacing the placeholder

## Chasing Doom Crew Section Update (June 22, 2026)
- [x] Upload Kaya photos (sunflower field with Landon, holding baby Landon in NF shirt, shoveling dirt)
- [x] Add Kaya subsection with photos and expanded bio to Crew section
- [x] Add Jim subsection (boxing cutman, best friend, Bane/Mini Goldberg, Uncle Jim) with placeholder for photo

## MCU News Articles
- [x] Publish "The Road to Doomsday: Every MCU Event Building Toward December 2026" (timeline template, June 25 2026)
- [x] Publish "From Upper Deck to Doomsday: How Topps Built the New Marvel Card Era" (listicle template, June 26 2026) — includes 1975 origin story, 50th anniversary angle, user's SDCC Doctor Doom /99 card photos

## Bug Fixes
- [x] Fix /subscribers page — added public giveaway signup form (no login required)
- [x] Form collects: first name, last name, email, phone, preferred contact method
- [x] "Winners are contacted by SMS" messaging on phone field
- [x] "What's the best way to reach you?" selector (SMS/Email/Both)
- [x] Integrates with GHL including phone + giveaway-entrant tag
- [x] Vitest tests for giveaway signup logic

## Subscribers Page Family Story Redesign
- [x] Add personal family story section above giveaway form on /subscribers page
- [x] Include family photos (father-son, family hero, card ripping) — 7 photos total
- [x] Casual tone: "not a big company, just a father, son, and an eye-rolling wife"
- [x] Link to /about bio page ("Read Our Full Story" button)
- [x] Show cards/collecting imagery (card show, toy swap, card shop photos)

## 2025 Topps Marvel Mint Flagship Page Enhancement
- [x] Add "Checklist & Odds" tab to Marvel Mint set page with full parallel breakdown and pull rates
- [x] Add "Set Overview" section with description, release info (SDCC 2025), and key highlights
- [x] Add "Most Hunted" badge/featured designation to Marvel Mint on /cards page
- [x] Reorder /cards page: Marvel Mint first in 2025 section with special featured treatment
- [x] Add "2nd Tier" designation for 2025 Topps Marvel Studios on /cards page
- [x] Add "Sleeper" designation for 2025 Topps Comic Book Heroes on /cards page
- [x] Include SDCC exclusive Doctor Doom cards in odds breakdown
- [x] Include Chrome Variations, Autographs, Cut Signatures, Sketch Cards in odds data
- [x] Test and verify all tabs/sections display correctly
- [x] Save checkpoint

## Add Checklist & Odds Tabs to All Set Pages (Matching Marvel Mint)
- [ ] Extract data from all official PDFs/Excel files provided
- [ ] Build reusable SetChecklist component (generic version of MarvelMintChecklist)
- [x] Add Checklist & Odds tab to 2025 Topps Chrome set page
- [x] Add Checklist & Odds tab to 2025 Topps Marvel Chrome Sapphire set page
- [x] Add Checklist & Odds tab to 2025 Topps Marvel Studios set page
- [x] Add Checklist & Odds tab to 2025 Topps Marvel Studios Sapphire set page
- [x] Add Checklist & Odds tab to 2025 Topps Comic Book Heroes set page
- [x] Add Checklist & Odds tab to 2025 Topps Marvel Mint set page (DONE - already built)
- [x] Add Checklist & Odds tab to 2025 Marvel The Collector set page
- [x] Add Checklist & Odds tab to 2025 Topps Chrome Deadpool set page
- [x] Add Checklist & Odds tab to 2026 Topps Finest Fantastic Four set page
- [x] Add Checklist & Odds tab to 2026 Topps Chrome Marvel Comics set page
- [x] Add Checklist & Odds tab to 2026 Topps Brooklyn Collection Captain America 85th set page
- [x] Test all set pages display correctly
- [x] Save checkpoint

## Comic Strip Article Template
- [x] Add Bangers + Archivo Black fonts to client/index.html
- [x] Implement ComicStripTemplate component in ArticleTemplates.tsx (Template 12)
- [x] Add comic_strip to ArticleTemplate union type
- [x] Replace collector_spotlight with comic_strip in ROTATION_TEMPLATES (position 9)
- [x] Add comic_strip to ALL_TEMPLATE_NAMES map
- [x] Add comic_strip case to ArticleTemplateRenderer switch
- [x] Add all 12 templates (including comic_strip) to TEMPLATE_LAYOUTS dropdown in ArticleManager.tsx

## Article Template Redesigns (Handoff Series)
- [x] Comic Strip template (comic_strip) — Bangers/Archivo Black fonts, panel layout, speech bubble
- [x] Cinematic template (cinematic) — redesigned with CollectorSpot cinematic skin
- [x] Clean Informational template (classic) — Fraunces font, drop-cap, editorial CollectorSpot skin
- [x] Dossier/Intel File template (dossier) — IBM Plex Mono, classified header, redacted quote, intel skin
- [ ] Ranked Countdown template (listicle) — Anton/JetBrains Mono, split image/text rank cards, countdown skin

## Card of the Day Feature
- [x] Design DB schema for cardOfTheDayEntries (date, character, set, parallel, print run, serial, CGC grade, image URL, buzz note)
- [x] Run DB migration for new table
- [x] Build rotation engine (cardOfTheDayRotation.ts) with 54-card catalog across 3 sets
- [x] Build tRPC router (server/routers/cardOfTheDay.ts) with getToday, getSchedule, upsertCard, updateImageByCardNumber procedures
- [x] Wire cardOfTheDayRouter into main routers.ts
- [x] Build public /card-of-the-day page (CardOfTheDay.tsx) with card image, set/parallel/grade badges, buzz note
- [x] Register /card-of-the-day route in App.tsx
- [x] Build CardOfTheDayAdmin component (today preview, rotation schedule, edit dialog)
- [x] Add Card of the Day section to AdminDashboard sidebar and render switch
- [x] Upload 40 card images to S3 (CBH50 Black & Gold /10, Studios Chrome Black /10, Marvel Mint Black/Red Chrome /10 /5)
- [x] Seed DB with 54 cards across 3 sets (CBH50, Studios Chrome, Marvel Mint) — June 29 through August 21
- [x] Generate printable PDF reference sheet (14 pages, all 54 cards with image boxes and missing-image flags)
- [ ] Add /card-of-the-day link to homepage (optional — after user review)
- [x] Add 6 missing Marvel Mint images — uploaded #101 Spider-Man (CGC 8.5), #102 Wolverine (CGC 9), #104 Captain America (PSA 10), #107 Doctor Doom (CGC 8.5), #112 Storm (PSA 10 — corrected from CGC 9), #113 Black Widow (CGC 10 Pristine — corrected from CGC 9). Rotation extended to Aug 25 for new entries.
- [x] Fix "Shop at NLF" button on /card-of-the-day — changed to "Explore MCU News" linking to /mcu-news (per project rules: no external shop links)
- [x] Add hover-to-zoom effect on Card of the Day card image (scale 1.55x on hover, smooth cubic-bezier transition, zoom-in cursor, 🔍 hint badge that fades on hover)
- [x] Upload Gambit #119 Marvel Mint Red Refractor CGC 10 Gem Mint photo and update DB record (corrected from null grade)
- [x] Add backend tRPC endpoint to fetch card by specific date (getCardByDate)
- [x] Add backend endpoint to get prev/next card dates for navigation (getAdjacentDates, getAllDates)
- [x] Add /card-of-the-day/:date route in App.tsx
- [x] Update CardOfTheDay page to support date param with prev/next navigation arrows
- [x] Each date page gets unique SEO metadata (title, description, OG image, canonical, rel prev/next)
- [x] Add date-based card pages to sitemap (58 URLs)
- [x] Publish "The Brady Effect" MCU News article — analysis piece on why MCU actors collecting their own Marvel cards could transform the hobby (spotlight template, featured)
- [x] Add Card of the Day to navigation dropdown (under Card Database)
- [x] Add Card of the Day homepage widget/preview section (amber/gold theme, shows today's card with image + details)
- [x] Add Card of the Day link to footer (Explore section, first item)
- [x] Replace AI placeholder art with actual Topps card artwork for Marvel Mint set (100 base cards updated with real art)
- [x] Redesign /cards page grid layout — premium hover effects, better card sizing, smoother animations
- [ ] Improve card detail modal/view — show parallel variants, grading info, pricing context
- [ ] Better filtering/search UX — faster subset tabs, search by character name, sort options
- [x] Visual design polish — dark premium theme, card glow effects, better typography

## /Cards Page Premium Redesign
- [x] Add 3D card tilt/perspective hover effect (CSS transform perspective + rotateX/rotateY via mouse tracking)
- [x] Add holographic shimmer overlay on card hover (animated gradient)
- [x] Improve card tile sizing — slightly larger with better spacing and responsive breakpoints
- [x] Add staggered fade-in animation as cards enter viewport
- [x] Add rarity/parallel count badges on card tiles
- [x] Better empty state for cards without images (styled placeholder with character name)
- [x] Quick-view tooltip on hover showing card details (character, set, type, parallels)
- [x] Smooth scale transitions on card hover

## Card of the Day Navigation Improvements
- [x] Make prev/next navigation arrows more prominent and always visible (larger, styled, with card character preview)
- [x] Add "Browse All Past Cards" archive gallery section below the card content
- [x] Archive shows thumbnail grid of all past cards with date, character name, and set badge

## Battleworld Hub Page
- [x] Create /battleworld page as Card of the Day entry hub (Doctor Doom's Secret Wars theme)
- [x] Hero section with today's featured card prominently displayed
- [x] Archive grid of all past cards below (thumbnail, character, date, set)
- [x] Register /battleworld route in App.tsx
- [x] Add Battleworld to site navigation
- [x] Remove Google News outbound links from Card of the Day (no SEO value)
- [x] Replace with internal character page links (better for SEO + keeps users on-site)
- [x] Add to sitemap

## Battleworld Page V2 — Custom Assets & Team Tabs
- [x] Add Galactus/NLF cosmic storm background image to Battleworld page
- [x] Feature Doctor Doom Gold Wave PSA 9 card with front/back flip animation
- [x] Add team filter tabs (ALL A-Z, Avengers, X-Men, Fantastic Four, Guardians, Villains, Secret Wars)
- [x] Auto-map characters to teams based on Marvel affiliations

## Custom NLF Backgrounds Behind All Card Images
- [x] Upload all needed NLF background images (Spotlight-RedBlue, Spotlight-Gold, Spotlight-Blue, Spotlight-Purple, Lightning-maroon, Lightning-Purplegold)
- [x] Battleworld page: card tiles use team-matched backgrounds behind card photos
- [x] Card of the Day page: use team-matched background behind featured card
- [x] /cards database: card tiles use set-matched backgrounds behind card photos
- [x] List view thumbnails on /cards also use set-matched backgrounds
- [x] Created shared cardBackgrounds.ts helper with team/set mapping logic

## 2026 Topps Chrome Marvel — Spotlight & Article
- [x] Add "New Set Release Spotlight" section to Battleworld page (between hero and team tabs)
- [x] Spotlight shows 2026 Topps Chrome Marvel with key stats (200 base, 17 inserts, 15+ debuts)
- [x] Write full breakdown article with all insert sets, hits, odds, and highlights
- [x] Publish article to database with proper SEO metadata

## Field Guide Page — Wire Verified Odds Data
- [x] Replace generic parallel structure table with verified 2026 Chrome Marvel odds
- [x] Add box-type comparison section (Hobby vs Value vs Mega exclusive parallels)
- [x] Add insert set odds table with real pull rates
- [x] Update PRODUCTS data to include 2026 Chrome Marvel as the newest entry
- [x] Add hits/relics/sketch section with verified data
- [ ] Add click-to-zoom lightbox feature to card images in article templates

## Fix: Blank Image Placeholders in Article Templates
- [x] Fix "CARD IMG" placeholder in CollectorSpot cinematic skin - show actual card image or emoji fallback
- [x] Fix "CARD IMG" placeholder in all other template skins (comic, editorial, intel, countdown, mission, glossy, explainer, parkpass)
- [x] Fix "Scene Still" placeholder in CineStill component - use first inline image from content
- [x] Update extractImages() to find HTML <img> tags in addition to markdown ![alt](url) syntax
- [x] Pass cardImageUrl prop to all CollectorSpot usages across all templates
- [x] Verify all blank placeholders are resolved on live article

## July 10, 2026 — Doom Throne Article + Build Your Repack
- [x] Research Doctor Doom throne reveal at Shanghai Expo / Bilibili World 2026
- [x] Research SDCC 2026 Hall H panel, trailer confirmation, leaked footage
- [x] Research 5 confirmed superhero teams for Doomsday
- [x] Research LEGO set leaks (Dark Avengers)
- [x] Research Doom card market (2026 Topps Chrome One World Under Doom insert set)
- [x] Generate featured image for Doom throne article
- [x] Generate inline images (X-Mansion, Sentinels)
- [x] Write and publish "Doom's Throne Revealed" MCU News article
- [x] Create repack_feedback database table (schema + migration)
- [x] Build repackFeedback tRPC router (submit + admin results endpoints)
- [x] Build /build-your-repack interactive page (6-step survey: format, price, characters, sets, graded preference, suggestion/email)
- [x] Add route to App.tsx and SiteMap
- [x] Publish Facebook post driving traffic to /build-your-repack
- [x] Post follow-up comment with direct link

## Build Your Repack — GHL Integration + Human Verification
- [x] Add name/email form fields to Build Your Repack page for GHL contact creation
- [x] Add honeypot field (HoneypotField component) for simple bot detection
- [x] Add simple math captcha as human verification ("What is 3 + 4?")
- [x] Update server router to submit to GHL (createGHLContact + addGHLContactNote with preferences)
- [x] Add repack-specific tags to GHL contact (e.g., "repack-interest", format, price range)

## Topps God Emperor Expansion + Victor Article (Jul 11)
- [x] Add sports/Star Wars licensing section to Topps God Emperor article (NBA, NFL, MLB, Star Wars)
- [x] Add Panini unlicensed sports angle to the article
- [x] Research Victor Wembanyama stats, card market, and parallels to Victor Von Doom
- [x] Write and publish "There's Only One Victor" article (Wembanyama vs Von Doom)
- [x] Generate images for the Victor article

## Legendary List Signup Form
- [ ] Create database table for newsletter subscribers (name, email, phone, sms_consent, email_consent, source_page, created_at)
- [ ] Build reusable LegendaryListForm component (fields: first name, email, phone optional, SMS checkbox, disclaimer)
- [ ] Add form validation (email format, phone format when entered)
- [ ] Build backend tRPC endpoint for form submission
- [ ] Integrate with GoHighLevel CRM (GHL_API_KEY)
- [ ] Add duplicate contact prevention
- [ ] Add basic spam protection (honeypot field)
- [ ] Build desktop slide-in popup (bottom-right corner, subtle animation)
- [ ] Build mobile bottom sheet version
- [ ] Implement trigger logic (40 seconds OR 50% scroll, whichever first)
- [ ] Implement display rules (once per 10 days, not after subscribe, not on cart/checkout/login pages)
- [ ] Wait for cookie notice dismissal before showing
- [ ] Session dismissal tracking (close = don't show again this session)
- [ ] Add permanent form: homepage above footer
- [ ] Add permanent form: inside footer
- [ ] Add permanent form: end of articles
- [ ] Success message with conditional VIP text alert confirmation
- [ ] Track form views, opens, closes, submissions
- [ ] Store consent status and source page with each submission
- [ ] Test responsive behavior on all screen sizes

## Auto-Quarantine Contract Verifier + Explosion Article (July 2026)
- [x] Upgrade article-pipeline.ts: quarantineFailingArticles() auto-unpublishes + sets NEEDS_MANUAL_REVIEW status
- [x] Wire quarantine verifier into articles router as on-demand admin mutation
- [x] Update NLF Article Publisher skill with permanent editorial hero image policy (card-scan collage, no AI illustrations)
- [x] Create card-scan collage hero image from 6 real NLF card images (Doom, Cyclops, Gambit, Thor, Loki, Mr. Fantastic)
- [x] Upload collage to CDN (accessible: card-scan-collage-hero-editorial.webp)
- [x] Write "The Explosion Is Coming" article — classic template, 6 H2s, 0 blockquotes, featured image present
- [x] Publish article to database (ID 4530001, slug: marvel-cards-going-mainstream-explosion-2026)
- [x] Contract verification passed: ✅ PASS (classic template, 6 H2s, 0 blockquotes, featured image)
- [x] Update rotation counter to "classic"
- [x] Wire quarantine verifier into scheduled-daily-article.ts (auto-quarantine on publishImmediately)
- [x] Wire quarantine verifier into rest-api.ts POST and PATCH (auto-quarantine on publish)
- [x] All 437 tests passing (41 test files), zero TypeScript errors
- [x] Save checkpoint

## Stan Lee Legacy Article (July 2026)
- [x] Create card-scan collage hero image (6 cards: Thor, Doom, Cyclops, Gambit, Loki, Mr. Fantastic)
- [x] Write article: "Stan Lee's Legacy Lives in Every Card You Collect"
- [x] Run contract verifier — PASS (spotlight template, 6 H2s, featured image present)
- [x] Publish article to database
- [x] Verify live on northlandlegendaryfinds.com

## Adam Driver X-Men / Marvel Mint Article (July 2026)
- [x] Create card-scan collage hero image (X-Men characters: Cyclops, Gambit, Doom, Loki, Thor, Mr. Fantastic)
- [x] Write article: "Adam Driver in the MCU: Magneto or Mister Sinister — What It Means for Your Collection"
- [x] Include 2026 Topps Marvel Mint release info
- [x] Run contract verifier — PASS (timeline template, 6 H2s, inline images per section)
- [x] Publish article to database
- [x] Verify live on northlandlegendaryfinds.com

## Weekly Marvel Recap Article (July 18, 2026)
- [x] Research this week's Marvel news (Spider-Man BND, Doomsday tickets, Adam Driver, Wolverine PS5, Marvel Rivals, X-Men 97, SDCC preview)
- [x] Write article: "This Week in Marvel: The Biggest Week of 2026 Just Happened"
- [x] Template: listicle (7 H2s, inline image per section) — contract PASS
- [x] Publish to database
- [x] Rotation advanced to "listicle"

## Listicle Template Mobile Fix (July 18, 2026)
- [x] Fix mobile layout: images too large, headings overlapping card images
- [x] Reduce card image height on mobile (max 180px), text appears FIRST via CSS order
- [x] Ensure section headings don't overlap images (caption overlay hidden on mobile)
- [x] Test on mobile viewport (verified with injected mobile styles)
- [x] Save checkpoint

- [x] SDCC 2026 Doomsday news roundup article (disney_experience template) — covers trailer, ticket sales, Latverian Witch, Topps SDCC exclusive, Hall H, Marvel Legends
- [x] Fix disney_experience template double images — images show in mosaic cards AND inline body text, should only show once
- [x] Add 2026 Topps Marvel Mint set to card database (233 cards: 125 base, 55 Cerebro, 30 Symbiote Takeover, 3 SDCC exclusive, 14 autos, 4 special hits, 2 sketch)
- [x] Publish 2026 Topps Marvel Mint SDCC/Hobby article at /mcu-news/2026-topps-marvel-mint-sdcc-hobby-release
- [x] Notebook cast MCU article with comic book style images (character_spotlight template)
- [x] Doctor Doom kids/family article with comic book images — personal story with Landon, Doom targeting families theory

## Know Your Villain Series
- [x] Generate featured image for Doctor Doom article (4:5 portrait with "Know Your Villain" text)
- [x] Generate inline images (origin, Namor rivalry, God Emperor, Valeria, science/sorcery)
- [x] Write and publish "Know Your Villain: Doctor Doom" article (comic_strip template)
- [x] Post Doctor Doom article image to Instagram
- [ ] Future: Know Your Villain: Galactus
- [ ] Future: Know Your Villain: Mephisto
- [ ] Future: Know Your Villain: Kang

## Spider-Man Box Office & Card Market Article
- [x] Research Spider-Man 4 box office predictions from news sources
- [x] Analyze YouTube video about Spider-Man cards going crazy
- [x] Research 2026 Topps Marvel Mint set release details
- [x] Generate featured image for Spider-Man article
- [x] Generate inline images for article sections (replaced with user's actual card photos)
- [x] Write and publish Spider-Man article (box office + cards + Marvel Mint + Marvel vs Pokemon angle)
- [x] Post Spider-Man article carousel to Instagram (3 real card photos)

## Secret Wars Article Series (3-Part Saga)
- [x] Analyze 1984 Secret Wars YouTube video
- [x] Research 1984 Secret Wars comic series details
- [x] Generate images for 1984 Secret Wars article
- [x] Write and publish 1984 Secret Wars article (classic template)
- [x] Analyze 2015 Secret Wars YouTube video
- [x] Research 2015 Jonathan Hickman Secret Wars details
- [x] Generate images for 2015 Secret Wars article
- [x] Write and publish 2015 Jonathan Hickman Secret Wars article (magazine template)
- [x] Analyze One World Under Doom YouTube videos (3 sources)
- [x] Write and publish One World Under Doom article (spotlight template)
- [x] Rewrite all 3 articles with content structured for their specific template layouts
- [x] Tie all 3 articles to Avengers: Doomsday (Dec 2026, RDJ)
- [x] Interlink all 3 parts with navigation between them
- [ ] Post Secret Wars articles to Instagram (awaiting user approval)

## WandaVision → Agatha → Vision Quest Disney+ Saga Article
- [x] Research Vision Quest show details (Oct 14 2026, Paul Bettany, James Spader as Ultron, 8 eps)
- [x] Research the connected Disney+ storyline (WandaVision → Agatha → Vision Quest)
- [x] Generate featured image (triptych) and inline images (Hex, Witches Road, Vision/Ultron)
- [x] Write and publish replacement article (replaced Agatha S2 article ID 6600001)
- [x] Used magazine template (kept from original article's rotation slot)

## Cards Page Improvements
- [x] Add filter/sort by release date order on /cards page (toggle button: Newest First / Oldest First)
