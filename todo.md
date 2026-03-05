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
