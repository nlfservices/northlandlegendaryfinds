# NLF E-Commerce Store Build

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
